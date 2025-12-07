import React, { useState } from 'react';
import { Transaction, TransactionStatus, RiskLevel } from '../types';
import { analyzeTransactionRisk } from '../services/geminiService';
import { ArrowLeft, Shield, AlertOctagon, Check, X, BrainCircuit, FileText, Activity } from 'lucide-react';

interface TransactionDetailProps {
  transaction: Transaction;
  onBack: () => void;
  onUpdateTransaction: (updated: Transaction) => void;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onBack, onUpdateTransaction }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeTransactionRisk(transaction);
      const updated = { ...transaction, ai_analysis: analysis };
      onUpdateTransaction(updated);
    } catch (err) {
      setError("Failed to generate risk analysis. Please check your API Key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDecision = (status: TransactionStatus) => {
    onUpdateTransaction({ ...transaction, status });
  };

  const getRiskColor = (level?: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-600 bg-red-50 border-red-200';
      case RiskLevel.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-200';
      case RiskLevel.LOW: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Data */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{transaction.title}</h1>
                <p className="text-sm text-gray-500 font-mono">{transaction.transaction_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                 transaction.status === TransactionStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                 transaction.status === TransactionStatus.APPROVED ? 'bg-green-100 text-green-800' :
                 'bg-red-100 text-red-800'
              }`}>
                {transaction.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                <p className="text-xl font-mono font-semibold text-gray-900">
                  {transaction.amount_idr.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Category</p>
                <p className="text-xl font-semibold text-gray-900">{transaction.category}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Historical Avg</p>
                 <p className="text-sm font-mono text-gray-700">
                    {transaction.historical_average.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                 </p>
              </div>
               <div className="p-4 bg-gray-50 rounded-lg">
                 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Materiality Threshold</p>
                 <p className="text-sm font-mono text-gray-700">
                    {transaction.materiality_threshold.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                 </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Description
              </h3>
              <div className="p-4 bg-white border border-gray-200 rounded-lg text-gray-700 leading-relaxed">
                {transaction.description}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          {transaction.status === TransactionStatus.PENDING && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                <p className="text-gray-600 text-sm">Review the AI analysis before making a decision.</p>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => handleDecision(TransactionStatus.REJECTED)}
                        className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg hover:bg-red-50 flex items-center font-medium"
                    >
                        <X className="w-4 h-4 mr-2" /> Reject
                    </button>
                     <button 
                        onClick={() => handleDecision(TransactionStatus.APPROVED)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-md"
                    >
                        <Check className="w-4 h-4 mr-2" /> Approve
                    </button>
                </div>
              </div>
          )}
        </div>

        {/* Right Column: AI Analysis */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden relative">
            <div className="bg-indigo-900 p-4 flex justify-between items-center text-white">
                <h3 className="font-semibold flex items-center">
                    <BrainCircuit className="w-5 h-5 mr-2" />
                    AI Compliance Scorer
                </h3>
                <span className="text-xs bg-indigo-800 px-2 py-1 rounded">Gemini 2.5 Flash</span>
            </div>

            <div className="p-6">
                {!transaction.ai_analysis ? (
                    <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No risk assessment generated yet.</p>
                        <button 
                            onClick={handleRunAnalysis}
                            disabled={isAnalyzing}
                            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-all
                                ${isAnalyzing ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'}
                            `}
                        >
                            {isAnalyzing ? 'Analyzing with Gemini...' : 'Run Risk Analysis'}
                        </button>
                         {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}
                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        {/* Score Card */}
                        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                             <div>
                                <p className="text-sm text-gray-500">Risk Score</p>
                                <span className="text-4xl font-bold text-gray-900">{transaction.ai_analysis.risk_score}</span>
                                <span className="text-gray-400 text-lg">/100</span>
                             </div>
                             <div className={`px-4 py-2 rounded-lg border flex flex-col items-center ${getRiskColor(transaction.ai_analysis.risk_level)}`}>
                                <span className="text-xs font-bold uppercase tracking-wider">Level</span>
                                <span className="font-bold text-lg">{transaction.ai_analysis.risk_level}</span>
                             </div>
                        </div>

                        {/* Anomaly Flag */}
                         {transaction.ai_analysis.anomaly_flag && (
                            <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-start space-x-3">
                                <AlertOctagon className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-red-800 text-sm">Statistical Anomaly Detected</p>
                                    <p className="text-red-600 text-xs mt-1">Transaction amount or pattern deviates significantly from historical baseline.</p>
                                </div>
                            </div>
                         )}

                        {/* Summary */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                <Activity className="w-4 h-4 mr-2 text-indigo-500" />
                                Analysis Summary
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {transaction.ai_analysis.analysis_summary}
                            </p>
                        </div>

                        {/* Compliance Tags */}
                        <div>
                             <h4 className="text-sm font-semibold text-gray-800 mb-2">Compliance Concerns</h4>
                             <div className="flex flex-wrap gap-2">
                                {transaction.ai_analysis.compliance_concern.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                                        #{tag}
                                    </span>
                                ))}
                             </div>
                        </div>
                        
                         <button 
                            onClick={handleRunAnalysis}
                            className="w-full mt-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-50 transition-colors"
                         >
                            Re-Analyze
                         </button>
                    </div>
                )}
            </div>
          </div>
          
          {/* Metadata/Audit Trail Placeholder */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">System Metadata</h4>
              <div className="space-y-2 text-xs text-gray-600 font-mono">
                 <div className="flex justify-between">
                    <span>Created At:</span>
                    <span>{transaction.date} 09:41:00</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Source:</span>
                    <span>ERP-SAP-Module-FI</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span>{new Date().toISOString().split('T')[0]}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
