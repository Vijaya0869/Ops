import { DealsPipelineBoard } from "@/components/deals/DealsPipelineBoard";

export default function PipelinePage() {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Deal Pipeline</h1>
            <p className="text-muted-foreground">Track your deals through each stage of the acquisition process</p>
          </div>
          
          <DealsPipelineBoard />
        </div>
      </main>
  );
}