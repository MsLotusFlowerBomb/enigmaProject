import { useState } from 'react';
import { Building2, FileText, Camera, CreditCard, Wrench, Home } from 'lucide-react';
import Marketplace from './components/Marketplace';
import Leases from './components/Leases';
import Inspections from './components/Inspections';
import Invoices from './components/Invoices';
import Maintenance from './components/Maintenance';

const navItems = [
  { id: 'marketplace', label: 'Marketplace', icon: Building2 },
  { id: 'leases', label: 'Leases', icon: FileText },
  { id: 'inspections', label: 'Inspections', icon: Camera },
  { id: 'financials', label: 'Financials', icon: CreditCard },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
];

export default function App() {
  const [activeView, setActiveView] = useState('marketplace');

  const renderView = () => {
    switch (activeView) {
      case 'marketplace': return <Marketplace />;
      case 'leases': return <Leases />;
      case 'inspections': return <Inspections />;
      case 'financials': return <Invoices />;
      case 'maintenance': return <Maintenance />;
      default: return <Marketplace />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-blue-900 to-slate-900 flex flex-col">
        {/* Branding */}
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-500 rounded-lg p-2">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-xl font-bold">PropMate</span>
          </div>
          <p className="text-blue-300 text-xs ml-11">AI PropTech Platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
                activeView === id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <p className="text-blue-400 text-xs text-center">South Africa © 2024</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

