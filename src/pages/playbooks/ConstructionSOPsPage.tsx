import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Hammer, Shield, ClipboardCheck, HardHat, Wrench, AlarmClock } from "lucide-react";

const ConstructionSOPsPage = () => {
  useEffect(() => {
    document.title = "Construction SOPs | Playbooks";
    const meta = document.querySelector('meta[name="description"]') || document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", "Construction SOPs: safety, inspections, materials, and site operations.");
    if (!meta.parentNode) document.head.appendChild(meta);
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Hammer className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Construction SOPs</h1>
                <p className="text-muted-foreground">Standard Operating Procedures for safe and efficient site execution</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Safety</Badge>
              <Badge variant="secondary">Quality</Badge>
              <Badge variant="secondary">Operations</Badge>
            </div>
          </div>

          {/* Safety Protocols */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety Protocols
              </CardTitle>
              <CardDescription>Daily practices to maintain a safe job site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                <li>Mandatory PPE: hard hats, eye protection, high-visibility vests, gloves, and boots.</li>
                <li>Daily safety briefings at start of shift; document attendees and hazards.</li>
                <li>Lockout/Tagout procedures for electrical and heavy equipment.</li>
                <li>Clear signage and barricades around hazardous zones and open excavations.</li>
                <li>Maintain MSDS for all chemicals on-site and ensure spill kits are available.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Inspection Procedures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Inspection Procedures
              </CardTitle>
              <CardDescription>Consistent checks to ensure quality and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                <li>Pre-pour, framing, rough-in, insulation, and final inspections logged with photos.</li>
                <li>Use standardized checklists for each trade and phase; capture deficiencies.</li>
                <li>Subcontractor sign-off required before calling municipal inspections.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Material Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Material Management
              </CardTitle>
              <CardDescription>Ordering, receiving, and storage standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="list-disc pl-5 space-y-2 text-sm text-foreground">
                <li>Three-point verification: PO, packing slip, and visual inspection on delivery.</li>
                <li>Weather-protected storage for moisture-sensitive materials; elevate pallets.</li>
                <li>FIFO rotation for consumables; secure high-value items in lockable storage.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Daily Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardHat className="h-5 w-5" />
                Daily Site Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlarmClock className="h-4 w-4 text-primary" />
                    Morning Startup
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Site walk, hazard identification, and task assignments</li>
                    <li>Equipment checks and fuel levels</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    End-of-Day Closeout
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Trash removal, material securing, and equipment lockup</li>
                    <li>Daily log with progress photos and blockers</li>
                  </ul>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">Tip: Keep all SOP checklists in a shared folder and review weekly.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConstructionSOPsPage;
