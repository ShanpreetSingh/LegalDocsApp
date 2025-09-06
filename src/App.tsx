import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DocumentForm from './components/DocumentForm';
import { DocumentType } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const getHeaderContent = () => {
    switch (activeSection) {
      case 'will':
        return {
          title: 'Last Will & Testament',
          subtitle: 'Create a comprehensive will to protect your legacy and provide for your loved ones'
        };
      case 'poa':
        return {
          title: 'Power of Attorney',
          subtitle: 'Authorize trusted individuals to act on your behalf in legal and financial matters'
        };
      default:
        return {
          title: 'Legal Document Generator',
          subtitle: 'Professional legal documents made simple and secure'
        };
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'will':
        return <DocumentForm documentType="will" onBack={() => setActiveSection('home')} />;
      case 'poa':
        return <DocumentForm documentType="poa" onBack={() => setActiveSection('home')} />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={headerContent.title} subtitle={headerContent.subtitle} />
        
        <main className="flex-1 overflow-auto p-8">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;