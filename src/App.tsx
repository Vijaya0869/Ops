import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TimePeriodProvider } from "@/contexts/TimePeriodContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Landing from "./pages/Landing";
import AuthPage from "./pages/AuthPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
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
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/home" element={<Index />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/operations" element={<OperationsPage />} />
              {/* Operations sub-routes */}
              <Route path="/operations/acquisitions" element={<AcquisitionsPage />} />
              <Route path="/operations/disposition" element={<DispositionPage />} />
              <Route path="/operations/rentals" element={<RentalsPage />} />
              <Route path="/operations/construction" element={<ConstructionPage />} />
              <Route path="/operations/admin" element={<AdminPage />} />
              <Route path="/operations/lender-management" element={<LenderManagementPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/deals/pipeline" element={<PipelinePage />} />
              <Route path="/deals/decision-matrix" element={<DecisionMatrixPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/portfolio" element={<PortfolioPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/financials" element={<FinancialsPage />} />
              {/* Financial sub-routes */}
              <Route path="/financials/overview" element={<OverviewPage />} />
              <Route path="/financials/income" element={<IncomePage />} />
              <Route path="/financials/expenses" element={<ExpensesPage />} />
              <Route path="/financials/rentals" element={<RentalsFinancialsPage />} />
              <Route path="/financials/lending" element={<LendingPage />} />
              <Route path="/financials/cash-position" element={<CashPositionPage />} />
              <Route path="/financials/cash-forecast" element={<CashForecastPage />} />
              <Route path="/financials/balance-sheet" element={<BalanceSheetPage />} />
              <Route path="/financials/profit-loss" element={<ProfitLossPage />} />
              <Route path="/financials/net-worth" element={<NetWorthPage />} />
              <Route path="/financials/renovations" element={<RenovationsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/market-trends" element={<MarketTrendsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Playbooks routes */}
              <Route path="/playbooks" element={<PlaybooksPage />} />
              <Route path="/playbooks/acquisitions" element={<AcquisitionsSOPPage />} />
              <Route path="/playbooks/disposition" element={<DispositionSOPPage />} />
              <Route path="/playbooks/lender-selection" element={<LenderSelectionSOPPage />} />
              <Route path="/playbooks/construction-project" element={<ConstructionProjectSOPPage />} />
              <Route path="/playbooks/contractors-materials" element={<ContractorsMaterialsSOPPage />} />
              <Route path="/playbooks/tenant-placement" element={<TenantPlacementSOPPage />} />
              <Route path="/playbooks/gc-management" element={<GCManagementPage />} />
              <Route path="/playbooks/project-management" element={<ProjectManagementPage />} />
              <Route path="/playbooks/construction" element={<ConstructionSOPsPage />} />
              <Route path="/playbooks/cost-control" element={<CostControlPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TimePeriodProvider>
  </QueryClientProvider>
);

export default App;