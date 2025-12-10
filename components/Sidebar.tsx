import React from 'react';
import { LayoutDashboard, FileText, Settings, Database, ShieldCheck } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div className="w-[200px] bg-slate-900 h-screen flex flex-col fixed left-0 top-0 z-10 text-white shrink-0 shadow-xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <span>DataGov</span>
        </div>
      </div>

      <nav className="flex-1 py-6 space-y-1">
        <NavItem icon={<LayoutDashboard size={20} />} label="工作台" />
        <NavItem icon={<FileText size={20} />} label="标准文档" active />
        <NavItem icon={<Database size={20} />} label="元数据管理" />
        <NavItem icon={<Settings size={20} />} label="系统配置" />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            AD
          </div>
          <div className="text-sm">
            <div className="font-medium">Admin</div>
            <div className="text-slate-400 text-xs">架构师</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors duration-200
        ${active ? 'bg-blue-600 text-white border-r-4 border-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};