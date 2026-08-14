import { OperationsSectionPage } from "./OperationsSectionPage";
import { AcquisitionsSection } from "@/components/operations/AcquisitionsSection";

const AcquisitionsPage = () => (
  <OperationsSectionPage
    title="Acquisitions"
    subtitle="Property acquisition tracking and decision matrix"
    reportLabel="Acquisitions"
    reportSlug="acquisitions"
    Section={AcquisitionsSection}
  />
);

export default AcquisitionsPage;
