import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Upload,
  Search,
  MoreVertical,
  Download,
  Trash2,
  Filter,
  FolderPlus,
  Folder as FolderIcon,
  ChevronRight,
  Home,
  PieChart,
  HardDrive,
  File as FileIcon,
  ArrowLeft,
  Sparkles,
  Eye,
  FolderInput,
  X,
  Star,
  Shield,
  ArrowUpDown,
  Globe,
  AudioWaveform,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
// import { auth } from '../lib/firebase';
import { apiClient } from '../lib/apiClient';

// --- Types ---
interface Folder {
  id: string;
  name: string;
  created_at: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  status: 'analyzing' | 'completed' | 'error';
  folder_id?: string;
  uploaded_by: string;
  tags: string[];
  is_starred: boolean;
}

// --- Mock Data ---
const MOCK_FOLDERS: Folder[] = [];
const MOCK_FILES: UploadedFile[] = [];

// --- Constants ---
const FILE_ICONS: Record<string, string> = {
  csv: 'https://cdn-icons-png.flaticon.com/512/8242/8242984.png',
  xlsx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/512px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png',
  xls: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/512px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png',
  json: 'https://cdn-icons-png.flaticon.com/512/136/136525.png',
  pdf: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
  doc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg/512px-Microsoft_Office_Word_%282019%E2%80%93present%29.svg.png',
  docx: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg/512px-Microsoft_Office_Word_%282019%E2%80%93present%29.svg.png',
};

const Files: React.FC = () => {
  const navigate = useNavigate();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UploadedFile; direction: 'asc' | 'desc' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [foldersRes, filesRes] = await Promise.all([
        apiClient.get('/api/folders'),
        apiClient.get('/api/files')
      ]);

      if (foldersRes.ok) setFolders(await foldersRes.json());
      if (filesRes.ok) setFiles(await filesRes.json());
    } catch (error) {
      console.error('Error fetching files/folders:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdownId && !(event.target as Element).closest('.action-menu')) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdownId]);

  // --- Derived State for Overview ---
  const stats = useMemo(() => {
    const totalFiles = files.length;
    const totalFolders = folders.length;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    // File type breakdown
    const typeCounts: Record<string, number> = {};
    files.forEach(f => {
      const type = f.type.toLowerCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return { totalFiles, totalFolders, totalSize, typeCounts };
  }, [files, folders]);

  const currentFolder = folders.find(f => f.id === currentFolderId);

  // --- Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const tempFiles: UploadedFile[] = newFiles.map(file => ({
      id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      created_at: new Date().toISOString(),
      status: 'analyzing',
      folder_id: currentFolderId || undefined,
      uploaded_by: 'You',
      tags: [],
      is_starred: false
    }));

    setFiles(prev => [...tempFiles, ...prev]);

    for (const [index, file] of newFiles.entries()) {
      const formData = new FormData();
      formData.append('document', file);
      if (currentFolderId) formData.append('folderId', currentFolderId);

      try {
        const response = await apiClient.fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
          // Note: Browser handles Content-Type for FormData
          headers: {} 
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();

        setFiles(prev => prev.map(f => f.id === tempFiles[index].id ? data.file : f));
      } catch (error) {
        console.error('File upload error:', error);
        setFiles(prev => prev.map(f => f.id === tempFiles[index].id ? { ...f, status: 'error' } : f));
      }
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await apiClient.delete(`/api/files/${id}`);

        if (response.ok) {
          setFiles(prev => prev.filter(f => f.id !== id));
          setSelectedFileIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
      setActiveDropdownId(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFileIds.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedFileIds.size} files?`)) {
      try {
        const response = await apiClient.post('/api/files/bulk-delete', {
          ids: Array.from(selectedFileIds)
        });

        if (response.ok) {
          const { count } = await response.json();
          setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
          setSelectedFileIds(new Set());
          setActiveDropdownId(null);
        }
      } catch (error) {
        console.error('Bulk delete error:', error);
      }
    }
  };

  const handleMoveSelected = async (targetFolderId: string) => {
    try {
      for (const id of Array.from(selectedFileIds)) {
        await apiClient.patch(`/api/files/${id}`, { folder_id: targetFolderId });
      }
      fetchData(); // Refresh all
    } catch (error) {
      console.error('Move error:', error);
    }
    setSelectedFileIds(new Set());
    setIsMoveModalOpen(false);
  };

  const openMoveModal = (fileId?: string) => {
    if (fileId) {
      setSelectedFileIds(new Set([fileId]));
    }
    setIsMoveModalOpen(true);
    setActiveDropdownId(null);
  };

  const toggleSelection = (id: string) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleStar = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    try {
      const response = await apiClient.patch(`/api/files/${id}/star`, 
        { is_starred: !file.is_starred }
      );

      if (response.ok) {
        const updated = await response.json();
        setFiles(prev => prev.map(f => f.id === id ? updated : f));
      }
    } catch (error) {
      console.error('Star error:', error);
    }
  };

  const handleSort = (key: keyof UploadedFile) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter folder name:");
    if (name) {
      if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
        alert('A folder with this name already exists.');
        return;
      }

      try {
        const response = await apiClient.post('/api/folders', { name });

        if (response.ok) {
          const newFolder = await response.json();
          setFolders(prev => [...prev, newFolder]);
        }
      } catch (error) {
        console.error('Create folder error:', error);
      }
    }
  };

  const getFileIcon = (type: string) => {
    const iconUrl = FILE_ICONS[type.toLowerCase()];
    if (iconUrl) {
      return <img src={iconUrl} alt={type} className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />;
    }
    return <FileIcon className="w-6 h-6 text-gray-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'less than a minute ago';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  // --- Filtering ---
  const filteredFolders = folders.filter(f =>
    !currentFolderId && // Only show folders at root (simple 1-level depth for now, or could be recursive if we added parentId)
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleFolders = currentFolderId ? [] : filteredFolders;

  let visibleFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = f.folder_id === (currentFolderId || undefined);
    const matchesStarred = showStarredOnly ? f.is_starred : true;
    return matchesSearch && matchesFolder && matchesStarred;
  });

  if (sortConfig) {
    visibleFiles.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafafa] bg-dots p-8 h-full">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Overview */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Files & Documents Vault</h1>
            <p className="text-gray-500 text-sm font-medium">Your data, always your property. Manage your legal repository. Your files remain secure.</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Storage Card */}
            <div className="relative overflow-hidden p-6 rounded-[15px] border border-white/20 shadow-xl bg-blue-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                  <HardDrive className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Storage</span>
              </div>
              <div className="text-3xl font-bold text-white mb-4 tracking-tight relative z-10">{formatSize(stats.totalSize)}</div>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden backdrop-blur-sm relative z-10">
                <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Total Files Card */}
            <div className="relative overflow-hidden p-6 rounded-[15px] border border-white/20 shadow-xl bg-purple-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                  <FileIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Files</span>
              </div>
              <div className="text-3xl font-bold text-white relative z-10">{stats.totalFiles}</div>
            </div>

            {/* Folders Card */}
            <div className="relative overflow-hidden p-6 rounded-[15px] border border-white/20 shadow-xl bg-orange-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                  <FolderIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-100 text-xs font-bold uppercase tracking-wider">Folders</span>
              </div>
              <div className="text-3xl font-bold text-white relative z-10">{stats.totalFolders}</div>
            </div>

            {/* Types Card */}
            <div className="relative overflow-hidden p-6 rounded-[15px] border border-white/20 shadow-xl bg-emerald-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md shadow-inner">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Types</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1 relative z-10">
                {Object.entries(stats.typeCounts).slice(0, 4).map(([type, count]) => (
                  <div key={type} className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase text-white border border-white/10 shadow-sm">
                    {type}: {count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-[15px] p-8 shadow-xl shadow-black/5 border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-black">Upload Documents</h2>
            </div>
            <p className="text-blue-600 text-sm font-medium mb-6">
              Upload legal documents for AI-powered analysis, indexing, and case management.
            </p>

            {/* File Type Badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { type: 'csv', label: 'CSV' },
                { type: 'xlsx', label: 'Excel' },
                { type: 'json', label: 'JSON' },
                { type: 'pdf', label: 'PDF' },
                { type: 'docx', label: 'Word' }
              ].map((badge) => (
                <div key={badge.type} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={FILE_ICONS[badge.type]} alt={badge.label} className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
                  <span className="text-xs font-bold text-gray-600">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`relative border-2 border-dashed rounded-[15px] p-16 text-center transition-all cursor-pointer group ${isDragging
              ? 'border-blue-500 bg-[#ffe4c2]'
              : 'border-gray-200 bg-[#fffbf0] hover:border-blue-400'
              }`}
            style={{ backgroundColor: isDragging ? '#ffe4c2' : '#fffbf0' }} 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileSelect}
            />

            <div className="flex flex-col items-center justify-center gap-6">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-black mb-2">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
                  Supports CSV, Excel, JSON, and ZIP archives up to 50MB
                </p>
              </div>

              {/* Bottom Icons */}
              <div className="flex items-center gap-4 mt-2 opacity-40">
                <FileIcon className="w-5 h-5 text-gray-400" />
                <FileIcon className="w-5 h-5 text-gray-400" />
                <FileIcon className="w-5 h-5 text-gray-400" />
                <FileIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* File Manager */}
        <div className="space-y-6 pb-20">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentFolderId ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentFolderId(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-black" />
                  </button>
                  <div className="flex items-center gap-2 text-lg font-bold text-black">
                    <FolderIcon className="w-5 h-5 text-gray-400" />
                    <span>{currentFolder?.name}</span>
                  </div>
                </div>
              ) : (
                <h2 className="text-xl font-bold text-black">All Files</h2>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showStarredOnly
                  ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <Star className={`w-4 h-4 ${showStarredOnly ? 'fill-yellow-600' : ''}`} />
                Starred
              </button>

              {!currentFolderId && (
                <button
                  onClick={handleCreateFolder}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all"
                >
                  <FolderPlus className="w-4 h-4" />
                  New Folder
                </button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>
          </div>

          {/* Selection Banner */}
          <AnimatePresence>
            {selectedFileIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between shadow-xl"
              >
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-lg font-black text-green-900 leading-none">{selectedFileIds.size} selected</span>
                    <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mt-1">Ready for Action</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/insights?fileId=${Array.from(selectedFileIds).join(',')}`);
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-green-200 rounded-2xl text-sm font-black text-green-700 hover:bg-green-50 transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-5 h-5" />
                    Review in Chat
                  </button>
                  <button
                    onClick={(e) => {
                       e.stopPropagation();
                       openMoveModal();
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-white border border-green-200 rounded-2xl text-sm font-black text-green-700 hover:bg-green-50 transition-all shadow-sm hover:scale-105 active:scale-95"
                  >
                    <FolderInput className="w-5 h-5" />
                    Move to Folder
                  </button>
                  <button
                    onClick={(e) => {
                       e.stopPropagation();
                       setSelectedFileIds(new Set());
                    }}
                    className="px-8 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteSelected();
                    }}
                    className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white rounded-2xl text-sm font-black hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid/List */}
          <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[600px] mb-20 p-2">
            {/* Folders Grid (Only at root) */}
            {visibleFolders.length > 0 && (
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 border-b border-gray-50">
                {visibleFolders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="p-4 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-2xl flex flex-col items-center gap-3 transition-all group text-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <FolderIcon className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700 truncate w-full">{folder.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Files Table */}
            {visibleFiles.length > 0 ? (
              <div className="w-full">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] gap-4 p-4 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider items-center">
                  <div className="w-5 flex justify-center">
                    <input
                      type="checkbox"
                      checked={visibleFiles.length > 0 && selectedFileIds.size === visibleFiles.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFileIds(new Set(visibleFiles.map(f => f.id)));
                        } else {
                          setSelectedFileIds(new Set());
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div> 
                  <div className="w-5"></div> {/* Star column */}
                  <div
                    className="cursor-pointer hover:text-black flex items-center gap-1"
                    onClick={() => handleSort('name')}
                  >
                    Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                  <div className="w-20 text-center">Type</div>
                  <div
                    className="w-24 cursor-pointer hover:text-black flex items-center gap-1"
                    onClick={() => handleSort('size')}
                  >
                    Size <ArrowUpDown className="w-3 h-3" />
                  </div>
                  <div
                    className="w-40 cursor-pointer hover:text-black flex items-center gap-1"
                    onClick={() => handleSort('created_at')}
                  >
                    Uploaded <ArrowUpDown className="w-3 h-3" />
                  </div>
                  <div className="w-32">By</div>
                  <div className="w-10 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-50">
                  {visibleFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => toggleSelection(file.id)}
                      className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] gap-4 p-5 items-center hover:bg-gray-50 transition-all cursor-pointer group border-b border-transparent ${selectedFileIds.has(file.id) ? 'bg-blue-50/40 border-blue-100' : ''}`}
                    >
                      {/* Checkbox */}
                      <div className="w-5 flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedFileIds.has(file.id)}
                          onChange={(e) => {
                             e.stopPropagation();
                             toggleSelection(file.id);
                          }}
                          className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-transform active:scale-90"
                        />
                      </div>

                      {/* Star */}
                      <div className="w-5 flex justify-center">
                        <button onClick={(e) => {
                           e.stopPropagation();
                           toggleStar(file.id);
                        }}>
                          <Star className={`w-5 h-5 transition-all ${file.is_starred ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-400'}`} />
                        </button>
                      </div>

                      {/* Name & Tags */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-8 h-8 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                          {getFileIcon(file.type)}
                          {file.status === 'analyzing' && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
                          )}
                          {file.status === 'error' && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                          )}
                          {file.status === 'completed' && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-black truncate" title={file.name}>{file.name}</span>
                          {file.tags.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {file.tags.map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase tracking-wide">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Type */}
                      <div className="w-20 flex justify-center">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-600">
                          {file.type}
                        </span>
                      </div>

                      {/* Size */}
                      <div className="w-24 text-sm font-medium text-gray-500">
                        {formatSize(file.size)}
                      </div>

                      {/* Uploaded */}
                      <div className="w-40 text-sm font-medium text-gray-500 truncate">
                        {formatTimeAgo(file.created_at)}
                      </div>

                      {/* By */}
                      <div className="w-32 text-sm font-medium text-gray-500 truncate">
                        {file.uploaded_by}
                      </div>

                      {/* Actions */}
                      <div className="w-10 flex justify-end relative action-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownId(activeDropdownId === file.id ? null : file.id);
                          }}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {activeDropdownId === file.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                            >
                              <div className="p-1" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/app/intelligence-hub/${file.id}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors text-left"
                                >
                                  <AudioWaveform className="w-4 h-4" />
                                  Analyze with S.A.V.R.E.
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/app/intelligence-hub/${file.id}`);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <BrainCircuit className="w-4 h-4" />
                                  Intelligence Hub
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/api/files/${file.id}/view`, '_blank');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`/api/files/${file.id}/download`, '_blank');
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openMoveModal(file.id);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <FolderInput className="w-4 h-4" />
                                  Move to Folder
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFile(file.id);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-[15px] flex items-center justify-center mb-4">
                  <FileIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-black mb-1">No files found</h3>
                <p className="text-sm text-gray-400">Upload documents or change your search/filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Security and Compliance Section */}
        <div className="pt-8 pb-16">
          <div className="bg-white rounded-[15px] border border-gray-100 overflow-hidden group shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 space-y-8 border-r border-gray-50">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-7 h-7 text-blue-600" />
                    <h2 className="text-2xl font-bold text-black tracking-tight">Security and Compliance</h2>
                  </div>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed">
                    Enterprise-grade security and compliance certifications ensuring your sensitive legal data never leaves your control.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="text-xs font-black text-blue-600 uppercase tracking-widest">SOC 2 Type II</div>
                    <p className="text-[11px] font-bold text-gray-400 leading-tight">Audited controls protect every case on the Lawlify platform.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-black text-emerald-600 uppercase tracking-widest">GDPR</div>
                    <p className="text-[11px] font-bold text-gray-400 leading-tight">Strict data protection and privacy standards by design.</p>
                  </div>
                </div>
              </div>

              <div className="bg-black p-12 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4 font-display italic">"Your data, always your property."</h3>
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-white text-black rounded-[15px] text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                      Learn More
                    </button>
                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Verification ID: LWL-AI-2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
              Encrypted at rest (AES-256) & In Transit (TLS 1.3)
            </p>
          </div>
        </div>

      </div>

      {/* Move to Folder Modal */}
      <AnimatePresence>
        {isMoveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[15px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-black">Move to Folder</h3>
                <button
                  onClick={() => setIsMoveModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveSelected('')} // Move to root
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-[15px] transition-colors text-left group"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Home className="w-5 h-5 text-gray-500" />
                    </div>
                    <span className="font-medium text-gray-700">All Files (Root)</span>
                  </button>

                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => handleMoveSelected(folder.id)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-[15px] transition-colors text-left group"
                    >
                      <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FolderIcon className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="font-medium text-gray-700">{folder.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Files;
