import { api } from "./api-client";

export interface DealAnalysis {
  id: string;
  userId: string;
  dealId: string;
  locationScore: number | null;
  conditionScore: number | null;
  financialScore: number | null;
  riskScore: number | null;
  totalScore: number | null;
  recommendation: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DealAnalysisInput {
  dealId: string;
  locationScore?: number | null;
  conditionScore?: number | null;
  financialScore?: number | null;
  riskScore?: number | null;
  totalScore?: number | null;
  recommendation?: string | null;
  notes?: string | null;
}

export async function fetchDealAnalyses(): Promise<DealAnalysis[]> {
  return api.get<DealAnalysis[]>("/deal-analyses");
}

export async function addDealAnalysis(data: DealAnalysisInput): Promise<DealAnalysis> {
  return api.post<DealAnalysis>("/deal-analyses", data);
}

export async function deleteDealAnalysis(id: string): Promise<void> {
  await api.delete(`/deal-analyses/${id}`);
}
