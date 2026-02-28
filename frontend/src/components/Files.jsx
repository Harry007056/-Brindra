import { motion } from 'framer-motion';
import { 
  Search, 
  Grid, 
  List, 
  FolderPlus,
  Upload,
  File,
  Image,
  Film,
  FileText,
  Download,
  MoreVertical,
  Star,
  Share2,
  Trash2,
  Clock
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
  { id: 1, name: 'Design Assets', count: 24, color: 'from-[#f472b6] to-[#ec4899]' },
  { id: 2, name: 'Project Docs', count: 18, color: 'from-[#5b8def] to-[#3d7bd4]' },
  { id: 3, name: 'Marketing', count: 12, color: 'from-[#4ade80] to-[#22c55e]' },
  { id: 4, name: 'Archive', count: 45, color: 'from-[#fbbf24] to-[#f59e0b]' },
];

const getFileIcon = (type) => {
  switch (type) {
    case 'image': return Image;
    case 'video': return Film;
    case 'archive': return FolderPlus;
    default: return FileText;
  }
};

export default function Files() {
  const [viewMode, setViewMode] = useState('grid');

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#4C566A] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            Files
          </h1>
          <p className="text-[#8B8E7E]">Manage and share your team's files.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-3 rounded-xl bg-[#E0DDD4]/50 text-[#4C566A] font-medium flex items-center gap-2 hover:bg-[#E0DDD4]/80 transition-colors border border-[#E0DDD4]/50">
            <FolderPlus className="w-5 h-5" />
            New Folder
          </button>
          <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#5b8def] to-[#3d7bd4] text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/25 transition-all">
            <Upload className="w-5 h-5" />
            Upload
          </button>
        </div>
      </motion.div>

      {/* Folders */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-[#4C566A] mb-4">Folders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {folders.map((folder, index) => (
            <motion.button
              key={folder.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-5 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 hover:border-[#5E81AC]/30 transition-all group text-left"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${folder.color} flex items-center justify-center mb-3 shadow-lg`}>
                <FolderPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[#4C566A] font-medium group-hover:text-[#5E81AC] transition-colors">{folder.name}</h3>
              <p className="text-[#8B8E7E] text-sm">{folder.count} files</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Files Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#4C566A]">Recent Files</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7c94]" />
              <input 
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50 text-[#4C566A] placeholder-[#8B8E7E] text-sm focus:outline-none focus:border-[#5E81AC] transition-colors"
              />
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F1F3EE]/50 border border-[#E0DDD4]/50">
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'grid' ? 'bg-[#5b8def] text-white' : 'text-[#a8a29e] hover:text-[#4C566A]'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  viewMode === 'list' ? 'bg-[#5b8def] text-white' : 'text-[#a8a29e] hover:text-[#4C566A]'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => {
              const Icon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="p-4 rounded-2xl bg-[#F8F9F6] border border-[#E0DDD4]/50 hover:border-[#5E81AC]/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E0DDD4]/50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#5E81AC]" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-[#1e3a5f]/50 text-[#6b7c94] hover:text-white transition-colors">
                        <Star className={clsx('w-4 h-4', file.starred && 'fill-[#fbbf24] text-[#fbbf24]')} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-[#1e3a5f]/50 text-[#6b7c94] hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1 truncate">{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-[#6b7c94]">
                    <span>{file.size}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
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
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F8F9F6] border border-[#E0DDD4]/50 hover:border-[#5E81AC]/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E0DDD4]/50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#5E81AC]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#4C566A] font-medium truncate">{file.name}</h3>
                  </div>
                  <span className="text-[#8B8E7E] text-sm">{file.size}</span>
                  <span className="text-[#8B8E7E] text-sm hidden sm:block">{file.modified}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                      <Star className={clsx('w-4 h-4', file.starred && 'fill-[#fbbf24] text-[#fbbf24]')} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-[#4C566A] transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[#E0DDD4]/50 text-[#8B8E7E] hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
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
