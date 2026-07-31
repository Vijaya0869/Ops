import { Navigation } from "@/components/Navigation";
import { PropertyList } from "@/components/properties/PropertyList";
import { PortfolioStats } from "@/components/properties/PortfolioStats";

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Property Portfolio</h1>
            <p className="text-muted-foreground">Manage and track all your investment properties</p>
          </div>
          
          <PortfolioStats />
          <PropertyList />
        </div>
      </main>
    </div>
  );
}