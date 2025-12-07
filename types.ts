export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface AIRiskAnalysis {
  risk_score: number;
  risk_level: RiskLevel;
  anomaly_flag: boolean;
  analysis_summary: string;
  compliance_concern: string[];
}

export interface Transaction {
  id: string;
  transaction_id: string; // UUID from ERP
  title: string;
  amount_idr: number;
  category: string;
  description: string;
  date: string;
  status: TransactionStatus;
  historical_average: number; // Context for AI
  materiality_threshold: number; // Context for AI
  ai_analysis?: AIRiskAnalysis;
}

export type ViewState = 'DASHBOARD' | 'LIST' | 'DETAIL';
