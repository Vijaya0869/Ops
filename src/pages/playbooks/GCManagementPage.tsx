import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Users, 
  ClipboardCheck, 
  Calendar, 
  DollarSign, 
  Shield,
  Building,
  Hammer,
  CheckCircle,
  AlertTriangle,
  Target
} from "lucide-react";

const GCManagementPage = () => {
  return (
    <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">GC Management Playbook</h1>
                <p className="text-muted-foreground">
                  Comprehensive guide to General Contractor management and oversight
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Construction</Badge>
              <Badge variant="secondary">Project Management</Badge>
              <Badge variant="secondary">Quality Control</Badge>
            </div>
          </div>

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                General Contractor Overview
              </CardTitle>
              <CardDescription>
                Understanding the role and responsibilities of General Contractors in real estate development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">
                Managing contractors effectively is essential in real estate, especially for construction, renovations, 
                and property maintenance. This involves coordination, oversight, and ensuring the delivery of high-quality 
                work within agreed timelines and budgets.
              </p>
              <p className="text-foreground">
                A General Contractor is a key player in construction and development projects, overseeing the overall 
                building or renovation process from initiation to completion.
              </p>
            </CardContent>
          </Card>

          {/* Key Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Key Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Project Management</h4>
                      <p className="text-sm text-muted-foreground">
                        Manages all aspects of construction projects, coordinating with subcontractors, 
                        suppliers, and stakeholders to ensure completion on time and within budget.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Hammer className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Hiring Subcontractors</h4>
                      <p className="text-sm text-muted-foreground">
                        Responsible for hiring specialized subcontractors (electricians, plumbers, 
                        carpenters) who carry out specific tasks on-site.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Permits & Compliance</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensures all necessary permits are obtained and projects comply with local 
                        regulations, zoning laws, and safety standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Scheduling</h4>
                      <p className="text-sm text-muted-foreground">
                        Develops project schedules, ensuring all phases are completed in the 
                        correct sequence and on time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Quality Control</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensures construction is of high quality, adhering to building codes 
                        and client specifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground">Budget & Cost Control</h4>
                      <p className="text-sm text-muted-foreground">
                        Provides estimates, tracks costs throughout construction, and works 
                        to minimize overruns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Types of Contractors */}
          <Card>
            <CardHeader>
              <CardTitle>Types of General Contractors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Residential Contractors</h4>
                  <p className="text-sm text-muted-foreground">
                    Specialize in building or remodeling homes, apartments, or condominiums.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Commercial Contractors</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on larger commercial projects such as office buildings, retail centers, 
                    or industrial spaces.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Specialty Contractors</h4>
                  <p className="text-sm text-muted-foreground">
                    Specialize in specific areas like electrical, plumbing, or HVAC systems 
                    for larger projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Phases */}
          <Card>
            <CardHeader>
              <CardTitle>Project Management Phases</CardTitle>
              <CardDescription>
                How General Contractors work through real estate development projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <Target className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Pre-construction Phase</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      GCs are involved early in projects, assisting with budgeting, site assessments, 
                      and feasibility studies. They help with designing projects in consultation with 
                      architects and engineers.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-orange-100 text-orange-600">
                    <Hammer className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Construction Phase</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      GCs supervise physical construction work, manage labor, and ensure projects 
                      stay on track with schedule and budget requirements.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">Post-construction Phase</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      After construction, GCs handle final inspections, secure occupancy certificates, 
                      and resolve any outstanding issues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Types */}
          <Card>
            <CardHeader>
              <CardTitle>Contractor Agreement Types</CardTitle>
              <CardDescription>
                Different contract structures for working with General Contractors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Fixed-price Contract</h4>
                  <p className="text-sm text-muted-foreground">
                    A set price for the entire project, providing cost certainty but requiring 
                    detailed project definition upfront.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Cost-plus Contract</h4>
                  <p className="text-sm text-muted-foreground">
                    The GC is paid for all project costs plus an additional fee for their services, 
                    offering flexibility but requiring strong cost oversight.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border">
                  <h4 className="font-semibold text-foreground mb-2">Time and Materials Contract</h4>
                  <p className="text-sm text-muted-foreground">
                    Client pays for actual time and materials used during construction, often with 
                    a set hourly rate for labor.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Key Skills & Attributes
              </CardTitle>
              <CardDescription>
                Essential qualities to look for in a General Contractor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Leadership and Team Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Knowledge of Building Codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Problem-Solving Abilities</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Financial Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Clear Communication Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Site Supervision Experience</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relationship with Developers */}
          <Card>
            <CardHeader>
              <CardTitle>GC Relationship with Developers & Investors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500">
                <h4 className="font-semibold text-foreground mb-2">Real Estate Developers</h4>
                <p className="text-sm text-muted-foreground">
                  Developers often hire GCs to ensure smooth project execution, relying on their 
                  expertise to bring projects to fruition efficiently and within specifications.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500">
                <h4 className="font-semibold text-foreground mb-2">Real Estate Investors</h4>
                <p className="text-sm text-muted-foreground">
                  Investors looking to maximize ROI work closely with GCs to ensure cost control, 
                  quality standards, and timeliness in their investments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  );
};

export default GCManagementPage;