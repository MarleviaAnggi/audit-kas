import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIRiskAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const analyzeTransactionRisk = async (transaction: Transaction): Promise<AIRiskAnalysis> => {
  try {
    const prompt = `
      Analyze the following financial transaction for audit compliance risk.
      
      Transaction Data:
      - Title: ${transaction.title}
      - Amount: IDR ${transaction.amount_idr}
      - Category: ${transaction.category}
      - Description: ${transaction.description}
      - Historical Average for Category: IDR ${transaction.historical_average}
      - Materiality Threshold: IDR ${transaction.materiality_threshold}

      Context & Rules:
      1. Compare Amount vs Historical Average. Significant deviation suggests anomaly.
      2. Analyze text (Title/Description) for high-risk keywords (e.g., vague descriptions, high-risk entertainment, unknown vendors).
      3. If Amount > Materiality Threshold, risk increases.
      4. Return a structured risk assessment.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "Anda adalah Spesialis Kepatuhan Audit Keuangan (Financial Audit Compliance Specialist). Tugas Anda adalah menilai risiko transaksi keuangan berdasarkan data yang diberikan. Berikan penilaian objektif berdasarkan standar audit internal (COSO/ISA).",
        temperature: 0.1, // Low temperature for consistent, analytical results
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_score: {
              type: Type.NUMBER,
              description: "Risk score from 0 to 100 (100 is highest risk)",
            },
            risk_level: {
              type: Type.STRING,
              enum: ["LOW", "MEDIUM", "HIGH"],
              description: "Categorical risk level",
            },
            anomaly_flag: {
              type: Type.BOOLEAN,
              description: "True if the transaction deviates significantly from patterns",
            },
            analysis_summary: {
              type: Type.STRING,
              description: "Brief professional justification for the score (Max 2 sentences)",
            },
            compliance_concern: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific compliance tags (e.g. 'QuantitativeVariance', 'PolicyViolation')",
            },
          },
          required: ["risk_score", "risk_level", "anomaly_flag", "analysis_summary", "compliance_concern"],
        },
      },
    });

    if (response.text) {
        const result = JSON.parse(response.text) as AIRiskAnalysis;
        return result;
    } 
    
    throw new Error("Empty response from AI");

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback or re-throw depending on app needs
    throw error;
  }
};
