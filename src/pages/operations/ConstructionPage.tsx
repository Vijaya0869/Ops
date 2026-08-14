import { OperationsSectionPage } from "./OperationsSectionPage";
import { ConstructionSection } from "@/components/operations/ConstructionSection";

const ConstructionPage = () => (
  <OperationsSectionPage
    title="Construction Management"
    subtitle="Construction projects tracking and timeline management"
    reportLabel="Construction"
    reportSlug="construction"
    Section={ConstructionSection}
  />
);

export default ConstructionPage;
