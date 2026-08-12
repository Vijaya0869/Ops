import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as dealAnalysesService from "@/services/deal-analyses.service";
import type { DealAnalysis, DealAnalysisInput } from "@/services/deal-analyses.service";

export type { DealAnalysis, DealAnalysisInput };

export function useDealAnalyses() {
  const [dealAnalyses, setDealAnalyses] = useState<DealAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    dealAnalysesService
      .fetchDealAnalyses()
      .then(setDealAnalyses)
      .catch((error) => {
        console.error("Error fetching deal analyses:", error);
        toast.error("Failed to load deal analyses");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addDealAnalysis = async (data: DealAnalysisInput) => {
    try {
      const analysis = await dealAnalysesService.addDealAnalysis(data);
      setDealAnalyses((prev) => [analysis, ...prev]);
      toast.success("Analysis saved");
      return analysis;
    } catch (error) {
      console.error("Error saving deal analysis:", error);
      toast.error("Failed to save analysis");
      return null;
    }
  };

  const deleteDealAnalysis = async (id: string) => {
    try {
      await dealAnalysesService.deleteDealAnalysis(id);
      setDealAnalyses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Analysis deleted");
      return true;
    } catch (error) {
      console.error("Error deleting deal analysis:", error);
      toast.error("Failed to delete analysis");
      return false;
    }
  };

  return { dealAnalyses, loading, addDealAnalysis, deleteDealAnalysis };
}
