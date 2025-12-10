export enum StandardType {
  NATIONAL = 'NATIONAL', // 国标
  INDUSTRY = 'INDUSTRY', // 行标
  REGIONAL = 'REGIONAL', // 地标
}

export interface StandardDocument {
  id: string;
  name: string;
  type: StandardType;
  createTime: string; // ISO Date string
  creator: string;
  fileName?: string;
  fileSize?: number;
}

export interface DocumentFormData {
  name: string;
  type: StandardType;
  file: File | null;
}

// Helper to get display label for StandardType
export const getStandardTypeLabel = (type: StandardType): string => {
  switch (type) {
    case StandardType.NATIONAL: return '国标';
    case StandardType.INDUSTRY: return '行标';
    case StandardType.REGIONAL: return '地标';
    default: return type;
  }
};

// Helper for color coding badges
export const getStandardTypeColor = (type: StandardType): string => {
  switch (type) {
    case StandardType.NATIONAL: return 'bg-red-100 text-red-700 border-red-200';
    case StandardType.INDUSTRY: return 'bg-blue-100 text-blue-700 border-blue-200';
    case StandardType.REGIONAL: return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};