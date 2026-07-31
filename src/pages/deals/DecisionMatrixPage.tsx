import { Navigation } from "@/components/Navigation";
import { DecisionMatrix } from "@/components/deals/DecisionMatrix";

export default function DecisionMatrixPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Decision Matrix</h1>
            <p className="text-muted-foreground">Evaluate property acquisition potential using comprehensive criteria</p>
          </div>
          
          <DecisionMatrix />
        </div>
      </main>
    </div>
  );
}