import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Users, 
  FileCheck, 
  Home, 
  CheckCircle2, 
  ArrowRight,
  ClipboardList,
  AlertTriangle,
  DollarSign,
  Phone,
  Mail,
  Key,
  Calendar
} from "lucide-react";

const TenantPlacementSOPPage = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Playbooks</span>
              <ArrowRight className="h-4 w-4" />
              <span>Tenant Placement</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Tenant Placement SOP</h1>
            <p className="text-muted-foreground">
              Complete workflow for rental property tenant screening, placement, and move-in procedures
            </p>
          </div>

          {/* Screening Criteria Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-semibold">Credit: 660+</span>
                </div>
                <p className="text-sm text-muted-foreground">600–659 case-by-case with extra deposit</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Income: 3× Rent</span>
                </div>
                <p className="text-sm text-muted-foreground">Verified via pay stubs & bank statements</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">No Evictions</span>
                </div>
                <p className="text-sm text-muted-foreground">Background check required</p>
              </CardContent>
            </Card>
          </div>

          {/* Main SOPs */}
          <Accordion type="multiple" className="space-y-4" defaultValue={["screening"]}>
            {/* 1. Screening Criteria */}
            <AccordionItem value="screening" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">1. Rental Application Screening Criteria</div>
                    <div className="text-sm text-muted-foreground">Must follow for all applicants</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Credit Check</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm"><strong>Minimum credit score: 660</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <span className="text-sm">Scores between 600–659 may be considered case-by-case if:</span>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className="text-sm text-muted-foreground">• Income is strong, AND</p>
                      <p className="text-sm text-muted-foreground">• Tenant provides one additional month's rent as security deposit</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Background Check</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">No criminal activity related to property</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">No eviction records</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Income Verification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Applicant must earn at least <strong>3× the monthly rent</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Must submit: Recent pay stubs (last 2–3 months)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Must submit: Bank statements for same period (e.g., applying in August → submit May–July)</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Listing & Advertising */}
            <AccordionItem value="listing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Home className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">2. Listing & Advertising</div>
                    <div className="text-sm text-muted-foreground">Post on all available platforms</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Listing Platforms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Zillow</Badge>
                      <Badge variant="outline">Avail</Badge>
                      <Badge variant="outline">Facebook Marketplace</Badge>
                      <Badge variant="outline">AffordableHousing.com</Badge>
                      <Badge variant="outline">Other rental platforms</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Ensure the property is advertised in an attractive and professional manner to maximize interest
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Inquiry & Application Management */}
            <AccordionItem value="inquiries" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Mail className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">3. Inquiry & Application Management</div>
                    <div className="text-sm text-muted-foreground">Respond promptly to all inquiries</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Respond promptly to all inquiries once the listing is live</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Follow up immediately if any applications are received</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Maintain active communication with prospective tenants</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Reference Check */}
            <AccordionItem value="references" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">4. Reference Check</div>
                    <div className="text-sm text-muted-foreground">Contact at least two references</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Contact at Least Two of the Following</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Current/past landlord or property manager</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Employer</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Document all reference outcomes in the applicant's file
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Pricing & Incentives */}
            <AccordionItem value="pricing" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">5. Pricing & Incentives Strategy</div>
                    <div className="text-sm text-muted-foreground">Adjust if no interest</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <span className="text-sm">If no interest within the first two weeks, reduce rent by $50–$100 depending on situation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <span className="text-sm">If interest is still low, offer attractive incentives such as a free application fee</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Lease Execution */}
            <AccordionItem value="lease" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <FileCheck className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">6. Lease Execution</div>
                    <div className="text-sm text-muted-foreground">Once tenant is approved</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Once a tenant is approved, send the lease through Buildium</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Before signing, provide all necessary information to the tenant</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      The tenant must sign the lease and pay the security deposit on the same day
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Section 8 Tenants */}
            <AccordionItem value="section8" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">7. Section 8 Tenants</div>
                    <div className="text-sm text-muted-foreground">Housing authority process</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Confirm whether the tenant is willing to pay any rent differential, if applicable</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Send the lease once confirmed and signed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Schedule the required inspection after lease signing</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Tenant should NOT transfer utilities until inspection is done
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Upon passing inspection, the housing authority will grant final approval</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 8. Property Readiness */}
            <AccordionItem value="property-ready" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/15">
                    <Home className="h-5 w-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">8. Property Readiness & Move-In Procedures</div>
                    <div className="text-sm text-muted-foreground">Before tenant occupancy</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Before Tenant Occupancy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Ensure all utilities are turned on</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Property is in move-in ready condition</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Deep cleaning completed</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">Grass cutting/landscaping done</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                      <span className="text-sm">All systems and appliances functioning properly</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 9. Move-In Day */}
            <AccordionItem value="move-in" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary">
                    <Key className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">9. Move-In Day Requirements</div>
                    <div className="text-sm text-muted-foreground">Provide documents and collect checklist</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Provide to Tenant on Move-In Day</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Welcome letter</Badge>
                      <Badge variant="outline">Keys</Badge>
                      <Badge variant="outline">Move-in checklist</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Tenants must complete and return the move-in checklist within 3 days
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Any issues reported after this period will not be the landlord's responsibility
                    </p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Quick Reference */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Screening Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Required Documents</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Pay stubs (last 2–3 months)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Bank statements (same period)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>ID / Driver's License</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Minimum Requirements</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Credit score: 660+</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>Income: 3× monthly rent</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>No eviction history</span>
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

export default TenantPlacementSOPPage;
