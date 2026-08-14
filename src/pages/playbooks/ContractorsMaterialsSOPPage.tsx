import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  Package, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  FileCheck,
  Building2,
  Phone,
  Mail
} from "lucide-react";

const ContractorsMaterialsSOPPage = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Playbooks</span>
              <ArrowRight className="h-4 w-4" />
              <span>Contractors & Materials</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Contractors Selection & Materials Procurement SOP</h1>
            <p className="text-muted-foreground">
              Step-by-step guide for contractor selection, material procurement, and payment controls
            </p>
          </div>

          {/* Why This Works */}
          <Card className="border-l-4 border-l-green-500 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Why This System Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">No cost overruns</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">No unnecessary materials</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Contractors stay accountable</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Lenders trust your draw requests</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                  <span className="text-sm">Owners stay in control</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main SOPs */}
          <Accordion type="multiple" className="space-y-4" defaultValue={["pre-qualification"]}>
            {/* Part A: Contractor Selection */}
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Part A: How to Select Contractors
              </h2>
            </div>

            {/* 1. Pre-Qualification */}
            <AccordionItem value="pre-qualification" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Contractor Pre-Qualification</div>
                    <div className="text-sm text-muted-foreground">Before any walkthrough</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Only Allow Contractors Who Meet ALL of the Following</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Licensed and insured (as required locally)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Minimum 3 completed rehab projects</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Willing to work on milestone-based payments</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      📌 Maintain an Approved Contractor List
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Walkthrough & Quoting */}
            <AccordionItem value="walkthrough" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <ClipboardList className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Jobsite Walkthrough & Quoting</div>
                    <div className="text-sm text-muted-foreground">Get competitive bids</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Conduct a full walkthrough with 2–3 pre-qualified contractors</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Provide each contractor with: Same Scope of Work, Expected timeline, Quality standards</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Required in Written Quotes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Labor cost (by trade or phase)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Timeline with milestones</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Exclusions (if any)</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Selection Criteria */}
            <AccordionItem value="selection" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Users className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Contractor Selection Criteria (Scored)</div>
                    <div className="text-sm text-muted-foreground">Score each contractor 1–5 scale</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Criteria</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Price competitiveness</TableCell>
                          <TableCell className="text-right">15%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Ability to meet timeline</TableCell>
                          <TableCell className="text-right">25%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Quality of prior work</TableCell>
                          <TableCell className="text-right">25%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Communication & reliability</TableCell>
                          <TableCell className="text-right">25%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Trustworthiness</TableCell>
                          <TableCell className="text-right">10%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      ➡ Select the contractor with best total score, NOT lowest price
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Onboarding Rules */}
            <AccordionItem value="onboarding" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/15">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Contractor Onboarding Rules</div>
                    <div className="text-sm text-muted-foreground">Non-Negotiable</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Signed scope of work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Milestone payment schedule (30% / 60% / 100%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">No payment without: Progress verification + Photos</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">No material purchases without approval</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Part B: Realtor Selection */}
            <div className="mb-2 mt-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Part B: How to Select Realtors
              </h2>
            </div>

            <AccordionItem value="realtor-selection" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Realtor Selection & Vetting</div>
                    <div className="text-sm text-muted-foreground">Keep 2–3 preferred realtors per market</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Choose Realtors Who</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Specialize in renovated homes in that zip code</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Can price aggressively before completion</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Provide feedback during rehab</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Realtor Vetting Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-2 bg-muted rounded text-sm">1. How many renovated homes did you sell in the last 12 months?</div>
                    <div className="p-2 bg-muted rounded text-sm">2. Average days on market?</div>
                    <div className="p-2 bg-muted rounded text-sm">3. Do you help with pre-listing pricing while rehab is ongoing?</div>
                    <div className="p-2 bg-muted rounded text-sm">4. Are you comfortable listing at AS-IS or Whole Tail or Retail?</div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Part C: Material Procurement */}
            <div className="mb-2 mt-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Part C: Material Procurement & Payment Process
              </h2>
            </div>

            <AccordionItem value="material-selection" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Package className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Contractor Material Selection (In-Store)</div>
                    <div className="text-sm text-muted-foreground">Home Depot, Lowe's, suppliers</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Contractor physically goes to the store</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Selects materials based on approved scope</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-amber-800 dark:text-amber-200">Contractor Must</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span className="text-sm text-amber-800 dark:text-amber-200">Call you from the store with store associate present</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClipboardList className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span className="text-sm text-amber-800 dark:text-amber-200">Explain what they're purchasing and why</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="store-confirmation" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Store Confirmation & Email Verification</div>
                    <div className="text-sm text-muted-foreground">Store associate sends details</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Store Associate Must Send</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Itemized quote with SKU numbers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Quantities and total price</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Delivery or pickup details</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm"><strong>Email must be sent to:</strong> You / Project Manager (Optional: Admin / Accounting)</p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="internal-check" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-destructive/15">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Internal Double-Check (MANDATORY)</div>
                    <div className="text-sm text-muted-foreground">Before payment approval</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-800 dark:text-red-200">Before Payment Approval, Verify</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Material is in approved Scope of Work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Quantity matches project size</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Price aligns with budget</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">No duplicate or unnecessary items</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      If unclear → pause payment and ask questions
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment-auth" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Payment Authorization</div>
                    <div className="text-sm text-muted-foreground">Once approved</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Provide card number to store associate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm order confirmation number</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Save</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Receipt</Badge>
                      <Badge variant="outline">Invoice</Badge>
                      <Badge variant="outline">Delivery confirmation</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      📌 Contractors never pay for materials
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Package className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">5. Material Delivery & Verification</div>
                    <div className="text-sm text-muted-foreground">Confirm and verify on delivery</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm delivery date with store</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Contractor confirms materials received</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Project manager visually verifies major items</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Any incorrect materials → returned immediately</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Excess Material Management Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Any excess construction material purchased for a project shall be securely stored in designated storage facilities (Containers).</p>
                    <p>Stored materials remain the property of the company and may be reused across other current or future projects as needed.</p>
                    <p>All excess materials must be counted, labeled, and recorded in the material inventory log.</p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Part D & E: Controls */}
            <div className="mb-2 mt-6">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500" />
                Part D & E: Ongoing Coordination & Payment Controls
              </h2>
            </div>

            <AccordionItem value="weekly-control" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Weekly Control Rhythm & Change Orders</div>
                    <div className="text-sm text-muted-foreground">Site visits 3 times per week</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Site Visits: 3 Times Per Week</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Verify materials installed match approved selections</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Verify work aligns with scope</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Document with photos</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-800 dark:text-red-200">Change Orders (Strict Rule)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-red-800 dark:text-red-200">Any scope change requires:</p>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Written explanation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Cost impact</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <span className="text-sm text-red-800 dark:text-red-200">Timeline impact</span>
                    </div>
                    <p className="text-sm font-bold text-red-800 dark:text-red-200 mt-2">No work starts without approval.</p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payment-closeout" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Contractor Payments & Closeout</div>
                    <div className="text-sm text-muted-foreground">Payment and punch list controls</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Payments Released Only After</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Physical verification of work</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Photos uploaded</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Milestone reached</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Punch List & Final Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Prepare punch list after inspections</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Same contractor fixes items</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Final payment only after: All items resolved + Lien waivers collected</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
  );
};

export default ContractorsMaterialsSOPPage;
