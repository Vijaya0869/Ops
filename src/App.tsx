import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimePeriodProvider } from "@/contexts/TimePeriodContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import DashboardPage from "./pages/DashboardPage";
import OperationsPage from "./pages/OperationsPage";
import DealsPage from "./pages/DealsPage";
import PropertiesPage from "./pages/PropertiesPage";
import PipelinePage from "./pages/deals/PipelinePage";
import DecisionMatrixPage from "./pages/deals/DecisionMatrixPage";
import PortfolioPage from "./pages/properties/PortfolioPage";
import PropertyDetailPage from "./pages/properties/PropertyDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import FinancialsPage from "./pages/FinancialsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentsPage from "./pages/DocumentsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
// Operations sub-pages
import AcquisitionsPage from "./pages/operations/AcquisitionsPage";
import DispositionPage from "./pages/operations/DispositionPage";
import RentalsPage from "./pages/operations/RentalsPage";
import ConstructionPage from "./pages/operations/ConstructionPage";
import AdminPage from "./pages/operations/AdminPage";
import LenderManagementPage from "./pages/operations/LenderManagementPage";
// Financial sub-pages
import OverviewPage from "./pages/financials/OverviewPage";
import IncomePage from "./pages/financials/IncomePage";
import ExpensesPage from "./pages/financials/ExpensesPage";
import RentalsFinancialsPage from "./pages/financials/RentalsPage";
import LendingPage from "./pages/financials/LendingPage";
import CashPositionPage from "./pages/financials/CashPositionPage";
import CashForecastPage from "./pages/financials/CashForecastPage";
import BalanceSheetPage from "./pages/financials/BalanceSheetPage";
import ProfitLossPage from "./pages/financials/ProfitLossPage";
import NetWorthPage from "./pages/financials/NetWorthPage";
import RenovationsPage from "./pages/financials/RenovationsPage";
// Playbooks pages
import PlaybooksPage from "./pages/PlaybooksPage";
import GCManagementPage from "./pages/playbooks/GCManagementPage";
import ProjectManagementPage from "./pages/playbooks/ProjectManagementPage";
import ConstructionSOPsPage from "./pages/playbooks/ConstructionSOPsPage";
import CostControlPage from "./pages/playbooks/CostControlPage";
import AcquisitionsSOPPage from "./pages/playbooks/AcquisitionsSOPPage";
import DispositionSOPPage from "./pages/playbooks/DispositionSOPPage";
import LenderSelectionSOPPage from "./pages/playbooks/LenderSelectionSOPPage";
import ConstructionProjectSOPPage from "./pages/playbooks/ConstructionProjectSOPPage";
import ContractorsMaterialsSOPPage from "./pages/playbooks/ContractorsMaterialsSOPPage";
import TenantPlacementSOPPage from "./pages/playbooks/TenantPlacementSOPPage";
import MarketTrendsPage from "./pages/MarketTrendsPage";
import ProfilePage from "./pages/ProfilePage";
 
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TimePeriodProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute><OperationsPage /></ProtectedRoute>} />
            {/* Operations sub-routes */}
            <Route path="/operations/acquisitions" element={<ProtectedRoute><AcquisitionsPage /></ProtectedRoute>} />
            <Route path="/operations/disposition" element={<ProtectedRoute><DispositionPage /></ProtectedRoute>} />
            <Route path="/operations/rentals" element={<ProtectedRoute><RentalsPage /></ProtectedRoute>} />
            <Route path="/operations/construction" element={<ProtectedRoute><ConstructionPage /></ProtectedRoute>} />
            <Route path="/operations/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/operations/lender-management" element={<ProtectedRoute><LenderManagementPage /></ProtectedRoute>} />
            <Route path="/deals" element={<ProtectedRoute><DealsPage /></ProtectedRoute>} />
            <Route path="/deals/pipeline" element={<ProtectedRoute><PipelinePage /></ProtectedRoute>} />
            <Route path="/deals/decision-matrix" element={<ProtectedRoute><DecisionMatrixPage /></ProtectedRoute>} />
            <Route path="/properties" element={<ProtectedRoute><PropertiesPage /></ProtectedRoute>} />
            <Route path="/properties/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
            <Route path="/properties/:id" element={<ProtectedRoute><PropertyDetailPage /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/financials" element={<ProtectedRoute><FinancialsPage /></ProtectedRoute>} />
            {/* Financial sub-routes */}
            <Route path="/financials/overview" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
            <Route path="/financials/income" element={<ProtectedRoute><IncomePage /></ProtectedRoute>} />
            <Route path="/financials/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
            <Route path="/financials/rentals" element={<ProtectedRoute><RentalsFinancialsPage /></ProtectedRoute>} />
            <Route path="/financials/lending" element={<ProtectedRoute><LendingPage /></ProtectedRoute>} />
            <Route path="/financials/cash-position" element={<ProtectedRoute><CashPositionPage /></ProtectedRoute>} />
            <Route path="/financials/cash-forecast" element={<ProtectedRoute><CashForecastPage /></ProtectedRoute>} />
            <Route path="/financials/balance-sheet" element={<ProtectedRoute><BalanceSheetPage /></ProtectedRoute>} />
            <Route path="/financials/profit-loss" element={<ProtectedRoute><ProfitLossPage /></ProtectedRoute>} />
            <Route path="/financials/net-worth" element={<ProtectedRoute><NetWorthPage /></ProtectedRoute>} />
            <Route path="/financials/renovations" element={<ProtectedRoute><RenovationsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/market-trends" element={<ProtectedRoute><MarketTrendsPage /></ProtectedRoute>} />
            <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            {/* Playbooks routes */}
            <Route path="/playbooks" element={<ProtectedRoute><PlaybooksPage /></ProtectedRoute>} />
            <Route path="/playbooks/acquisitions" element={<ProtectedRoute><AcquisitionsSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/disposition" element={<ProtectedRoute><DispositionSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/lender-selection" element={<ProtectedRoute><LenderSelectionSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/construction-project" element={<ProtectedRoute><ConstructionProjectSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/contractors-materials" element={<ProtectedRoute><ContractorsMaterialsSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/tenant-placement" element={<ProtectedRoute><TenantPlacementSOPPage /></ProtectedRoute>} />
            <Route path="/playbooks/gc-management" element={<ProtectedRoute><GCManagementPage /></ProtectedRoute>} />
            <Route path="/playbooks/project-management" element={<ProtectedRoute><ProjectManagementPage /></ProtectedRoute>} />
            <Route path="/playbooks/construction" element={<ProtectedRoute><ConstructionSOPsPage /></ProtectedRoute>} />
            <Route path="/playbooks/cost-control" element={<ProtectedRoute><CostControlPage /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TimePeriodProvider>
  </QueryClientProvider>
);

export default App;