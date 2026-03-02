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
  Lock,
  Globe,
  Award,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  folderId?: string; // If undefined, it's in root
  uploadedBy: string;
  tags: string[];
  isStarred: boolean;
}

// --- Mock Data ---
const MOCK_FOLDERS: Folder[] = [
  { id: 'f1', name: 'Case Files 2024', createdAt: new Date('2024-01-15') },
  { id: 'f2', name: 'Contracts', createdAt: new Date('2024-02-01') },
  { id: 'f3', name: 'Legal Research', createdAt: new Date('2024-02-10') },
];

const MOCK_FILES: UploadedFile[] = [
  { id: '1', name: 'Land_Registry_Act_2012.pdf', size: 2400000, type: 'pdf', uploadDate: new Date('2024-03-01'), status: 'completed', folderId: 'f3', uploadedBy: 'kelvin maina', tags: ['Legislation', 'Public'], isStarred: true },
  { id: '2', name: 'Case_Precedents_2023.xlsx', size: 1500000, type: 'xlsx', uploadDate: new Date('2024-02-28'), status: 'completed', folderId: 'f1', uploadedBy: 'kelvin maina', tags: ['Internal', 'Draft'], isStarred: false },
  { id: '3', name: 'Client_Data_Export.csv', size: 450000, type: 'csv', uploadDate: new Date('2024-02-25'), status: 'analyzing', uploadedBy: 'system admin', tags: ['Confidential'], isStarred: false }, // Root
  { id: '4', name: 'Employment_Contract_Template.docx', size: 120000, type: 'docx', uploadDate: new Date('2024-03-05'), status: 'completed', folderId: 'f2', uploadedBy: 'jane doe', tags: ['Template'], isStarred: true },
  { id: '5', name: 'System_Config.json', size: 25000, type: 'json', uploadDate: new Date('2024-03-10'), status: 'completed', uploadedBy: 'tech support', tags: ['System'], isStarred: false }, // Root
];

// --- Constants ---
const FILE_ICONS: Record<string, string> = {
  csv: 'https://cdn-icons-png.flaticon.com/512/8242/8242984.png',
  xlsx: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
  xls: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
  json: 'https://cdn-icons-png.flaticon.com/512/136/136525.png',
  pdf: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg',
  doc: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg',
  docx: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg',
};

const Files: React.FC = () => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS);
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UploadedFile; direction: 'asc' | 'desc' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFiles = (newFiles: File[]) => {
    const processedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      uploadDate: new Date(),
      status: 'analyzing',
      folderId: currentFolderId || undefined,
      uploadedBy: 'Current User',
      tags: [],
      isStarred: false
    }));
    
    setFiles(prev => [...processedFiles, ...prev]);

    // Simulate analysis completion
    setTimeout(() => {
      setFiles(prev => prev.map(f => {
        if (processedFiles.some(pf => pf.id === f.id)) {
          return { ...f, status: Math.random() > 0.1 ? 'completed' : 'error' };
        }
        return f;
      }));
    }, 2000);
  };

  const handleDeleteFile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== id));
      setSelectedFileIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setActiveDropdownId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFileIds.size} files?`)) {
      setFiles(prev => prev.filter(f => !selectedFileIds.has(f.id)));
      setSelectedFileIds(new Set());
    }
  };

  const handleMoveSelected = (targetFolderId: string) => {
    setFiles(prev => prev.map(f => {
      if (selectedFileIds.has(f.id)) {
        return { ...f, folderId: targetFolderId };
      }
      return f;
    }));
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

  const toggleStar = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f));
  };

  const handleSort = (key: keyof UploadedFile) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (name) {
      if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
        alert('A folder with this name already exists.');
        return;
      }
      const newFolder: Folder = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        createdAt: new Date()
      };
      setFolders(prev => [...prev, newFolder]);
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

  const formatTimeAgo = (date: Date) => {
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
    const matchesFolder = f.folderId === (currentFolderId || undefined);
    const matchesStarred = showStarredOnly ? f.isStarred : true;
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
            <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Files & Documents</h1>
            <p className="text-gray-400 text-sm font-medium">Manage your legal repository.</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Storage Card */}
            <div className="relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl bg-blue-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
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
            <div className="relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl bg-purple-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                  <FileIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-purple-100 text-xs font-bold uppercase tracking-wider">Total Files</span>
              </div>
              <div className="text-3xl font-bold text-white relative z-10">{stats.totalFiles}</div>
            </div>

            {/* Folders Card */}
            <div className="relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl bg-orange-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                  <FolderIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-orange-100 text-xs font-bold uppercase tracking-wider">Folders</span>
              </div>
              <div className="text-3xl font-bold text-white relative z-10">{stats.totalFolders}</div>
            </div>

            {/* Types Card */}
            <div className="relative overflow-hidden p-6 rounded-3xl border border-white/20 shadow-xl bg-emerald-600/90 backdrop-blur-xl text-white group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors"></div>
               <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
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
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-black/5 border border-gray-100">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-black">Upload Dataset</h2>
            </div>
            <p className="text-blue-600 text-sm font-medium mb-6">
              Upload CSV, Excel, JSON or PDF files with automatic profiling and quality assessment.
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
            className={`relative border-2 border-dashed rounded-[2rem] p-16 text-center transition-all cursor-pointer group ${
              isDragging 
                ? 'border-blue-500 bg-[#ffe4c2]' 
                : 'border-gray-200 bg-[#fffbf0] hover:border-blue-400'
            }`}
            style={{ backgroundColor: isDragging ? '#ffe4c2' : '#fffbf0' }} // Using a very light cream/yellow similar to the image, user asked for #ffe4c2 which is quite strong, so I'll use it on drag or maybe as a base if they insist. Let's try to match the "cream" look but respect the hex if it's the intended background.
            // Actually, the user said "appy this color #ffe4c2 on thedrop files to upload document space". I will apply it as the background color.
            // #ffe4c2 is Bisque.
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  showStarredOnly 
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
                className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-green-900">{selectedFileIds.size} selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl text-xs font-bold text-green-700 hover:bg-green-50 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    Review in Chat
                  </button>
                  <button 
                    onClick={() => openMoveModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-xl text-xs font-bold text-green-700 hover:bg-green-50 transition-colors"
                  >
                    <FolderInput className="w-4 h-4" />
                    Move to Folder
                  </button>
                  <button 
                    onClick={() => setSelectedFileIds(new Set())}
                    className="px-4 py-2 bg-white border border-green-200 rounded-xl text-xs font-bold text-green-700 hover:bg-green-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Grid/List */}
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm min-h-[400px]">
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
                  <div className="w-5"></div> {/* Checkbox column */}
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
                    onClick={() => handleSort('uploadDate')}
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
                      className={`grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto_auto] gap-4 p-4 items-center hover:bg-gray-50 transition-colors group ${selectedFileIds.has(file.id) ? 'bg-gray-50' : ''}`}
                    >
                      {/* Checkbox */}
                      <div className="w-5 flex justify-center">
                        <input 
                          type="checkbox" 
                          checked={selectedFileIds.has(file.id)}
                          onChange={() => toggleSelection(file.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>

                      {/* Star */}
                      <div className="w-5 flex justify-center">
                        <button onClick={() => toggleStar(file.id)}>
                          <Star className={`w-4 h-4 ${file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} />
                        </button>
                      </div>

                      {/* Name & Tags */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                          {getFileIcon(file.type)}
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
                        {formatTimeAgo(file.uploadDate)}
                      </div>

                      {/* By */}
                      <div className="w-32 text-sm font-medium text-gray-500 truncate">
                        {file.uploadedBy}
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
                              <div className="p-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                  <Sparkles className="w-4 h-4" />
                                  Review in Chat
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                  <Download className="w-4 h-4" />
                                  Download
                                </button>
                                <button 
                                  onClick={() => openMoveModal(file.id)}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                >
                                  <FolderInput className="w-4 h-4" />
                                  Move to Folder
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button 
                                  onClick={() => handleDeleteFile(file.id)}
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
              visibleFolders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FolderIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">This folder is empty.</p>
                </div>
              )
            )}
          </div>
          {/* Compliance & Security Section */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-black flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Bank-Grade Security & Compliance
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your files are encrypted and stored securely in compliance with global standards.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
                    <Lock className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">AES-256</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
                    <Globe className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">GDPR</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
                    <Award className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">ISO 27001</span>
                </div>
                <div className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
                    <Shield className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">SOC 2</span>
                </div>
              </div>
            </div>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
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
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
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
                      className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
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
