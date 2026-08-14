import { OperationsSectionPage } from "./OperationsSectionPage";
import { DispositionSection } from "@/components/operations/DispositionSection";

const DispositionPage = () => (
  <OperationsSectionPage
    title="Disposition"
    subtitle="Property sales tracking and Scope IQ process"
    reportLabel="Disposition"
    reportSlug="disposition"
    Section={DispositionSection}
  />
);

export default DispositionPage;
