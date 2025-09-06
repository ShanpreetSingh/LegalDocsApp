import React from 'react';
import { Shield, Clock } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-600">
            <Shield className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">Secure & Confidential</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}