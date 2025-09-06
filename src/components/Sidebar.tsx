import React from 'react';
import { FileText, Scale, Home, CreditCard } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'will', label: 'Last Will & Testament', icon: FileText },
    { id: 'poa', label: 'Power of Attorney', icon: Scale },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">LegalDocs</h1>
            <p className="text-sm text-slate-400">Document Generator</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 text-slate-400">
          <CreditCard className="h-5 w-5" />
          <span className="text-sm">Secure Document Generation</span>
        </div>
      </div>
    </div>
  );
}