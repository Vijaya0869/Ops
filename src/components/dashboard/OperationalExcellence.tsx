import { TimePeriod } from "@/components/ui/time-period-dropdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Target, Users, Building2, CalendarDays, GitBranch, ClipboardList,
  LayoutDashboard, FileText, TrendingUp, Home, DollarSign, UserPlus,
  MessageSquare, Shield, Compass, Award, Trophy, Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { ExecutiveScorecard } from "./ExecutiveScorecard";

interface Props {
  timePeriod: TimePeriod;
}

const Section = ({
  icon: Icon,
  number,
  title,
  children,
}: {
  icon: LucideIcon;
  number: number;
  title: string;
  children: React.ReactNode;
}) => (
  <AccordionItem value={`section-${number}`} className="glass-card border-border rounded-2xl overflow-hidden">
    <AccordionTrigger className="px-6 py-4 hover:no-underline">
      <div className="flex items-center gap-3 text-left">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/15 text-accent shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-accent font-semibold uppercase tracking-wider">Section {number}</div>
          <div className="text-foreground font-semibold text-base">{title}</div>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-6 pb-6 text-muted-foreground">{children}</AccordionContent>
  </AccordionItem>
);

const TwoColList = ({
  leftTitle, leftItems, leftTone = "positive",
  rightTitle, rightItems, rightTone = "negative",
}: {
  leftTitle: string; leftItems: string[]; leftTone?: "positive" | "negative";
  rightTitle: string; rightItems: string[]; rightTone?: "positive" | "negative";
}) => {
  const toneClasses = (t: "positive" | "negative") =>
    t === "positive"
      ? "border-success/40 bg-success/15"
      : "border-destructive/40 bg-destructive/15";
  const dot = (t: "positive" | "negative") =>
    t === "positive" ? "bg-success" : "bg-destructive";

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className={`rounded-xl p-4 border ${toneClasses(leftTone)}`}>
        <h4 className="text-foreground font-semibold mb-3">{leftTitle}</h4>
        <ul className="space-y-2">
          {leftItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot(leftTone)} shrink-0`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`rounded-xl p-4 border ${toneClasses(rightTone)}`}>
        <h4 className="text-foreground font-semibold mb-3">{rightTitle}</h4>
        <ul className="space-y-2">
          {rightItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${dot(rightTone)} shrink-0`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-sm">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const SimpleTable = ({
  headers, rows,
}: {
  headers: string[]; rows: string[][];
}) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-sm">
      <thead className="bg-panel">
        <tr>
          {headers.map((h) => (
            <th key={h} className="text-left px-4 py-3 text-accent font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const KpiTable = ({ title, metrics }: { title: string; metrics: string[] }) => (
  <Card variant="glass">
    <CardHeader>
      <CardTitle className="text-foreground text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <SimpleTable
        headers={["KPI", "Goal", "Actual"]}
        rows={metrics.map((m) => [m, "—", "—"])}
      />
    </CardContent>
  </Card>
);

const DayBlock = ({
  day, title, review, output,
}: {
  day: string; title: string; review: string[]; output: string[];
}) => (
  <Card variant="glass">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="border-accent/40 text-accent bg-accent/15">{day}</Badge>
        <CardTitle className="text-foreground text-base">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Review</div>
        <BulletList items={review} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Output</div>
        <BulletList items={output} />
      </div>
    </CardContent>
  </Card>
);

export const OperationalExcellence = ({ timePeriod }: Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="border-accent/40">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/15 text-accent shrink-0">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="text-accent text-sm font-semibold uppercase tracking-wider mb-1">
                JR Grand Homes / R&amp;R Grandeur Properties
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Operational Excellence &amp; Decision Management Playbook
              </h2>
              <p className="text-muted-foreground">
                The operating system for how the company runs — through systems, dashboards,
                and accountability instead of memory and reactive firefighting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={["section-1"]} className="space-y-4">
        <Section icon={Compass} number={1} title="Executive Operating Philosophy">
          <p className="mb-4">The company must operate through:</p>
          <TwoColList
            leftTitle="Operate Through"
            leftItems={[
              "Systems",
              "Dashboards",
              "Accountability",
              "Weekly reporting",
              "Standardized project management",
            ]}
            rightTitle="NOT Through"
            rightItems={[
              "Memory",
              "Random calls",
              "Scattered WhatsApp messages",
              "Reactive decision-making",
              "Founder overload",
            ]}
          />
        </Section>

        <Section icon={Users} number={2} title="Organizational Structure">
          <h4 className="text-foreground font-semibold mb-3">Founder / Executive Leadership</h4>
          <TwoColList
            leftTitle="Responsibilities"
            leftItems={[
              "Vision",
              "Capital raising",
              "Banking / lender relationships",
              "Strategic partnerships",
              "Hiring key operators",
              "High-level approvals",
              "Expansion planning",
            ]}
            rightTitle="Should NOT Handle Daily"
            rightItems={[
              "Contractor coordination",
              "Material ordering",
              "Invoice chasing",
              "Tenant maintenance",
              "Scheduling crews",
              "Small operational approvals",
              "Data entry",
            ]}
          />
        </Section>

        <Section icon={Building2} number={3} title="Department Structure">
          <SimpleTable
            headers={["Department", "Owner", "Weekly Deliverables"]}
            rows={[
              ["Acquisitions", "Acquisitions Manager", "Leads, offers, contracts, pipeline report"],
              ["Construction", "Project Manager", "Timeline, budget variance, progress updates"],
              ["Rentals", "Property Coordinator", "Occupancy, maintenance, delinquency"],
              ["Finance", "Finance Ops / Bookkeeping", "Cash report, AP/AR, project profitability"],
              ["Executive", "Founder", "Strategic decisions"],
            ]}
          />
        </Section>

        <Section icon={CalendarDays} number={4} title="Weekly Operating Rhythm">
          <div className="grid md:grid-cols-2 gap-4">
            <DayBlock
              day="Monday"
              title="Executive KPI Review"
              review={[
                "Cash position", "Revenue", "Expenses", "Net income",
                "Construction delays", "Closings", "Occupancy", "Critical risks",
              ]}
              output={["Executive dashboard", "Weekly priorities", "Escalation list"]}
            />
            <DayBlock
              day="Tuesday"
              title="Construction Operations"
              review={[
                "Active projects", "Budget variance", "Material delays",
                "Crew scheduling", "Permit status", "Punch lists",
              ]}
              output={["Updated project timelines", "Revised schedules", "Material procurement list"]}
            />
            <DayBlock
              day="Wednesday"
              title="Acquisitions & Disposition"
              review={[
                "Leads", "Offers sent", "Contracts signed",
                "Listing activity", "DOM", "Buyer pipeline",
              ]}
              output={["Offer strategy", "Pricing decisions", "Follow-up assignments"]}
            />
            <DayBlock
              day="Thursday"
              title="Finance & Capital"
              review={[
                "AP/AR", "Cash flow", "Upcoming draws",
                "Debt maturities", "Refinance status", "Investor updates",
              ]}
              output={["Cash allocation decisions", "Payment approvals", "Funding priorities"]}
            />
            <DayBlock
              day="Friday"
              title="Leadership & Planning"
              review={[
                "Wins / losses", "Operational blockers", "Staffing",
                "Next week priorities", "Project risk analysis",
              ]}
              output={["Weekly scorecard", "Next week action plan"]}
            />
          </div>
        </Section>

        <Section icon={GitBranch} number={5} title="Decision Escalation Matrix">
          <div className="space-y-4">
            {[
              {
                level: "Level 1 — Team Decision",
                desc: "Handled without founder involvement.",
                tone: "border-success/40 bg-success/15",
                examples: ["Paint colors", "Minor repairs", "Scheduling crews", "Routine maintenance", "Vendor follow-up"],
              },
              {
                level: "Level 2 — Manager Approval",
                desc: "Requires PM or department lead.",
                tone: "border-accent/40 bg-accent/15",
                examples: ["Budget change under $5K", "Material substitutions", "Timeline adjustment under 7 days", "Tenant concessions"],
              },
              {
                level: "Level 3 — Executive Decision",
                desc: "Requires founder approval.",
                tone: "border-destructive/40 bg-destructive/15",
                examples: ["New acquisitions", "Capital allocation", "Budget overruns > $10K", "Hiring/firing", "Strategic pivots", "Major lender decisions"],
              },
            ].map((lvl) => (
              <div key={lvl.level} className={`rounded-xl p-4 border ${lvl.tone}`}>
                <h4 className="text-foreground font-semibold">{lvl.level}</h4>
                <p className="text-muted-foreground text-sm mb-3">{lvl.desc}</p>
                <BulletList items={lvl.examples} />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={ClipboardList} number={6} title="Project Startup Checklist">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Pre-Construction", items: ["Scope of work","Budget sheet","Timeline","Material list","Permit review","Contractor assignment","Insurance verification","Draw schedule"] },
              { title: "During Construction", items: ["Weekly progress report","Budget tracking","Updated timeline","Material inventory","Daily site photos","Change order log"] },
              { title: "Closeout", items: ["Punch list","Final walkthrough","Cleaning checklist","Listing readiness","Warranty tracking","Final budget review"] },
            ].map((g) => (
              <div key={g.title} className="rounded-xl p-4 border border-border bg-panel">
                <h4 className="text-foreground font-semibold mb-3">{g.title}</h4>
                <BulletList items={g.items} />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={LayoutDashboard} number={7} title="Standard Project Dashboard">
          <SimpleTable
            headers={["Field", "Description"]}
            rows={[
              ["Property Address", "Full property address"],
              ["PM Assigned", "Project manager"],
              ["Budget", "Total approved budget"],
              ["Actual Spend", "Live spend tracking"],
              ["Completion %", "Updated weekly"],
              ["Start Date", "Construction start"],
              ["Completion Date", "Expected finish"],
              ["Status", "Green / Yellow / Red"],
              ["Delay Reason", "If delayed"],
              ["Next Milestone", "Upcoming activity"],
            ]}
          />
        </Section>

        <Section icon={FileText} number={8} title="Weekly Construction Report Template">
          <div className="rounded-xl border border-border bg-panel p-5 space-y-3 text-sm">
            {[
              "Property:", "PM:", "Week Ending:", "Current Completion: ___%",
              "Approved Budget:", "Actual Spend:", "Variance:",
              "Work Completed This Week:", "Work Scheduled Next Week:",
              "Material Delays:", "Inspection Status:", "Risks / Issues:",
              "Photos Attached: YES / NO",
            ].map((line) => (
              <div key={line} className="flex items-center gap-3 border-b border-border pb-2 last:border-0">
                <span className="text-foreground font-medium">{line}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={TrendingUp} number={9} title="Acquisitions KPI Dashboard">
          <KpiTable
            title="Weekly Metrics"
            metrics={["Leads Received","Deals Underwritten","Offers Sent","Contracts Signed","Closings","Avg ARV","Avg Margin"]}
          />
        </Section>

        <Section icon={Home} number={10} title="Rental Operations Dashboard">
          <KpiTable
            title="Weekly Metrics"
            metrics={["Occupancy","Delinquency","Maintenance Tickets","Leasing Pipeline","Cash Flow"]}
          />
        </Section>

        <Section icon={DollarSign} number={11} title="Finance Operations Dashboard">
          <KpiTable
            title="Weekly Metrics"
            metrics={["Cash Available","AP Outstanding","AR Outstanding","Draws Pending","Debt Payments Due","Burn Rate"]}
          />
        </Section>

        <Section icon={UserPlus} number={12} title="Hiring Framework">
          <TwoColList
            leftTitle="Every Hire Must Have"
            leftItems={["Clear KPIs","Defined ownership","Reporting structure","Weekly deliverables","Accountability metrics"]}
            rightTitle="Avoid Hiring"
            rightItems={["Undefined helpers","Emotional hires","Passive employees","People needing constant supervision"]}
          />
        </Section>

        <Section icon={MessageSquare} number={13} title="Communication Rules">
          <p className="mb-4 text-muted-foreground font-medium">No Random Operational Communication</p>
          <TwoColList
            leftTitle="All Communication Flows Through"
            leftItems={["Dashboard","Task system","Weekly reports","Scheduled meetings"]}
            rightTitle="Avoid"
            rightItems={["Random verbal updates","Untracked tasks","Founder bottlenecks","WhatsApp-only operations"]}
          />
        </Section>

        <Section icon={Shield} number={14} title="Founder Time Protection Rules">
          <TwoColList
            leftTitle="Founder Should Spend Majority Time On"
            leftItems={["Capital","Strategy","Relationships","Hiring","Expansion","System design"]}
            rightTitle="Founder Should NOT Spend Majority Time On"
            rightItems={["Site coordination","Contractor chasing","Invoice collection","Scheduling","Small operational fires"]}
          />
        </Section>

        <Section icon={Target} number={15} title="Long-Term Vision">
          <div className="rounded-xl p-5 border border-accent/40 bg-accent/15">
            <h4 className="text-foreground font-semibold mb-3">Goal</h4>
            <p className="text-muted-foreground mb-3">
              Build a vertically integrated operating company with:
            </p>
            <BulletList items={["Acquisitions","Construction","Rentals","Finance operations","Technology systems","Scalable management"]} />
          </div>
        </Section>

        <Section icon={Lightbulb} number={16} title="Operational Excellence Principles">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["1. Standardization","Every project follows the same process."],
              ["2. Accountability","Every task has an owner."],
              ["3. Visibility","Every metric is measurable."],
              ["4. Reporting","Data replaces assumptions."],
              ["5. Scalability","Systems must work without founder involvement."],
              ["6. Simplicity","Simple systems executed consistently outperform complex chaos."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl p-4 border border-border bg-panel">
                <h4 className="text-foreground font-semibold mb-1">{title}</h4>
                <p className="text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Trophy} number={17} title="Weekly Executive Scorecard">
          <p className="text-muted-foreground text-sm mb-4">
            Capture each department's weekly KPI, status, and notes. Saved locally to this browser.
          </p>
          <ExecutiveScorecard />
        </Section>

        <Section icon={Award} number={18} title="Final Principle">
          <TwoColList
            leftTitle="The Company Should Operate Through"
            leftItems={["Systems","Dashboards","Managers","Reporting","Accountability"]}
            rightTitle="NOT Through"
            rightItems={["Founder memory","Constant firefighting","Emotional decision-making","Operational chaos","Dependency on one person"]}
          />
        </Section>
      </Accordion>
    </div>
  );
};
