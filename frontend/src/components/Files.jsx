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
  Star,
  Share2,
  Trash2,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const files = [
  { id: 1, name: 'Brand Guidelines.pdf', size: '2.4 MB', type: 'document', modified: '2 hours ago', starred: true },
  { id: 2, name: 'Logo Assets.zip', size: '15.8 MB', type: 'archive', modified: '1 day ago', starred: true },
  { id: 3, name: 'Product Screens.png', size: '8.2 MB', type: 'image', modified: '3 days ago', starred: false },
  { id: 4, name: 'Presentation Deck.pptx', size: '5.6 MB', type: 'document', modified: '1 week ago', starred: false },
  { id: 5, name: 'Marketing Video.mp4', size: '124 MB', type: 'video', modified: '2 weeks ago', starred: true },
  { id: 6, name: 'User Research.docx', size: '1.2 MB', type: 'document', modified: '3 weeks ago', starred: false },
  { id: 7, name: 'Icon Set.svg', size: '340 KB', type: 'image', modified: '1 month ago', starred: false },
  { id: 8, name: 'API Documentation.pdf', size: '890 KB', type: 'document', modified: '1 month ago', starred: false },
];

const folders = [
  { id: 1, name: 'Design Assets', count: 24, color: 'from-[#E07A5F] to-[#E07A5F]' },
  { id: 2, name: 'Project Docs', count: 18, color: 'from-primary-dusty-blue to-primary-soft-sky' },
  { id: 3, name: 'Marketing', count: 12, color: 'from-[#A3BE8C] to-[#22c55e]' },
  { id: 4, name: 'Archive', count: 45, color: 'from-[#88C0D0] to-[#5E81AC]' },
];

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

export default function Files() {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-accent-warm-grey">Files</h1>
          <p className="text-text-default">Manage and share your team's files.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-[#88C0D0]/35 bg-background-warm-off-white px-4 py-2.5 text-sm font-medium text-primary-dusty-blue transition hover:bg-background-light-sand">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-primary-dusty-blue px-4 py-2.5 text-sm font-medium text-background-warm-off-white transition hover:bg-primary-soft-sky">
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>
      </motion.div>

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
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'rounded-lg p-2 transition',
                  viewMode === 'list' ? 'bg-primary-dusty-blue text-background-warm-off-white' : 'text-primary-dusty-blue hover:bg-background-light-sand'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file, index) => {
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
                    <div className="flex items-center gap-1">
                      <button className={clsx('rounded-md p-1.5 transition', file.starred ? 'text-[#E07A5F]' : 'text-text-default hover:bg-background-warm-off-white')}>
                        <Star className={clsx('h-4 w-4', file.starred && 'fill-current')} />
                      </button>
                      <button className="rounded-md p-1.5 text-text-default transition hover:bg-background-warm-off-white hover:text-accent-warm-grey">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="truncate text-sm font-medium text-accent-warm-grey">{file.name}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-text-default">
                    <span>{file.size}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {file.modified}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file, index) => {
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
                    <button className={clsx('rounded-md p-1.5 transition', file.starred ? 'text-[#E07A5F]' : 'text-text-default hover:bg-background-warm-off-white')}>
                      <Star className={clsx('h-4 w-4', file.starred && 'fill-current')} />
                    </button>
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-primary-dusty-blue transition hover:bg-background-warm-off-white">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-accent-muted-coral transition hover:bg-background-warm-off-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
