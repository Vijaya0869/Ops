import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Hammer, 
  ClipboardList, 
  Users, 
  Eye, 
  DollarSign,
  CheckCircle2, 
  ArrowRight,
  Building2,
  FileCheck,
  AlertTriangle,
  Camera
} from "lucide-react";

const ConstructionProjectSOPPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Playbooks</span>
              <ArrowRight className="h-4 w-4" />
              <span>Construction & Project Management</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Construction & Project Management SOP</h1>
            <p className="text-muted-foreground">
              Detailed responsibilities from project initiation through closeout
            </p>
          </div>

          {/* Performance Expectations */}
          <Card className="border-l-4 border-l-primary mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Performance Expectations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Projects delivered on time and within budget</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Consistent quality standards across all renovations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Clear communication and proactive issue resolution</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Strong contractor relationships built on accountability</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main SOPs */}
          <Accordion type="multiple" className="space-y-4" defaultValue={["initiation"]}>
            {/* 1. Project Initiation */}
            <AccordionItem value="initiation" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Project Initiation & Site Readiness</div>
                    <div className="text-sm text-muted-foreground">Upon property acquisition</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Install a secure lockbox and confirm controlled site access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Ensure all utilities (electric, water, gas, sewer) are activated and functioning</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Review existing Scope of Work (SOW); if not available, prepare a detailed scope</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Identify and document all materials required including quantities and specifications</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Scope Finalization & Bidding */}
            <AccordionItem value="scope-bidding" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Scope Finalization & Contractor Bidding</div>
                    <div className="text-sm text-muted-foreground">Walkthrough and bid evaluation</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Conduct a full property walkthrough with qualified contractors</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Solicit multiple competitive bids for each project</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Contractor Evaluation Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm"><strong>Pricing:</strong> Cost transparency and competitiveness</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm"><strong>Timeline:</strong> Ability to meet project schedule</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm"><strong>Quality:</strong> Evidence of prior work quality</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm"><strong>Reliability:</strong> Communication and trustworthiness</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Construction Coordination */}
            <AccordionItem value="coordination" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Hammer className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Construction Coordination & Material Management</div>
                    <div className="text-sm text-muted-foreground">Procurement and delivery</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Coordinate with contractors for timely procurement and delivery of materials</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Verify materials match approved specifications prior to installation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Resolve material shortages, substitutions, or delivery delays proactively</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Maintain clear communication between contractors, vendors, and internal teams</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Site Oversight & QC */}
            <AccordionItem value="oversight" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Eye className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Ongoing Site Oversight & Quality Control</div>
                    <div className="text-sm text-muted-foreground">Minimum 3 inspections per week</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Conduct on-site inspections a minimum of three (3) times per week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Monitor Progress Against</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Approved scope of work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Project schedule</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Budget and cost controls</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Identify and correct quality issues promptly to avoid rework</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Ensure jobsite cleanliness, safety, and compliance with standards</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Lender Draw Management */}
            <AccordionItem value="draw-management" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">5. Lender Draw Management</div>
                    <div className="text-sm text-muted-foreground">Hard Money Lending milestones</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Draw Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Badge className="bg-yellow-500">30% Completion</Badge>
                      <Badge className="bg-orange-500">60% Completion</Badge>
                      <Badge className="bg-green-500">100% Completion</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Draw Request Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Camera className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Updated progress photos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileCheck className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Completion verification</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClipboardList className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Required lender documentation</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Coordinate with contractors to align payment schedules with approved draw releases
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Project Completion & Inspections */}
            <AccordionItem value="completion" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <FileCheck className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">6. Project Completion & Inspections</div>
                    <div className="text-sm text-muted-foreground">City/county inspections and punch list</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Schedule required city and county inspections upon substantial completion</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Attend inspections as needed and address any noted deficiencies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Prepare a detailed punch list following inspections and final walkthrough</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Final Payment & Closeout */}
            <AccordionItem value="closeout" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">7. Final Payment & Project Closeout</div>
                    <div className="text-sm text-muted-foreground">Payment release and documentation</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-800 dark:text-red-200">Release Final Payment ONLY After</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">All work is completed per scope</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Inspections are passed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Punch list items are fully resolved</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Collect lien waivers and close out all project documentation</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 8. Realtor Coordination */}
            <AccordionItem value="realtor" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">8. Realtor Coordination & Market Readiness</div>
                    <div className="text-sm text-muted-foreground">At ~70% completion</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      At approximately 70% completion, initiate coordination with the assigned realtor
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">If not assigned, find good realtors based on experience and track record</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Provide project updates, estimated completion timelines, and key property details</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Ensure property is market-ready upon completion for listing or leasing</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 9. Reporting */}
            <AccordionItem value="reporting" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-500/10">
                    <ClipboardList className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">9. Reporting & Communication</div>
                    <div className="text-sm text-muted-foreground">Regular project updates</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Regular Updates to Ownership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Schedule status</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Budget adherence</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Risk items or delays</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Maintain accurate project records: scopes, bids, invoices, draw requests, inspection reports</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
    </div>
  );
};

export default ConstructionProjectSOPPage;
