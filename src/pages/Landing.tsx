import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen purple-gradient flex items-center justify-center p-6">
      <div className="max-w-2xl w-full glass-card rounded-3xl p-12 text-center space-y-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/15 text-accent">
          <Building2 className="h-8 w-8" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            Real Estate Investment Platform
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Track your portfolio, manage deals, monitor financials, and run operations —
            all in one premium dashboard built for serious investors.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <Button variant="gold" size="lg" className="gap-2">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
