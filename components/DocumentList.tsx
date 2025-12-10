import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, FileText, Download, MoreVertical, Filter, AlertCircle } from 'lucide-react';
import { StandardDocument, getStandardTypeLabel, getStandardTypeColor } from '../types';

interface DocumentListProps {
  documents: StandardDocument[];
  onAddClick: () => void;
  onDelete: (ids: string[]) => void;
  onEdit: (doc: StandardDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onAddClick, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.creator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  // Handle Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredDocs.map(d => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Handle Individual Select
  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`确定要删除选中的 ${selectedIds.size} 个文档吗?`)) {
      onDelete(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-8 min-h-screen overflow-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">标准文档管理</h1>
        <p className="text-gray-500 text-sm">维护企业数据标准，关联国家、行业及地方标准文件。</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="搜索文档名称、创建人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-200">
            <Filter size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {selectedIds.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 size={16} />
              <span>批量删除 ({selectedIds.size})</span>
            </button>
          )}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>新建文档</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={filteredDocs.length > 0 && selectedIds.size === filteredDocs.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-medium">文档名称</th>
                <th className="p-4 font-medium">类型</th>
                <th className="p-4 font-medium">创建用户</th>
                <th className="p-4 font-medium">创建时间</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <FileText size={24} className="text-gray-300" />
                      </div>
                      <p>暂无文档数据</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(doc.id)}
                        onChange={() => handleSelectOne(doc.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/50 text-blue-600 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors cursor-pointer" onClick={() => onEdit(doc)}>
                            {doc.name}
                          </div>
                          {doc.fileName && (
                             <div className="text-xs text-gray-400 mt-0.5">{doc.fileName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStandardTypeColor(doc.type)}`}>
                        {getStandardTypeLabel(doc.type)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {doc.creator.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-600">{doc.creator}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-xs">
                      {new Date(doc.createTime).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="下载">
                           <Download size={16} />
                         </button>
                         <button 
                            onClick={() => {
                                if (window.confirm('确认删除该文档?')) onDelete([doc.id]);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="删除">
                           <Trash2 size={16} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
           <span>显示 {filteredDocs.length} 条记录</span>
           <div className="flex gap-2">
              <button disabled className="px-3 py-1 border rounded disabled:opacity-50">上一页</button>
              <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50">下一页</button>
           </div>
        </div>
      </div>
    </div>
  );
};