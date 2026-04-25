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
  BrainCircuit,
  Zap,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/apiClient';
import { ActionSidePanel } from './ActionSidePanel';

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
  csv: 'https://iili.io/qmQhWhB.png',
  xlsx: 'https://iili.io/qmQhcru.jpg',
  xls: 'https://iili.io/qmQhcru.jpg',
  json: 'https://iili.io/qmQhNrg.jpg',
  pdf: 'https://iili.io/qmQhVIV.jpg',
  doc: 'https://iili.io/qmQh17j.png',
  docx: 'https://iili.io/qmQh17j.png',
  default: 'https://iili.io/qmQhe2a.jpg'
};

const Files: React.FC = () => {
  const navigate = useNavigate();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isFilesLoading, setIsFilesLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UploadedFile; direction: 'asc' | 'desc' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track upload ingestion phases per temp file id
  const [ingestionPhase, setIngestionPhase] = useState<Record<string, number>>({});

  const fetchData = async () => {
    setIsFilesLoading(true);
    try {
      const [foldersRes, filesRes] = await Promise.all([
        apiClient.get('/api/folders'),
        apiClient.get('/api/files')
      ]);
      if (foldersRes.ok) setFolders(await foldersRes.json());
      if (filesRes.ok) setFiles(await filesRes.json());
    } catch (error) {
      console.error('Error fetching files/folders:', error);
    } finally {
      setIsFilesLoading(false);
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

  const INGESTION_PHASES = ['Parsing document', 'Extracting entities', 'Vectorizing content', 'Ready'];

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

    // Animate ingestion phases for each temp file
    tempFiles.forEach(tempFile => {
      let phase = 0;
      setIngestionPhase(prev => ({ ...prev, [tempFile.id]: 0 }));
      const interval = setInterval(() => {
        phase++;
        if (phase < INGESTION_PHASES.length) {
          setIngestionPhase(prev => ({ ...prev, [tempFile.id]: phase }));
        } else {
          clearInterval(interval);
        }
      }, 900);
    });

    for (const [index, file] of newFiles.entries()) {
      const formData = new FormData();
      formData.append('document', file);
      if (currentFolderId) formData.append('folderId', currentFolderId);
      try {
        const response = await apiClient.fetch('/api/files/upload', { method: 'POST', body: formData, headers: {} });
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        setFiles(prev => prev.map(f => f.id === tempFiles[index].id ? data.file : f));
        setIngestionPhase(prev => { const next = { ...prev }; delete next[tempFiles[index].id]; return next; });
      } catch (error) {
        console.error('File upload error:', error);
        setFiles(prev => prev.map(f => f.id === tempFiles[index].id ? { ...f, status: 'error' } : f));
        setIngestionPhase(prev => { const next = { ...prev }; delete next[tempFiles[index].id]; return next; });
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

  const handleCreateFolder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      alert('A folder with this name already exists.');
      return;
    }

    try {
      const response = await apiClient.post('/api/folders', { name });

      if (response.ok) {
        const newFolder = await response.json();
        setFolders(prev => [...prev, newFolder]);
        setIsFolderModalOpen(false);
        setNewFolderName('');
      }
    } catch (error) {
      console.error('Create folder error:', error);
    }
  };

  const getFileIcon = (type: string, size = 'w-12 h-12') => {
    const iconUrl = FILE_ICONS[type.toLowerCase()] || FILE_ICONS.default;
    return <img src={iconUrl} alt={type} className={`${size} object-contain transition-transform duration-300 group-hover:scale-110`} referrerPolicy="no-referrer" />;
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
    <div className="flex-1 overflow-y-auto bg-white bg-dots p-8 h-full">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Overview */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Files & Documents Vault</h1>
            <p className="text-gray-500 text-sm font-medium">Your data, always your property. Manage your legal repository. Your files remain secure.</p>
          </div>

          {/* Overview Cards - Clean solid design, no glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Storage Card */}
            <div className="bg-slate-50 border border-blue-100 rounded-xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Storage Used</h3>
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <HardDrive className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 leading-none mb-2">{formatSize(stats.totalSize)}</div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '15%' }} />
                </div>
                <p className="text-[10px] text-gray-400 font-semibold mt-1.5">15% of 5 GB used</p>
              </div>
            </div>

            {/* Total Files Card */}
            <div className="bg-slate-50 border border-purple-100 rounded-xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total Files</h3>
                <div className="p-2.5 bg-purple-50 rounded-xl">
                  <FileIcon className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{stats.totalFiles}</div>
                <p className="text-[10px] text-gray-400 font-semibold">Across all folders</p>
              </div>
            </div>

            {/* Folders Card */}
            <div className="bg-slate-50 border border-orange-100 rounded-xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">Folders</h3>
                <div className="p-2.5 bg-orange-50 rounded-xl">
                  <FolderIcon className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{stats.totalFolders}</div>
                <p className="text-[10px] text-gray-400 font-semibold">Organized collections</p>
              </div>
            </div>

            {/* Types Card */}
            <div className="bg-slate-50 border border-emerald-100 rounded-xl p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group min-h-[140px] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">File Types</h3>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {Object.entries(stats.typeCounts).length > 0 ? Object.entries(stats.typeCounts).slice(0, 4).map(([type, count]) => (
                  <div key={type} className="px-2.5 py-1 bg-emerald-50 rounded-lg text-[10px] font-bold uppercase text-emerald-700 border border-emerald-100">
                    {type}: {count}
                  </div>
                )) : <p className="text-[10px] text-gray-400 font-semibold">No files yet</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-xl p-8 shadow-xl shadow-black/5 border border-gray-100">
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
            className={`relative border-2 border-dashed rounded-xl p-16 text-center transition-all cursor-pointer group ${isDragging
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
              <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
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
                  onClick={() => setIsFolderModalOpen(true)}
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

          {/* Top Banner Removed - Replaced with ActionSidePanel at the end */}

          {/* Content Grid/List */}
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm min-h-[600px] mb-20 p-2">

            {/* Branch 1: Skeleton while loading */}
            {isFilesLoading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-48 bg-gray-200 rounded-full" />
                      <div className="h-2 w-32 bg-gray-100 rounded-full" />
                    </div>
                    <div className="h-3 w-16 bg-gray-100 rounded-full" />
                    <div className="h-3 w-20 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>

            /* Branch 2: Premium empty state */
            ) : visibleFolders.length === 0 && visibleFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
                <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center mb-6">
                  <FolderIcon className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Legal Vault is Empty</h3>
                <p className="text-sm text-gray-500 font-medium max-w-xs leading-relaxed mb-8">
                  Upload your first legal document to start AI-powered analysis, indexing, and case management.
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload First Document
                  </button>
                  {!currentFolderId && (
                    <button
                      onClick={() => setIsFolderModalOpen(true)}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Create Folder
                    </button>
                  )}
                </div>
                <div className="mt-10 flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  End-to-end encrypted · Your data stays yours
                </div>
              </div>

            /* Branch 3: Actual content */
            ) : (
              <>
                {/* Folders Grid (Only at root) */}
                {visibleFolders.length > 0 && (
                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 border-b border-gray-50">
                    {visibleFolders.map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => setCurrentFolderId(folder.id)}
                        className="p-4 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-xl flex flex-col items-center gap-3 transition-all group text-center"
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
                      <div className="w-5"></div>
                      <div className="cursor-pointer hover:text-black flex items-center gap-1" onClick={() => handleSort('name')}>
                        Name <ArrowUpDown className="w-3 h-3" />
                      </div>
                      <div className="w-20 text-center">Type</div>
                      <div className="w-24 cursor-pointer hover:text-black flex items-center gap-1" onClick={() => handleSort('size')}>
                        Size <ArrowUpDown className="w-3 h-3" />
                      </div>
                      <div className="w-40 cursor-pointer hover:text-black flex items-center gap-1" onClick={() => handleSort('created_at')}>
                        Uploaded <ArrowUpDown className="w-3 h-3" />
                      </div>
                      <div className="w-32">By</div>
                      <div className="w-10 text-right">Actions</div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-50">
                      {visibleFiles.map((file) => {
                        const phase = ingestionPhase[file.id];
                        const isIngesting = file.status === 'analyzing' && phase !== undefined;
                        return (
                          <div
                            key={file.id}
                            onClick={() => toggleSelection(file.id)}
                            className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] gap-4 p-5 items-center hover:bg-gray-50 transition-all cursor-pointer group border-b border-transparent ${selectedFileIds.has(file.id) ? 'bg-blue-50/40 border-blue-100' : ''}`}
                          >
                            {/* Checkbox */}
                            <div className="w-5 flex justify-center">
                              <input type="checkbox" checked={selectedFileIds.has(file.id)}
                                onChange={(e) => { e.stopPropagation(); toggleSelection(file.id); }}
                                className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </div>
                            {/* Star */}
                            <div className="w-5 flex justify-center">
                              <button onClick={(e) => { e.stopPropagation(); toggleStar(file.id); }}>
                                <Star className={`w-5 h-5 transition-all ${file.is_starred ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-400'}`} />
                              </button>
                            </div>
                            {/* Name & Ingestion Progress */}
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="relative flex-shrink-0">
                                {getFileIcon(file.type, 'w-12 h-12')}
                                {file.status === 'analyzing' && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white animate-pulse" />}
                                {file.status === 'error' && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />}
                                {file.status === 'completed' && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-black truncate" title={file.name}>{file.name}</span>
                                {isIngesting ? (
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-0.5">
                                      {['Parsing', 'Extracting', 'Vectorizing', 'Ready'].map((step, i) => (
                                        <div key={i} className={`h-1 w-6 rounded-full transition-all duration-500 ${i <= phase ? 'bg-amber-400' : 'bg-gray-200'}`} />
                                      ))}
                                    </div>
                                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">
                                      {['Parsing document', 'Extracting entities', 'Vectorizing', 'Ready'][phase] ?? 'Processing'}
                                    </span>
                                  </div>
                                ) : file.tags.length > 0 ? (
                                  <div className="flex gap-1 mt-0.5">
                                    {file.tags.map(tag => (
                                      <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] font-bold text-gray-500 uppercase">{tag}</span>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            {/* Type */}
                            <div className="w-20 flex justify-center">
                              <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-600">{file.type}</span>
                            </div>
                            {/* Size */}
                            <div className="w-24 text-sm font-medium text-gray-500">{formatSize(file.size)}</div>
                            {/* Uploaded */}
                            <div className="w-40 text-sm font-medium text-gray-500 truncate">{formatTimeAgo(file.created_at)}</div>
                            {/* By */}
                            <div className="w-32 text-sm font-medium text-gray-500 truncate">{file.uploaded_by}</div>
                            {/* Actions */}
                            <div className="w-10 flex justify-end relative action-menu">
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveDropdownId(activeDropdownId === file.id ? null : file.id); }}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              <AnimatePresence>
                                {activeDropdownId === file.id && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                  >
                                    <div className="p-1" onClick={(e) => e.stopPropagation()}>
                                      <button onClick={(e) => { e.stopPropagation(); navigate(`/app/insights/${file.id}?mode=savre`); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                                        <Zap className="w-4 h-4" /> Document Intelligence
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); navigate(`/app/insights/${file.id}`); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                        <BrainCircuit className="w-4 h-4" /> Analyse with AI
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); window.open(`/api/files/${file.id}/view`, '_blank'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                        <Eye className="w-4 h-4" /> View
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); window.open(`/api/files/${file.id}/download`, '_blank'); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                        <Download className="w-4 h-4" /> Download
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); openMoveModal(file.id); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                        <FolderInput className="w-4 h-4" /> Move to Folder
                                      </button>
                                      <div className="h-px bg-gray-100 my-1" />
                                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id); }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
                                        <Trash2 className="w-4 h-4" /> Delete
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        );
                      })}
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
              </>
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

      {/* Folder Creation Modal */}
      <AnimatePresence>
        {isFolderModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[15px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-[15px] flex items-center justify-center text-white shadow-sm">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-black">New Folder</h3>
                </div>
                <button
                  onClick={() => setIsFolderModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-[15px] transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleCreateFolder} className="p-6">
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Folder Name</label>
                  <input
                    type="text"
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. Case Briefs 2026"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 font-medium placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFolderModalOpen(false)}
                    className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-50 rounded-[15px] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="px-6 py-3 bg-black text-white text-sm font-bold rounded-[15px] hover:bg-gray-800 transition-all disabled:opacity-50"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ActionSidePanel
         isOpen={selectedFileIds.size > 0}
         selectedCount={selectedFileIds.size}
         files={files.filter(f => selectedFileIds.has(f.id))}
         onClose={() => setSelectedFileIds(new Set())}
         onMove={() => openMoveModal()}
         onDelete={handleDeleteSelected}
      />
    </div>
  );
};

export default Files;
