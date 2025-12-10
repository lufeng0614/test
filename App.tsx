import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DocumentList } from './components/DocumentList';
import { DocumentDrawer } from './components/DocumentDrawer';
import { StandardDocument, StandardType, DocumentFormData } from './types';

// Initial Mock Data
const MOCK_DATA: StandardDocument[] = [
  {
    id: '1',
    name: '数据资产管理实践白皮书 5.0',
    type: StandardType.INDUSTRY,
    createTime: '2023-10-15T09:30:00.000Z',
    creator: '张三',
    fileName: 'data_asset_whitepaper_v5.pdf',
    fileSize: 5242880
  },
  {
    id: '2',
    name: 'GB/T 36073-2018 数据管理能力成熟度评估模型',
    type: StandardType.NATIONAL,
    createTime: '2023-11-01T14:20:00.000Z',
    creator: '李四',
    fileName: 'DCMM_GBT_36073.pdf',
    fileSize: 2048000
  },
  {
    id: '3',
    name: 'XX市公共数据分类分级指南',
    type: StandardType.REGIONAL,
    createTime: '2023-12-10T11:00:00.000Z',
    creator: '王五',
    fileName: 'city_public_data_guide.docx',
    fileSize: 1024000
  },
];

export default function App() {
  const [documents, setDocuments] = useState<StandardDocument[]>(MOCK_DATA);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Handlers
  const handleDelete = (ids: string[]) => {
    setDocuments(prev => prev.filter(doc => !ids.includes(doc.id)));
  };

  const handleAdd = (formData: DocumentFormData) => {
    const newDoc: StandardDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      type: formData.type,
      createTime: new Date().toISOString(),
      creator: '当前用户', // Mock current user
      fileName: formData.file?.name,
      fileSize: formData.file?.size
    };

    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleEdit = (doc: StandardDocument) => {
      // In a real app, this would open the drawer with pre-filled data.
      // For this demo, we'll just log it as the requirements prioritized "Add" and "List" features.
      console.log("Edit requested for", doc.id);
      // Optional: Reuse the drawer for editing
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* 1. Left Sidebar (Fixed 200px) */}
      <Sidebar />

      {/* 2. Main Content Area (Offset by 200px) */}
      <main className="ml-[200px] w-full min-h-screen">
        <DocumentList 
          documents={documents}
          onAddClick={() => setIsDrawerOpen(true)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>

      {/* 3. Slide-out Drawer (Left side, 45% width) */}
      <DocumentDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
}