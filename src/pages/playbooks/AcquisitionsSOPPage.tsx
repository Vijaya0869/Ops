import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Users, FileText, CheckCircle, Clock, Target, AlertCircle, DollarSign } from "lucide-react";

const AcquisitionsSOPPage = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-amber-600 border-amber-600 bg-amber-50">Playbook</Badge>
              <Badge variant="outline" className="text-primary border-primary bg-primary/10">Acquisitions</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              R&R Grandeur Properties — MLS Acquisitions Playbook
            </h1>
            <p className="text-muted-foreground text-lg">
              MLS → Offer → Contract | Complete SOP for property acquisition workflow
            </p>
          </div>

          {/* A.1 MLS Search & Filters */}
          <Card>
            <CardHeader className="bg-amber-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Search className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle className="text-xl text-amber-900">A.1 MLS SEARCH & FILTERS</CardTitle>
                  <CardDescription className="text-amber-700 font-medium">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Daily Task
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Goal
                </h4>
                <p className="text-muted-foreground mt-1">
                  Pull only value-add deals you can fix up (no fully remodeled)
                </p>
              </div>

              <Accordion type="multiple" className="space-y-4">
                <AccordionItem value="saved-search" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                      <span className="font-semibold">Saved Search (create once, run daily)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Price:</span>
                              <span className="text-muted-foreground ml-1">$0–$300,000</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Property type:</span>
                              <span className="text-muted-foreground ml-1">SFR + 2–4 unit (include townhomes/condos if HOA allows investor resales)</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Status:</span>
                              <span className="text-muted-foreground ml-1">Active (optionally Coming Soon)</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Days on Market:</span>
                              <span className="text-muted-foreground ml-1">0–21 and 60 &90 &150 (plus a second saved search for 60+ for stale listings)</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Photos count:</span>
                              <span className="text-muted-foreground ml-1">≥5 (better screening)</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Location:</span>
                              <span className="text-muted-foreground ml-1">your target ZIPs / school districts / rental hotspots</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-3">
                        <div>
                          <h5 className="font-medium text-green-700 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Keywords to INCLUDE (at least 1):
                          </h5>
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            as-is, investor special, handyman, needs TLC, needs work, bring your contractor, estate sale, cash only, subject to, value add
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-red-700 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Keywords to EXCLUDE:
                          </h5>
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            fully remodeled, turnkey, move-in ready, recently renovated, luxury finishes, designer kitchen, fully updated
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quick-triage" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                      <span className="font-semibold">Quick Triage (tag each lead)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-4 rounded-lg border bg-green-50 border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-700" />
                            <span className="font-semibold text-green-800">Light rehab (~$5k–$30k)</span>
                          </div>
                          <p className="text-sm text-green-700">
                            paint/patch, fixtures, minor bath/kitchen refresh, flooring, curb appeal
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-amber-50 border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-amber-700" />
                            <DollarSign className="h-4 w-4 text-amber-700 -ml-2" />
                            <span className="font-semibold text-amber-800">Medium rehab (~$30k–$60k)</span>
                          </div>
                          <p className="text-sm text-amber-700">
                            kitchen + 1 bath, roof or HVAC, windows, electrical/plumbing updates
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-red-50 border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-red-700" />
                            <DollarSign className="h-4 w-4 text-red-700 -ml-2" />
                            <DollarSign className="h-4 w-4 text-red-700 -ml-2" />
                            <span className="font-semibold text-red-800">Full rehab ($60k+)</span>
                          </div>
                          <p className="text-sm text-red-700">
                            multiple systems, layout changes, foundation, extensive exterior + interior
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-muted">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-muted-foreground">Exclude</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            "fully remodeled," retail-ready comps
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* A.2 Realtor Identification & Outreach */}
          <Card>
            <CardHeader className="bg-blue-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue-900">A.2 REALTOR IDENTIFICATION & OUTREACH</CardTitle>
                  <CardDescription className="text-blue-700 font-medium">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Same Day
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-blue-600">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  Goal
                </h4>
                <p className="text-muted-foreground mt-1">
                  Work with investor-friendly agents who hustle, preview, and negotiate
                </p>
              </div>

              <Accordion type="multiple" className="space-y-4">
                <AccordionItem value="choose-realtor" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-foreground text-sm font-bold">3</span>
                      <span className="font-semibold">Choose the realtor for each property</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Option 1</Badge>
                            <span className="text-sm font-medium text-green-700">(fastest)</span>
                          </div>
                          <h5 className="font-semibold mb-2">Listing agent</h5>
                          <p className="text-sm text-muted-foreground">
                            Direct line to seller; best for "as-is" + fast answers
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Option 2</Badge>
                          </div>
                          <h5 className="font-semibold mb-2">Your investor-friendly buyer's agent</h5>
                          <p className="text-sm text-muted-foreground">
                            Knows our terms; good for volume
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="outreach-script" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-foreground text-sm font-bold">4</span>
                      <span className="font-semibold">Outreach Script Template</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="p-4 rounded-lg border bg-muted/30 font-mono text-sm">
                        <p className="mb-2">Hi [Agent Name],</p>
                        <p className="mb-2">I'm an investor looking at [Property Address]. Is the seller motivated? Can we tour this week?</p>
                        <p className="mb-2">I buy 3-5 properties per year and can close quickly with cash or hard money.</p>
                        <p>Thanks,<br/>[Your Name]</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* A.3 Property Analysis */}
          <Card>
            <CardHeader className="bg-secondary-50 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl text-muted-foreground">A.3 PROPERTY ANALYSIS</CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Before Offer
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-border">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Goal
                </h4>
                <p className="text-muted-foreground mt-1">
                  Determine ARV, rehab costs, and max allowable offer before submitting
                </p>
              </div>

              <Accordion type="multiple" className="space-y-4">
                <AccordionItem value="arv-calc" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-foreground text-sm font-bold">5</span>
                      <span className="font-semibold">Calculate ARV (After Repair Value)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>Pull 3-5 comparable sold properties within 0.5 miles, last 90 days</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>Match: same bed/bath count, similar sqft (±15%), similar lot size</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>Adjust for condition: fully renovated comps only</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span>Average the adjusted prices = ARV</span>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mao-calc" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-foreground text-sm font-bold">6</span>
                      <span className="font-semibold">Calculate MAO (Maximum Allowable Offer)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4 pl-9">
                      <div className="p-4 rounded-lg border bg-secondary-50">
                        <p className="font-mono text-lg font-semibold text-muted-foreground mb-2">
                          MAO = (ARV × 70%) - Rehab Costs - Closing Costs
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Use 70% rule for flips; adjust to 75% in competitive markets
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border bg-card text-center">
                          <p className="text-sm text-muted-foreground">Closing Costs</p>
                          <p className="font-semibold">~3-5% of ARV</p>
                        </div>
                        <div className="p-3 rounded-lg border bg-card text-center">
                          <p className="text-sm text-muted-foreground">Holding Costs</p>
                          <p className="font-semibold">~$1,500-2,500/mo</p>
                        </div>
                        <div className="p-3 rounded-lg border bg-card text-center">
                          <p className="text-sm text-muted-foreground">Selling Costs</p>
                          <p className="font-semibold">~6-8% of ARV</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Reference Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">DAILY TASKS</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Run saved MLS search</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Triage new leads (Light/Medium/Full)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Contact agents for hot leads</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">BEFORE OFFER</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Calculate ARV with 3-5 comps</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Estimate rehab costs by category</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-4 h-4 rounded border border-primary flex-shrink-0" />
                      <span>Calculate MAO using 70% rule</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default AcquisitionsSOPPage;
