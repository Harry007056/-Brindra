import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  FolderPlus,
  Upload,
  Image,
  Film,
  FileText,
  Download,
  MoreVertical,
  Share2,
  Trash2,
  Clock,
} from 'lucide-react';
import { clsx } from 'clsx';
import { toast } from 'react-toastify';
import api from '../api';
import { API_BASE_URL } from '../config';

const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const formatBytes = (bytes) => {
  const value = Number(bytes || 0);
  if (value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let index = 0;
  let size = value;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
};

const fromNow = (value) => {
  if (!value) return 'just now';
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 60000) return 'just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getFileType = (file) => {
  const mime = String(file.mimeType || '').toLowerCase();
  const name = String(file.fileName || '').toLowerCase();

  if (mime.startsWith('image/') || /\.(png|jpg|jpeg|gif|svg|webp)$/.test(name)) return 'image';
  if (mime.startsWith('video/') || /\.(mp4|mov|avi|mkv)$/.test(name)) return 'video';
  if (/(zip|rar|7z|tar|gzip)/.test(mime) || /\.(zip|rar|7z|tar|gz)$/.test(name)) return 'archive';
  return 'document';
};

const getFileIcon = (type) => {
  switch (type) {
    case 'image':
      return Image;
    case 'video':
      return Film;
    case 'archive':
      return FolderPlus;
    default:
      return FileText;
  }
};

const getTypeStyles = (type) => {
  switch (type) {
    case 'image':
      return 'bg-primary-soft-sky/20 text-[#5E81AC]';
    case 'video':
      return 'bg-accent-muted-coral/20 text-[#E07A5F]';
    case 'archive':
      return 'bg-secondary-sage-green/25 text-[#6B8E23]';
    default:
      return 'bg-[#88C0D0]/20 text-[#5E81AC]';
  }
};

const folderColors = [
  'from-[#E07A5F] to-[#E07A5F]',
  'from-primary-dusty-blue to-primary-soft-sky',
  'from-[#A3BE8C] to-[#22c55e]',
  'from-[#88C0D0] to-[#5E81AC]',
];

import { usePlan } from '../contexts/PlanProvider';
import UpgradeModal from './UpgradeModal';

export default function Files({ authUser }) {
  const { hasFeature } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [files, setFiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const folderInputRef = useRef(null);

  const reloadData = useCallback(async () => {
    const [filesRes, projectsRes] = await Promise.all([api.get('/collab/files'), api.get('/collab/projects')]);
    const nextFiles = Array.isArray(filesRes.data) ? filesRes.data : [];
    const nextProjects = Array.isArray(projectsRes.data) ? projectsRes.data : [];
    setFiles(nextFiles);
    setProjects(nextProjects);
    setSelectedProjectId((prev) => (prev || (nextProjects[0]?._id ? String(nextProjects[0]._id) : '')));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!isMounted) return;
        await reloadData();
      } catch {
        if (!isMounted) return;
        setError('Failed to load files');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [reloadData]);

  useEffect(() => {
    if (!selectedProjectId && projects[0]?._id) {
      setSelectedProjectId(String(projects[0]._id));
    }
  }, [projects, selectedProjectId]);

  const visibleFiles = useMemo(() => {
    const term = search.trim().toLowerCase();
    return files
      .filter((file) => String(file.fileName || '').toLowerCase().includes(term))
      .map((file) => ({
        ...file,
        id: String(file._id),
        name: file.fileName,
        size: formatBytes(file.sizeBytes),
        type: getFileType(file),
        modified: fromNow(file.createdAt || file.updatedAt),
      }));
  }, [files, search]);

  const folders = useMemo(() => {
    const counts = files.reduce((acc, file) => {
      const key = String(file.projectId || 'unknown');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([projectId, count], index) => {
      const project = projects.find((item) => String(item._id) === projectId);
      return {
        id: projectId,
        name: project?.name || 'Unassigned',
        count,
        color: folderColors[index % folderColors.length],
      };
    });
  }, [files, projects]);

  const handleNewFolder = async () => {
    const folderName = window.prompt('Enter folder name');
    if (!folderName || !folderName.trim()) return;

    try {
      await api.post('/collab/projects', {
        name: folderName.trim(),
        description: 'Folder created from Files page',
        status: 'active',
        ownerId: authUser?.id || null,
      });
      await reloadData();
      toast.success('Folder created');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create folder');
    }
  };

  const handleUploadFolder = async (event) => {
    const fileList = Array.from(event.target?.files || []);
    if (!fileList.length) return;

    if (!selectedProjectId) {
      toast.error('Select a folder/project first');
      return;
    }

    try {
      for (const file of fileList) {
        await api.post('/collab/files', {
          projectId: selectedProjectId,
          uploaderId: authUser?.id || null,
          fileName: file.name,
          path: file.webkitRelativePath || file.name,
          mimeType: file.type || '',
          sizeBytes: file.size || 0,
        });
      }

      await reloadData();
      toast.success('Folder uploaded');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to upload folder');
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const handleDownload = (file) => {
    const path = String(file.path || '');
    const link = document.createElement('a');
    link.href = path.startsWith('http') ? path : `${FILE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    link.download = file.name || file.fileName || 'file';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (file) => {
    const path = String(file.path || '');
    const shareUrl = path.startsWith('http') ? path : `${FILE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('File link copied');
    } catch {
      toast.error('Failed to copy file link');
    }
  };

  const handleDelete = async (fileId) => {
    if (!fileId) return;
    try {
      await api.delete(`/collab/files/${fileId}`);
      setFiles((prev) => prev.filter((item) => String(item._id) !== String(fileId)));
      toast.success('File deleted');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete file');
    }
  };

  return (
    <div className="space-y-6">
      {hasFeature('files') ? (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-[#D8DEE9]/20 to-background-warm-off-white p-8 text-center shadow-xl backdrop-blur-sm">
            <FolderPlus className="h-12 w-12 text-primary-dusty-blue opacity-50" />
            <h3 className="text-lg font-semibold text-accent-warm-grey">No files yet</h3>
            <p className="text-sm text-text-default">Upload your first file or create a folder.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex cursor-pointer flex-col items-center gap-6 p-12 text-center backdrop-blur-sm before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-accent-muted-coral/70 before:to-accent-muted-coral/20 before:blur-xl hover:before:from-accent-muted-coral/80"
          onClick={() => setShowUpgrade(true)}
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-accent-warm-grey drop-shadow-lg">Files</h1>
            <p className="text-lg font-semibold text-accent-warm-grey drop-shadow-lg">Upgrade to Growth plan</p>
            <p className="text-sm text-white/90">Upload, share, and manage files for your team</p>
          </div>
        </motion.div>
      )}

      {error && <p className="rounded-xl border border-[#E07A5F]/40 bg-[#E07A5F]/10 px-3 py-2 text-sm text-[#4C566A]">{error}</p>}

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
        <h2 className="text-lg font-semibold text-accent-warm-grey">Folders</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {folders.map((folder, index) => (
            <motion.button
              key={folder.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 text-left shadow-sm transition hover:shadow-md"
              type="button"
            >
              <div className={clsx('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', folder.color)} />
              <div className={clsx('mb-3 inline-flex rounded-xl p-2.5 text-background-warm-off-white bg-gradient-to-br', folder.color)}>
                <FolderPlus className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-accent-warm-grey">{folder.name}</h3>
              <p className="text-xs text-text-default">{folder.count} files</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-[#D9E1D7] bg-background-warm-off-white p-4 shadow-sm"
      >
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-lg font-semibold text-accent-warm-grey">Recent Files</h2>
          <div className="flex w-full gap-2 lg:w-auto">
            <div className="relative flex-1 lg:min-w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-dusty-blue" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search files..."
                className="w-full rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white py-2.5 pl-10 pr-3 text-sm text-accent-warm-grey outline-none transition focus:border-primary-soft-sky focus:ring-2 focus:ring-primary-soft-sky/30"
              />
            </div>
            <div className="inline-flex rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'rounded-lg p-2 transition',
                  viewMode === 'grid' ? 'bg-primary-dusty-blue text-background-warm-off-white' : 'text-primary-dusty-blue hover:bg-background-light-sand'
                )}
                type="button"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'rounded-lg p-2 transition',
                  viewMode === 'list' ? 'bg-primary-dusty-blue text-background-warm-off-white' : 'text-primary-dusty-blue hover:bg-background-light-sand'
                )}
                type="button"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleFiles.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="rounded-xl border border-[#88C0D0]/20 bg-background-warm-off-white p-3"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className={clsx('rounded-lg p-2.5', getTypeStyles(file.type))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <button className="rounded-md p-1.5 text-text-default transition hover:bg-background-warm-off-white hover:text-accent-warm-grey" type="button">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="truncate text-sm font-medium text-accent-warm-grey">{file.name}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-default">
                    <span>{file.size}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {file.modified}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button" onClick={() => handleShare(file)}>
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-accent-muted-coral transition hover:bg-background-warm-off-white" type="button" onClick={() => handleDelete(file.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {visibleFiles.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[#88C0D0]/20 bg-background-warm-off-white p-3 lg:flex-nowrap"
                >
                  <div className={clsx('rounded-lg p-2.5', getTypeStyles(file.type))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-accent-warm-grey">{file.name}</h3>
                  </div>
                  <span className="text-xs text-text-default lg:min-w-20">{file.size}</span>
                  <span className="text-xs text-text-default lg:min-w-28">{file.modified}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button" onClick={() => handleShare(file)}>
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white" type="button" onClick={() => handleDownload(file)}>
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-accent-muted-coral transition hover:bg-background-warm-off-white" type="button" onClick={() => handleDelete(file.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {!loading && visibleFiles.length === 0 && <p className="text-sm text-text-default">No files available.</p>}
      {loading && <p className="text-sm text-text-default">Loading files...</p>}
        <UpgradeModal 
          isOpen={showUpgrade} 
          onClose={() => setShowUpgrade(false)}
          requiredPlan="growth" 
        />
    </div>
  );
}

