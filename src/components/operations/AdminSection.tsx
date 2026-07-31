import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";

interface AdminSectionProps {
  timePeriod: TimePeriod;
}

export function AdminSection({ timePeriod }: AdminSectionProps) {
  // Mock data - will be replaced with real data connections
  const adminData = {
    totalHeadcount: 12,
    contractorUtilization: 85,
    taskCompletion: 92,
    trainingCompleted: 8,
    codeViolations: 2,
    employeeSatisfaction: 4.2
  };

  const teamMembers = [
    { name: "John Manager", role: "Project Manager", status: "Active", utilization: 95, training: "Complete" },
    { name: "Sarah Director", role: "Operations Director", status: "Active", utilization: 88, training: "In Progress" },
    { name: "Mike Supervisor", role: "Construction Supervisor", status: "Active", utilization: 92, training: "Complete" },
    { name: "Lisa Analyst", role: "Financial Analyst", status: "Active", utilization: 78, training: "Complete" }
  ];

  const contractors = [
    { name: "ABC Plumbing", specialty: "Plumbing", utilization: 90, rating: 4.8, activeProjects: 3 },
    { name: "Elite Electric", specialty: "Electrical", utilization: 85, rating: 4.6, activeProjects: 2 },
    { name: "Master Painters", specialty: "Painting", utilization: 70, rating: 4.4, activeProjects: 2 },
    { name: "Quality Roofing", specialty: "Roofing", utilization: 95, rating: 4.9, activeProjects: 1 }
  ];

  const trainingPrograms = [
    { program: "Safety Certification", participants: 10, completed: 8, completion: 80 },
    { program: "Project Management", participants: 5, completed: 4, completion: 80 },
    { program: "Code Compliance", participants: 12, completed: 11, completion: 92 },
    { program: "Customer Service", participants: 8, completed: 6, completion: 75 }
  ];

  const violations = [
    { property: "123 Main St", violation: "Electrical Code 240.4", severity: "Medium", reportedDate: "2024-01-05", status: "Resolved" },
    { property: "456 Oak Ave", violation: "Building Code 1405.2", severity: "Low", reportedDate: "2024-01-08", status: "In Progress" }
  ];

  return (
    <div className="space-y-6">
      {/* Admin Overview KPIs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Admin & HR Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Head Count"
            value={adminData.totalHeadcount}
            icon={Users}
            change="+2 this quarter"
            changeType="positive"
          />
          <MetricCard
            title="Contractor Utilization"
            value={`${adminData.contractorUtilization}%`}
            icon={UserCheck}
            change="Above target"
            changeType="positive"
          />
          <MetricCard
            title="Task Completion"
            value={`${adminData.taskCompletion}%`}
            icon={CheckCircle}
            change="+5% this month"
            changeType="positive"
          />
          <MetricCard
            title="Training Completed"
            value={`${adminData.trainingCompleted}/12`}
            icon={GraduationCap}
            change="67% complete"
            changeType="positive"
          />
        </div>
      </div>

      {/* Team Performance */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold text-foreground">{member.utilization}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
                <div className="flex-1 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    member.training === 'Complete' 
                      ? 'bg-success/15 text-success' 
                      : 'bg-yellow-500/20 text-warning'
                  }`}>
                    {member.training}
                  </span>
                </div>
                <div className="flex-1 text-right">
                  <span className="px-2 py-1 text-xs rounded-full bg-success/15 text-success">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contractor Management */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Contractor Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contractors.map((contractor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{contractor.name}</h4>
                  <p className="text-sm text-muted-foreground">{contractor.specialty}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold text-foreground">{contractor.utilization}%</p>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold text-foreground">{contractor.rating}/5.0</p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-accent">{contractor.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-foreground">Training & Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingPrograms.map((program, index) => (
              <div key={index} className="p-4 border border-border rounded-lg bg-panel">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{program.program}</h4>
                  <span className="text-sm font-semibold text-accent">{program.completion}%</span>
                </div>
                <div className="w-full bg-panel rounded-full h-2 mb-2">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${program.completion}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {program.completed} of {program.participants} participants completed
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Code Violations */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Code Violations Reported ({adminData.codeViolations})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {violations.map((violation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg bg-panel">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{violation.property}</h4>
                  <p className="text-sm text-muted-foreground">{violation.violation}</p>
                </div>
                <div className="flex-1 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    violation.severity === 'High' 
                      ? 'bg-destructive/15 text-destructive' 
                      : violation.severity === 'Medium'
                      ? 'bg-yellow-500/20 text-warning'
                      : 'bg-accent/15 text-accent'
                  }`}>
                    {violation.severity} Severity
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-semibold text-foreground">{violation.reportedDate}</p>
                  <p className="text-sm text-muted-foreground">Reported</p>
                </div>
                <div className="flex-1 text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    violation.status === 'Resolved' 
                      ? 'bg-success/15 text-success' 
                      : 'bg-yellow-500/20 text-warning'
                  }`}>
                    {violation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Employee Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Overall Rating</span>
                <span className="font-semibold text-success">{adminData.employeeSatisfaction}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-semibold text-foreground">83%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Retention Rate</span>
                <span className="font-semibold text-success">95%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Productivity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Task Completion</span>
                <span className="font-semibold text-success">{adminData.taskCompletion}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-semibold text-foreground">2.4 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quality Score</span>
                <span className="font-semibold text-accent">8.7/10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-foreground">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Safety Training</span>
                <span className="font-semibold text-success">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Code Violations</span>
                <span className="font-semibold text-foreground">{adminData.codeViolations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Compliance Score</span>
                <span className="font-semibold text-success">9.2/10</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}