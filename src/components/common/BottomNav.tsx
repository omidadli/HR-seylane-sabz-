import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Clock,
  Wallet,
  Menu,
} from 'lucide-react';
import { ModuleKey } from './Sidebar';

interface BottomNavProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  onOpenMobileMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
  onOpenMobileMenu,
}) => {
  const tabs = [
    { key: 'dashboard' as ModuleKey, label: 'پیشخوان', icon: LayoutDashboard },
    { key: 'recruitment' as ModuleKey, label: 'استخدام', icon: UserPlus },
    { key: 'attendance' as ModuleKey, label: 'تردد', icon: Clock },
    { key: 'payroll' as ModuleKey, label: 'حقوق', icon: Wallet },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectModule(tab.key)}
              className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-emerald-100/90 text-emerald-800 scale-105' : ''
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center py-1 px-3 rounded-2xl text-slate-500 hover:text-slate-800 font-medium transition-all cursor-pointer"
        >
          <div className="p-1.5 rounded-xl text-slate-600">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5">سایر بخش‌ها</span>
        </button>
      </div>
    </nav>
  );
};
