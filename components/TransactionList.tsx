import React from 'react';
import { Transaction, TransactionStatus } from '../types';
import { Search, Filter, ChevronRight, AlertTriangle } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelect: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Transaction Inbox</h2>
        <div className="flex space-x-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search ID or Title..." 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                <Filter className="w-4 h-4" />
            </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount (IDR)</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.transaction_id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{t.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {t.category}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-600">
                  {t.amount_idr.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${t.status === TransactionStatus.PENDING ? 'bg-yellow-50 text-yellow-700' : ''}
                    ${t.status === TransactionStatus.APPROVED ? 'bg-green-50 text-green-700' : ''}
                    ${t.status === TransactionStatus.REJECTED ? 'bg-red-50 text-red-700' : ''}
                  `}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                    {t.ai_analysis ? (
                        <div className="flex items-center space-x-2">
                             <div className={`w-2 h-2 rounded-full ${
                                t.ai_analysis.risk_level === 'HIGH' ? 'bg-red-500' : 
                                t.ai_analysis.risk_level === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
                             }`}></div>
                             <span className="text-sm font-semibold">{t.ai_analysis.risk_score}/100</span>
                        </div>
                    ) : (
                        <span className="text-xs text-gray-400 italic">Not Analyzed</span>
                    )}
                </td>
                <td className="px-6 py-4">
                    <button 
                        onClick={() => onSelect(t.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform"
                    >
                        Review <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
