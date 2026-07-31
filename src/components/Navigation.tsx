import { Button } from "@/components/ui/button";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  Building2,
  DollarSign, 
  FileText, 
  Settings, 
  PieChart,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronRight,
  BarChart3,
  TrendingDown,
  Home,
  Banknote,
  CreditCard,
  Wallet,
  Receipt,
  Calculator,
  Hammer,
  ShoppingCart,
  CandlestickChart,
  LogOut,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const navigationItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/home" },
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
];

const operationsItems = [
  { icon: TrendingUp, label: "Acquisitions", path: "/operations/acquisitions" },
  { icon: TrendingDown, label: "Disposition", path: "/operations/disposition" },
  { icon: Home, label: "Rentals", path: "/operations/rentals" },
  { icon: Hammer, label: "Construction", path: "/operations/construction" },
  { icon: Settings, label: "Admin & Others", path: "/operations/admin" },
  { icon: CreditCard, label: "Lender Management", path: "/operations/lender-management" },
];



const propertyItems = [
  { icon: Building, label: "Overview", path: "/properties" },
  { icon: Home, label: "Portfolio", path: "/properties/portfolio" },
];


const financialItems = [
  { icon: BarChart3, label: "Overview", path: "/financials/overview" },
  { icon: TrendingUp, label: "Income", path: "/financials/income" },
  { icon: TrendingDown, label: "Expenses", path: "/financials/expenses" },
  { icon: Hammer, label: "Renovations", path: "/financials/renovations" },
  { icon: Home, label: "Rentals", path: "/financials/rentals" },
  { icon: Banknote, label: "Lending", path: "/financials/lending" },
  { icon: CreditCard, label: "Cash Position", path: "/financials/cash-position" },
  { icon: Wallet, label: "Cash Forecast", path: "/financials/cash-forecast" },
  { icon: Receipt, label: "Balance Sheet", path: "/financials/balance-sheet" },
  { icon: Calculator, label: "P&L", path: "/financials/profit-loss" },
  { icon: DollarSign, label: "Net Worth", path: "/financials/net-worth" },
];

const playbooksItems = [
  { icon: Home, label: "Acquisitions SOP", path: "/playbooks/acquisitions" },
  { icon: DollarSign, label: "Disposition SOP", path: "/playbooks/disposition" },
  { icon: Banknote, label: "Lender Selection SOP", path: "/playbooks/lender-selection" },
  { icon: Hammer, label: "Construction & Project SOP", path: "/playbooks/construction-project" },
  { icon: ShoppingCart, label: "Contractors & Materials SOP", path: "/playbooks/contractors-materials" },
  { icon: Building, label: "Tenant Placement SOP", path: "/playbooks/tenant-placement" },
  { icon: FileText, label: "GC Management", path: "/playbooks/gc-management" },
  { icon: Building2, label: "Project Management", path: "/playbooks/project-management" },
  { icon: Calculator, label: "Cost Control", path: "/playbooks/cost-control" },
];

const endNavigationItems = [
  { icon: FileText, label: "Scope IQ", path: "/documents" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: CandlestickChart, label: "Market Trends", path: "/market-trends" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
}

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isOperationsExpanded, setIsOperationsExpanded] = useState(
    location.pathname.startsWith("/operations")
  );
  const [isFinancialsExpanded, setIsFinancialsExpanded] = useState(
    location.pathname.startsWith("/financials")
  );
  const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(
    location.pathname.startsWith("/properties")
  );
  const [isPlaybooksExpanded, setIsPlaybooksExpanded] = useState(
    location.pathname.startsWith("/playbooks")
  );

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setProfile(data);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };
  
  return (
    <nav className="w-64 h-screen p-4 overflow-y-auto flex flex-col relative bg-sidebar border-r border-sidebar-border">
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-md bg-accent">
            <Building2 className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">REI Dashboard</h1>
            <p className="text-xs text-muted-foreground">Real Estate Investment</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 relative z-10">
        {/* Dashboard */}
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-accent text-accent-foreground shadow-md" 
                    : "text-foreground hover:bg-accent/15 hover:text-accent hover:border-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
        
        {/* Operations Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsOperationsExpanded(!isOperationsExpanded)}
            className={`w-full justify-start gap-3 transition-all duration-200 ${
              location.pathname.startsWith("/operations")
                ? "bg-secondary text-foreground border border-border" 
                : "text-foreground hover:bg-accent/15 hover:text-accent"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Operations
            {isOperationsExpanded ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
          
          {isOperationsExpanded && (
            <div className="ml-4 space-y-1">
              {operationsItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.label} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-accent text-accent-foreground shadow-sm" 
                          : "text-foreground hover:bg-accent/15 hover:text-accent"
                      }`}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Properties Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
            className={`w-full justify-start gap-3 transition-all duration-200 ${
              location.pathname.startsWith("/properties")
                ? "bg-secondary text-foreground border border-border" 
                : "text-foreground hover:bg-accent/15 hover:text-accent"
            }`}
          >
            <Building className="h-4 w-4" />
            Properties
            {isPropertiesExpanded ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
          
          {isPropertiesExpanded && (
            <div className="ml-4 space-y-1">
              {propertyItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.label} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-accent text-accent-foreground shadow-sm" 
                          : "text-foreground hover:bg-accent/15 hover:text-accent"
                      }`}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Financials Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsFinancialsExpanded(!isFinancialsExpanded)}
            className={`w-full justify-start gap-3 transition-all duration-200 ${
              location.pathname.startsWith("/financials")
                ? "bg-secondary text-foreground border border-border" 
                : "text-foreground hover:bg-accent/15 hover:text-accent"
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Financials
            {isFinancialsExpanded ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
          
          {isFinancialsExpanded && (
            <div className="ml-4 space-y-1">
              {financialItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.label} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-accent text-accent-foreground shadow-sm" 
                          : "text-foreground hover:bg-accent/15 hover:text-accent"
                      }`}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Playbooks Section */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => setIsPlaybooksExpanded(!isPlaybooksExpanded)}
            className={`w-full justify-start gap-3 transition-all duration-200 ${
              location.pathname.startsWith("/playbooks")
                ? "bg-secondary text-foreground border border-border" 
                : "text-foreground hover:bg-accent/15 hover:text-accent"
            }`}
          >
            <FileText className="h-4 w-4" />
            Playbooks & SOPs
            {isPlaybooksExpanded ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>
          
          {isPlaybooksExpanded && (
            <div className="ml-4 space-y-1">
              {playbooksItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.label} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start gap-3 transition-all duration-200 ${
                        isActive 
                          ? "bg-accent text-accent-foreground shadow-sm" 
                          : "text-foreground hover:bg-accent/15 hover:text-accent"
                      }`}
                    >
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* End Navigation Items - Documents, Analytics, Settings */}
        {endNavigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-accent text-accent-foreground shadow-md" 
                    : "text-foreground hover:bg-accent/15 hover:text-accent"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}

        {/* User Profile Section */}
        <div className="pt-4 mt-4 border-t border-border space-y-3">
          <Link to="/profile">
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/15 transition-colors cursor-pointer border border-transparent hover:border-accent/50">
              <Avatar className="h-9 w-9 ring-2 ring-border shadow-lg shadow-black/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-sm gold-gradient text-accent-foreground font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || "No name set"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </Link>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 text-foreground hover:text-accent hover:bg-accent/15 border border-transparent hover:border-accent/50"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}