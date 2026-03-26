import React, { useState } from 'react';
import { 
  File, 
  Folder, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  ExternalLink, 
  Clock, 
  Info,
  ChevronRight,
  Database,
  Grid
} from 'lucide-react';
import { motion } from 'motion/react';

interface ExplorerFile {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'sheet';
  mime_type?: string;
  last_modified: string;
  size?: string;
}

interface IntegrationExplorerProps {
  provider: string;
  files: ExplorerFile[];
  onFileClick: (file: ExplorerFile) => void;
  isLoading: boolean;
}

const IntegrationExplorer: React.FC<IntegrationExplorerProps> = ({ provider, files, onFileClick, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'file' | 'folder' | 'sheet'>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="w-5 h-5 text-blue-500" />;
      case 'sheet': return <Grid className="w-5 h-5 text-green-500" />;
      default: return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl">
      {/* Search and Filters Header */}
      <div className="p-6 border-b border-gray-100/50 bg-white/30">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder={`Search in ${provider}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
            {(['all', 'folder', 'file', 'sheet'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filterType === type 
                    ? 'bg-white text-black shadow-sm border border-gray-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explorer List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 opacity-50">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Indexing DataIQ...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-6 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
              <Database className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black mb-2">No items found</h3>
              <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/50 backdrop-blur-md z-10">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Last Modified</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">Size</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, idx) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onFileClick(file)}
                  className="group hover:bg-primary/5 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-5 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {getIcon(file.type)}
                      </div>
                      <span className="text-sm font-bold text-black group-hover:text-primary transition-colors">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 border-b border-gray-50 text-sm text-gray-400 font-medium">
                    {formatDate(file.last_modified)}
                  </td>
                  <td className="px-8 py-5 border-b border-gray-50 text-sm text-gray-400 font-medium">
                    {file.size || '--'}
                  </td>
                  <td className="px-8 py-5 border-b border-gray-50 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Info className="w-3 h-3" />
          Showing {filteredFiles.length} items from {provider}
        </p>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:underline">
          View in {provider}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default IntegrationExplorer;
