import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Landmark, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign,
  ClipboardList,
  ArrowRight,
  Mail,
  Shield
} from "lucide-react";

const LenderSelectionSOPPage = () => {
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
              <span>Lender Selection</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lender Selection & Loan Process SOP</h1>
            <p className="text-muted-foreground">
              For Hard Money, Private, or Direct Lenders — Evaluation, Application, and Draw Management
            </p>
          </div>

          {/* Key Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-semibold">Max 4 Mortgages Per Lender</span>
                </div>
                <p className="text-sm text-muted-foreground">Never exceed 4 active mortgages with any single lender — diversify risk</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span className="font-semibold">Maintain 3–5 Lender Relationships</span>
                </div>
                <p className="text-sm text-muted-foreground">Keep notes on lender behavior (speed, flexibility, professionalism)</p>
              </CardContent>
            </Card>
          </div>

          {/* Main SOPs */}
          <Accordion type="multiple" className="space-y-4" defaultValue={["evaluation"]}>
            {/* 1. Lender Evaluation */}
            <AccordionItem value="evaluation" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Lender Evaluation & Comparison</div>
                    <div className="text-sm text-muted-foreground">Before choosing any lender</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Lender Comparison Matrix</CardTitle>
                    <CardDescription>Evaluate and document these details for each lender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Criteria</TableHead>
                          <TableHead>Lender 1</TableHead>
                          <TableHead>Lender 2</TableHead>
                          <TableHead>Lender 3</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Interest Rate (%)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Points (%)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Loan Term (months)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Appraisal Fee ($)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Processing Fee ($)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Draw Fee ($)</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Rehab Funding %</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Prepayment Penalty</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Max # of Loans</TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Selection Criteria</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Prioritize lowest total cost (interest + points + appraisal fees)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Prefer 12–24 month loan duration for flexibility</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Ensure draw process is simple and timely (under 48–72 hours per draw)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Appraisal fee should be verified and approved before payment</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Pre-Selection Diversification */}
            <AccordionItem value="diversification" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Shield className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Pre-Selection Diversification Rule</div>
                    <div className="text-sm text-muted-foreground">Check current exposure before selecting</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Check current lender exposure in Loan Tracker</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">If 3–4 mortgages already active → choose a different lender</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Maintain active relationships with at least 3–5 different lenders</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Select based on: lowest interest + lowest points + acceptable term</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Loan Application */}
            <AccordionItem value="application" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <FileCheck className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Loan Application Initiation</div>
                    <div className="text-sm text-muted-foreground">Required documents to send</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Documents to Send to Lender</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Purchase Agreement (fully executed)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Rehab Budget & Scope of Work</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">LLC Formation / Articles of Organization</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">EIN confirmation letter</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Operating Agreement</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Recent Bank Statements (2–3 months)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Driver's License & Credit Report</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Recent Property Photos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Property Details (beds/baths/sqft)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Insurance Policy (hazard + flood if needed)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Title Company Information</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Title & Risk Clearance */}
            <AccordionItem value="title-risk" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Title & Risk Clearance</div>
                    <div className="text-sm text-muted-foreground">Verify no unknown liens or encumbrances</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Risk Items to Verify</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Existing mortgage balances</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Utility liens or unpaid bills</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Property tax arrears</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">Code violations or municipal liens</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <span className="text-sm">HOA dues or assessments</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Once title is clear, notify all parties (lender, title, agent, and seller)
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Closing Coordination */}
            <AccordionItem value="closing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">5. Loan & Closing Coordination</div>
                    <div className="text-sm text-muted-foreground">Schedule and coordinate all parties</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Schedule closing date once title is clear</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Loop all parties into one email thread: Lender, Title, Seller's agent, Buyer's agent, Attorney</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm closing funds and wire instructions are correct</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Attend in-person or confirm digital signing (e-sign)</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Post-Signing Actions */}
            <AccordionItem value="post-signing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Mail className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">6. Post-Signing Actions</div>
                    <div className="text-sm text-muted-foreground">Confirm draw schedule and update tracking</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Inform lender immediately: "Closing completed and documents signed"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Request draw schedule details: # of draws, turnaround time, draw fee</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Target: max 3 total draws, &lt;3 business days turnaround</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Post-Closing Checklist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Save fully executed loan documents, HUD, insurance, appraisal reports</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Update Loan Tracker with loan amount, term length, lender name</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Schedule payment reminders</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Draw Request Process */}
            <AccordionItem value="draw-process" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">7. Draw Request Process</div>
                    <div className="text-sm text-muted-foreground">30% / 60% / 100% completion milestones</div>
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
                      <Badge className="bg-yellow-500">Draw 1: 30%</Badge>
                      <Badge className="bg-orange-500">Draw 2: 60%</Badge>
                      <Badge className="bg-green-500">Final: 100%</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Required for Each Draw</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Updated progress photos (before/after by room/system)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Cost log showing completed line items</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Invoices/receipts for materials and labor</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Lien waivers from contractors/suppliers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Updated schedule/timeline</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Draw Request Email Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-mono bg-background p-4 rounded-lg space-y-2">
                      <p><strong>Subject:</strong> Draw #[1/2/Final] Request — [Property Address] — ~[30/60/100]% Complete</p>
                      <p><strong>To:</strong> [Lender Draws Email/Portal]</p>
                      <p><strong>CC:</strong> [Title], [PM], [Accounting], [GC]</p>
                      <br />
                      <p>Hi [Lender Name],</p>
                      <p>We're ready for Draw #[1/2/Final] at ~[30/60/100]% completion for [Property Address].</p>
                      <p>Attached/linked are: photos, cost log, invoices/receipts, lien waivers, and the updated schedule.</p>
                      <p>Please advise inspection timing and ETA for funding.</p>
                      <br />
                      <p><strong>Project Status:</strong> [1–2 line summary]</p>
                      <p><strong>Requested Amount:</strong> $[Amount]</p>
                      <p><strong>Draw Fee (if any):</strong> $[Amount]</p>
                      <p><strong>Bank/Wire Details:</strong> On file (please confirm)</p>
                      <br />
                      <p>Thanks,<br />[Your Name]</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Summary Flow */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Summary Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="outline" className="text-sm">1. Compare lenders</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">2. Diversify (max 4/lender)</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">3. Submit loan package</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">4. Confirm title clear</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">5. Schedule & close</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">6. Confirm draw process</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-sm">7. Upload all docs</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LenderSelectionSOPPage;
