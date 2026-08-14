import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Users, 
  FileText, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Building2,
  Home,
  ClipboardList,
  ArrowRight
} from "lucide-react";

const DispositionSOPPage = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Playbooks</span>
              <ArrowRight className="h-4 w-4" />
              <span>Disposition</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Disposition Playbook</h1>
            <p className="text-muted-foreground">
              Complete workflow for Off-Market sales, MLS listings, and Rent-to-Own dispositions
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Buyers List</span>
                </div>
                <p className="text-sm text-muted-foreground">Build & maintain active buyer database</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">MLS Path</span>
                </div>
                <p className="text-sm text-muted-foreground">Retail & As-Is listing strategies</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-success" />
                  <span className="font-semibold">Rent-to-Own</span>
                </div>
                <p className="text-sm text-muted-foreground">RTO disposition workflow</p>
              </CardContent>
            </Card>
          </div>

          {/* Main SOPs */}
          <Accordion type="multiple" className="space-y-4" defaultValue={["buyers-list"]}>
            {/* 1. Build & Maintain Buyers List */}
            <AccordionItem value="buyers-list" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Build & Maintain the Buyers List</div>
                    <div className="text-sm text-muted-foreground">Sheet: "Buyer List"</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Buyer Information to Capture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Name/Company, email, phone</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Buy box (beds/baths/sqft/zip)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Max price, cash vs hard money</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Proof of funds, close speed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Buyer Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Past buyers</Badge>
                      <Badge variant="outline">Facebook groups</Badge>
                      <Badge variant="outline">Local REIAs</Badge>
                      <Badge variant="outline">Title companies</Badge>
                      <Badge variant="outline">Wholesalers</Badge>
                      <Badge variant="outline">LinkedIn</Badge>
                      <Badge variant="outline">Auction registries</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tag by Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500">Flipper</Badge>
                      <Badge className="bg-green-500">BRRRR</Badge>
                      <Badge className="bg-secondary">Landlord</Badge>
                      <Badge className="bg-orange-500">Hedge</Badge>
                      <Badge className="bg-pink-500">Wholesaler</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Status:</strong> Active / Paused. Refresh proof of funds every 30–60 days.
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Create Deal Package */}
            <AccordionItem value="deal-package" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Create a Deal Package</div>
                    <div className="text-sm text-muted-foreground">Sheet: "Deals"</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Property Details to Include</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Address, beds, baths, sqft, lot, year built</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Condition: Light/Medium/Full rehab</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Value-add options (add bed/bath/sqft)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Post-reno layout, projected ARV</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Asking price, rehab budget, rent (if hold)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Photo Folder Link (Google Drive)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Cozy Title Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      "Worthington 4/2 with value-add attic suite—ARV ~$420k"
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      "South Linden 3/1 light rehab—mechanicals solid, cosmetics left"
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Deal Status Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">Off-Market</Badge>
                      <Badge variant="outline" className="border-blue-500 text-blue-600">MLS</Badge>
                      <Badge variant="outline" className="border-orange-500 text-orange-600">Under Contract</Badge>
                      <Badge variant="outline" className="border-green-500 text-green-600">Sold</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Syndicate to Buyers */}
            <AccordionItem value="syndicate" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Mail className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Syndicate to Buyers</div>
                    <div className="text-sm text-muted-foreground">Mailchimp/Constant Contact</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Email Campaign Contents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Build segment: match Deals to relevant Buyer List tags/ZIPs</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Headline + 4–6 photos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">ARV / Asking / Rehab / EMD / Close in X days</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Access instructions, showing dates, offer deadline</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Required Disclaimer: "As-Is sale. Buyer handles due diligence. Proof of funds required with offer."
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Schedule Walkthroughs */}
            <AccordionItem value="walkthroughs" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Schedule Walkthroughs & Capture Feedback</div>
                    <div className="text-sm text-muted-foreground">Sheet: "Showings"</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Set grouped showings (e.g., Thu 4–6pm, Sat 10–12)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm access (lockbox / appointment) and agent presence (Y/N)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Log each showing: buyer, date/time, access method</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Collect feedback summary; set follow-up date and next action</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Collect & Compare Offers */}
            <AccordionItem value="offers" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">5. Collect & Compare Offers</div>
                    <div className="text-sm text-muted-foreground">Sheet: "Offers"</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Offer Terms to Record</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Require POF/pre-approval with each offer</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Price, EMD amount, funding type</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Closing costs (Buyer/Seller/Split)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Inspection/appraisal contingency</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Closing date, offer expiration</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm">Counter Terms (price/credits/timelines)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Offer Status Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Open</Badge>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">Counter</Badge>
                      <Badge variant="outline" className="border-green-500 text-green-600">Accepted</Badge>
                      <Badge variant="outline" className="border-red-500 text-red-600">Declined</Badge>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Title & Closing */}
            <AccordionItem value="title-closing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <ClipboardList className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">6. Title & Risk Check → Closing</div>
                    <div className="text-sm text-muted-foreground">Sheet: "Title & Closing"</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Open title immediately; order title commitment & payoff statements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Track risks: mortgage balance, liens/judgments, taxes owed, utility arrears, HOA dues</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">If issues: define cure plan (payoffs/releases) or re-negotiate price/date</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">When CTC (Clear-to-Close) = Yes: schedule closing (date/time, location/mobile notary)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm settlement statement allocations match agreed terms</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 7. MLS Path */}
            <AccordionItem value="mls-path" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">7. MLS Listing Paths</div>
                    <div className="text-sm text-muted-foreground">Retail at 90% or As-Is Immediate</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Path A — Retail Listing at ~90% Rehab Completion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">90% work complete (all major systems functional)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Walk property with listing agent to price/position</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Order pre-list inspection or agent checklist</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Build Punch List from findings; clear all items</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Pro photos, staging, 60–90s walk-through video</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Weekly cadence: traffic, feedback, price/terms recs</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Path B — As-Is Listing (Immediate Sale)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Shortlist 2–3 agents comfortable selling As-Is</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Walk property; align on as-is pricing & buyer profile</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Photos/video showing condition honestly</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">MLS description: As-Is, seller will not make repairs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Prioritize cash/hard-money with short inspection windows</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 8. Rent-to-Own Path */}
            <AccordionItem value="rto-path" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Home className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">8. Rent-to-Own (RTO) Disposition Path</div>
                    <div className="text-sm text-muted-foreground">Option agreements & tenant-buyers</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">1. Make Move-In Ready</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Utilities ON; test HVAC, plumbing, electrical, appliances</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Life-safety: smoke/CO, handrails, GFCI where required</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">2. Define RTO Terms (Crystal Clear)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="p-2 bg-muted rounded text-sm"><strong>Option fee:</strong> 3–5% (non-refundable)</div>
                      <div className="p-2 bg-muted rounded text-sm"><strong>Term:</strong> 12–36 months</div>
                      <div className="p-2 bg-muted rounded text-sm"><strong>Rent credit:</strong> $ amount if any</div>
                      <div className="p-2 bg-muted rounded text-sm"><strong>Future price:</strong> Fixed or indexed</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Maintenance split:</strong> Spell out minor repairs vs major systems responsibility
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">3. Market & Screen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Channels: MLS (if allowed), Mailchimp, FB groups, internal pool</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Pre-screen: income, employment, background/eviction, pet policy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Execute: Option Agreement + Lease + Disclosures; collect funds</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">4. Ongoing & Exercise</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Track milestones: on-time rent, credit steps, pre-approval target</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">60–90 days pre-expiry: verify loan readiness</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Buyer exercises option → open title for sale → close</span>
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

export default DispositionSOPPage;
