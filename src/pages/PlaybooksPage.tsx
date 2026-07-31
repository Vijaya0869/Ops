import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Hammer, Building2, Calculator, ChevronRight, Home, DollarSign, Users, Package, Landmark, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

const PlaybooksPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const playbooks = [
    {
      icon: Home,
      title: "Acquisitions SOP",
      description: "MLS Acquisitions Playbook — From MLS search to offer to contract",
      path: "/playbooks/acquisitions",
      items: ["MLS Search & Filters", "Realtor Outreach", "Property Analysis", "MAO Calculation"]
    },
    {
      icon: DollarSign,
      title: "Disposition SOP",
      description: "Complete workflow for Off-Market sales, MLS listings, and Rent-to-Own",
      path: "/playbooks/disposition",
      items: ["Buyers List", "Deal Packages", "MLS Paths", "Rent-to-Own"]
    },
    {
      icon: Landmark,
      title: "Lender Selection SOP",
      description: "Hard Money, Private, or Direct Lenders — Evaluation and Draw Management",
      path: "/playbooks/lender-selection",
      items: ["Lender Comparison", "Loan Application", "Title Clearance", "Draw Process"]
    },
    {
      icon: Hammer,
      title: "Construction & Project SOP",
      description: "Site readiness, oversight, and project closeout procedures",
      path: "/playbooks/construction-project",
      items: ["Site Readiness", "Quality Control", "Draw Management", "Inspections"]
    },
    {
      icon: Package,
      title: "Contractors & Materials SOP",
      description: "Contractor selection, material procurement, and payment controls",
      path: "/playbooks/contractors-materials",
      items: ["Pre-Qualification", "Bidding", "Material Procurement", "Payment Controls"]
    },
    {
      icon: Users,
      title: "Tenant Placement SOP",
      description: "Rental property tenant screening, placement, and move-in procedures",
      path: "/playbooks/tenant-placement",
      items: ["Screening Criteria", "Listing", "Lease Execution", "Move-In"]
    },
    {
      icon: FileText,
      title: "GC Management",
      description: "Comprehensive guide to General Contractor management, oversight, and coordination",
      path: "/playbooks/gc-management",
      items: ["Project Management", "Hiring Subcontractors", "Quality Control", "Budgeting"]
    },
    {
      icon: Building2,
      title: "Project Management",
      description: "Best practices for managing real estate development projects from start to finish",
      path: "/playbooks/project-management",
      items: ["Planning Phase", "Execution", "Monitoring", "Closure"]
    },
    {
      icon: Calculator,
      title: "Cost Control",
      description: "Financial management strategies and cost control methodologies for projects",
      path: "/playbooks/cost-control",
      items: ["Budget Planning", "Cost Tracking", "Change Orders", "Financial Reporting"]
    }
  ];

  const filteredPlaybooks = useMemo(() => {
    if (!searchQuery.trim()) return playbooks;
    const query = searchQuery.toLowerCase();
    return playbooks.filter(
      (playbook) =>
        playbook.title.toLowerCase().includes(query) ||
        playbook.description.toLowerCase().includes(query) ||
        playbook.items.some((item) => item.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="flex min-h-screen purple-gradient">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Playbooks & SOPs</h1>
            <p className="text-muted-foreground">
              Standard Operating Procedures and best practices for real estate operations
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search playbooks by title, description, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-panel border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Playbooks Grid */}
          {filteredPlaybooks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No playbooks found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPlaybooks.map((playbook) => (
                <Card key={playbook.title} variant="glass" className="hover:bg-panel-raised transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg gold-gradient">
                        <playbook.icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <CardTitle className="text-xl text-foreground">{playbook.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground">
                      {playbook.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Key Topics:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {playbook.items.map((item) => (
                            <div key={item} className="text-sm text-muted-foreground flex items-center gap-1">
                              <div className="w-1 h-1 bg-accent rounded-full" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Link to={playbook.path}>
                        <Button variant="glass-outline" className="w-full mt-4 group">
                          View Playbook
                          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Access */}
          <Card variant="glass" className="mt-8">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Reference</CardTitle>
              <CardDescription className="text-muted-foreground">
                Essential SOPs for daily operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/playbooks/gc-management" className="p-4 rounded-lg border border-border bg-panel hover:bg-panel-raised transition-all">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-accent" />
                    <div>
                      <div className="font-medium text-foreground">GC Selection</div>
                      <div className="text-sm text-muted-foreground">Contractor vetting process</div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/playbooks/construction" className="p-4 rounded-lg border border-border bg-panel hover:bg-panel-raised transition-all">
                  <div className="flex items-center gap-3">
                    <Hammer className="h-5 w-5 text-accent" />
                    <div>
                      <div className="font-medium text-foreground">Safety Checklist</div>
                      <div className="text-sm text-muted-foreground">Site safety protocols</div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/playbooks/cost-control" className="p-4 rounded-lg border border-border bg-panel hover:bg-panel-raised transition-all">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-accent" />
                    <div>
                      <div className="font-medium text-foreground">Budget Tracking</div>
                      <div className="text-sm text-muted-foreground">Cost monitoring tools</div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PlaybooksPage;