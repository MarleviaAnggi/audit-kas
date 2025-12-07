import React, { useState } from 'react';
import { LayoutDashboard, List, Bell, User, Settings } from 'lucide-react';
import { Transaction, ViewState, TransactionStatus } from './types';
import { MOCK_TRANSACTIONS, APP_NAME } from './constants';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { TransactionDetail } from './components/TransactionDetail';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  // Handle transaction update (e.g., after analysis or status change)
  const updateTransaction = (updated: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleSelectTransaction = (id: string) => {
    setSelectedTransactionId(id);
    setView('DETAIL');
  };

  const currentTransaction = transactions.find(t => t.id === selectedTransactionId);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">AG</span>
            </div>
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Enterprise Audit System</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('DASHBOARD')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === 'DASHBOARD' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setView('LIST')}
             className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${view === 'LIST' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <List className="w-5 h-5" />
            <span>Transactions</span>
            <span className="ml-auto bg-blue-500 text-xs px-2 py-0.5 rounded-full">
                {transactions.filter(t => t.status === TransactionStatus.PENDING).length}
            </span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="flex items-center space-x-3 text-slate-300 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-white">Auditor Internal</p>
                    <p className="text-xs">audit@company.com</p>
                </div>
                <Settings className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex justify-between items-center px-8 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-700">
            {view === 'DASHBOARD' && 'System Overview'}
            {view === 'LIST' && 'Transaction Management'}
            {view === 'DETAIL' && 'Audit Workspace'}
          </h2>
          <div className="flex items-center space-x-4">
             <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
            {view === 'DASHBOARD' && (
                <Dashboard transactions={transactions} onViewList={() => setView('LIST')} />
            )}
            {view === 'LIST' && (
                <TransactionList transactions={transactions} onSelect={handleSelectTransaction} />
            )}
            {view === 'DETAIL' && currentTransaction && (
                <TransactionDetail 
                    transaction={currentTransaction} 
                    onBack={() => setView('LIST')}
                    onUpdateTransaction={updateTransaction}
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
