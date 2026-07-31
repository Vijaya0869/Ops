import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { AcquisitionsSection } from "@/components/operations/AcquisitionsSection";
import { DispositionSection } from "@/components/operations/DispositionSection";
import { RentalsSection } from "@/components/operations/RentalsSection";
import { ConstructionSection } from "@/components/operations/ConstructionSection";
import { AdminSection } from "@/components/operations/AdminSection";

interface DetailedOperationsProps {
  timePeriod: TimePeriod;
}

export function DetailedOperations({ timePeriod }: DetailedOperationsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Detailed Operations</h2>
        <p className="text-muted-foreground">Comprehensive view of all operational activities and performance metrics</p>
      </div>

      <Tabs defaultValue="acquisitions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="acquisitions">Acquisitions</TabsTrigger>
          <TabsTrigger value="disposition">Disposition</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
          <TabsTrigger value="admin">Admin & Others</TabsTrigger>
        </TabsList>

        <TabsContent value="acquisitions" className="space-y-6">
          <AcquisitionsSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="disposition" className="space-y-6">
          <DispositionSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="rentals" className="space-y-6">
          <RentalsSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="construction" className="space-y-6">
          <ConstructionSection timePeriod={timePeriod} />
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <AdminSection timePeriod={timePeriod} />
        </TabsContent>
      </Tabs>
    </div>
  );
}