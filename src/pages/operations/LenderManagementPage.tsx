import { OperationsSectionPage } from "./OperationsSectionPage";
import { LenderManagement } from "@/components/dashboard/LenderManagement";

const LenderManagementPage = () => (
  <OperationsSectionPage
    title="Lender Management"
    subtitle="Lending relationships and loan portfolio management"
    reportLabel="Lender Management"
    reportSlug="lender-management"
    Section={LenderManagement}
  />
);

export default LenderManagementPage;
