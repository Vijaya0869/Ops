import { OperationsSectionPage } from "./OperationsSectionPage";
import { AdminSection } from "@/components/operations/AdminSection";

const AdminPage = () => (
  <OperationsSectionPage
    title="Admin & Others"
    subtitle="Administrative operations and team management"
    reportLabel="Admin & Others"
    reportSlug="admin"
    Section={AdminSection}
  />
);

export default AdminPage;
