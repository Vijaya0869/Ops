import { OperationsSectionPage } from "./OperationsSectionPage";
import { RentalsSection } from "@/components/operations/RentalsSection";

const RentalsPage = () => (
  <OperationsSectionPage
    title="Rentals Management"
    subtitle="Rental properties tracking and tenant management"
    reportLabel="Rentals"
    reportSlug="rentals"
    Section={RentalsSection}
  />
);

export default RentalsPage;
