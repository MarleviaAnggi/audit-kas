import React from 'react';
import { Transaction, TransactionStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { AlertCircle, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  onViewList: () => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC<DashboardProps> = ({ transactions, onViewList }) => {
  const pendingCount = transactions.filter(t => t.status === TransactionStatus.PENDING).length;
  const approvedCount = transactions.filter(t => t.status === TransactionStatus.APPROVED).length;
  const highRiskCount = transactions.filter(t => t.ai_analysis?.risk_level === 'HIGH').length;
  const totalAmount = transactions.reduce((acc, t) => acc + t.amount_idr, 0);

  const categoryData = transactions.reduce((acc: any[], t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: t.category, value: 1 });
    }
    return acc;
  }, []);

  // Prepare data for simple bar chart (Amount by Category)
  const amountByCategory = transactions.reduce((acc: any[], t) => {
     const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.amount += t.amount_idr;
    } else {
      acc.push({ name: t.category, amount: t.amount_idr });
    }
    return acc;
  }, []);


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Review</p>
            <h3 className="text-2xl font-bold text-gray-800">{pendingCount}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-red-50 rounded-full">
            <ShieldAlert className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">High Risk Flagged</p>
            <h3 className="text-2xl font-bold text-gray-800">{highRiskCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-green-50 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Processed Today</p>
            <h3 className="text-2xl font-bold text-gray-800">{approvedCount}</h3>
          </div>
        </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
           <div className="p-3 bg-purple-50 rounded-full">
            <AlertCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Volume (IDR)</p>
            <h3 className="text-xl font-bold text-gray-800">{(totalAmount / 1000000).toFixed(1)}M</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Volume by Category</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amountByCategory}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000000}M`} />
                <Tooltip formatter={(value: number) => `IDR ${value.toLocaleString()}`} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
        <div>
            <h2 className="text-2xl font-bold mb-1">Audit Queue</h2>
            <p className="text-blue-100">You have {pendingCount} transactions awaiting risk assessment.</p>
        </div>
        <button 
            onClick={onViewList}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm"
        >
            Start Review
        </button>
      </div>
    </div>
  );
};
