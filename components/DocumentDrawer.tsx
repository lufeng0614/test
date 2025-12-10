import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StandardType, DocumentFormData, getStandardTypeLabel } from '../types';

interface DocumentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFormData) => void;
}

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_EXTENSIONS = ['.rar', '.zip', '.doc', '.docx', '.pdf'];

export const DocumentDrawer: React.FC<DocumentDrawerProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<StandardType>(StandardType.NATIONAL);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when drawer opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setType(StandardType.NATIONAL);
      setFile(null);
      setError(null);
    }
  }, [isOpen]);

  const validateFile = (selectedFile: File): boolean => {
    // Check size
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`文件大小不能超过 ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }

    // Check extension
    const fileName = selectedFile.name.toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!isValidExt) {
      setError(`仅支持上传 ${ALLOWED_EXTENSIONS.join(', ')} 格式文件`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (validateFile(selected)) {
        setFile(selected);
      } else {
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
       if (validateFile(selected)) {
        setFile(selected);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (name.length < 1 || name.length > 128) {
      setError('文档名称长度必须在 1-128 字符之间');
      return;
    }

    if (!file) {
      setError('请上传标准文件');
      return;
    }

    onSubmit({ name, type, file });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel - Left Side as requested */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-out transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '45%' }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">新建标准文档</h2>
            <p className="text-sm text-gray-500 mt-1">上传并录入新的数据标准文件</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="docForm" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                文档名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={128}
                placeholder="请输入文档名称 (1-128字符)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
              <div className="flex justify-between text-xs text-gray-400">
                 <span>支持中文、英文、数字</span>
                 <span className={name.length > 120 ? 'text-orange-500' : ''}>{name.length}/128</span>
              </div>
            </div>

            {/* Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                标准类型 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {Object.values(StandardType).map((t) => (
                  <label 
                    key={t}
                    className={`
                      relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${type === t 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600'}
                    `}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={() => setType(t)}
                      className="hidden"
                    />
                    <span className="font-medium">{getStandardTypeLabel(t)}</span>
                    {type === t && (
                      <div className="absolute top-2 right-2 text-blue-500">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                文件上传 <span className="text-red-500">*</span>
              </label>
              
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                  ${file ? 'bg-green-50/50 border-green-200' : ''}
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".rar,.zip,.doc,.docx,.pdf"
                />
                
                {file ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                      <File size={32} />
                    </div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                        }}
                        className="mt-4 text-xs text-red-500 hover:underline"
                    >
                        重新上传
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">点击或拖拽文件到此处</p>
                    <p className="text-xs text-gray-500 mt-2">
                      支持 .rar .zip .doc .docx .pdf (最大 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm animate-in slide-in-from-top-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white hover:shadow-sm transition-all"
          >
            取消
          </button>
          <button
            type="submit"
            form="docForm"
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all active:scale-95"
          >
            确认提交
          </button>
        </div>
      </div>
    </>
  );
};