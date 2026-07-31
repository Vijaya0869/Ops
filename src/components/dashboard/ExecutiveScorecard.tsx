import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, RotateCcw, FileDown, FileText, Upload, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_LABEL: Record<string, string> = {
  green: "On Track",
  yellow: "At Risk",
  red: "Off Track",
};

const todayStamp = () => new Date().toISOString().slice(0, 10);

const csvEscape = (v: string) => {
  const s = (v ?? "").toString();
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

type Status = "green" | "yellow" | "red" | "";

interface Row {
  department: string;
  kpi: string;
  status: Status;
  notes: string;
}

const DEFAULT_ROWS: Row[] = [
  { department: "Acquisitions", kpi: "", status: "", notes: "" },
  { department: "Construction", kpi: "", status: "", notes: "" },
  { department: "Rentals", kpi: "", status: "", notes: "" },
  { department: "Finance", kpi: "", status: "", notes: "" },
  { department: "Executive", kpi: "", status: "", notes: "" },
];

const STORAGE_KEY = "executive-scorecard-v1";

const statusStyles: Record<Exclude<Status, "">, string> = {
  green: "border-success/40 bg-success/15 text-success",
  yellow: "border-accent/40 bg-accent/15 text-accent",
  red: "border-destructive/40 bg-destructive/15 text-red-300",
};

const DEPARTMENT_SYNONYMS: Record<string, string> = {
  acquisitions: "Acquisitions",
  acquisition: "Acquisitions",
  acq: "Acquisitions",
  acquire: "Acquisitions",
  acquiring: "Acquisitions",
  deals: "Acquisitions",
  dealflow: "Acquisitions",
  sourcing: "Acquisitions",
  leads: "Acquisitions",
  construction: "Construction",
  constr: "Construction",
  build: "Construction",
  builds: "Construction",
  building: "Construction",
  rehab: "Construction",
  rehabs: "Construction",
  renovation: "Construction",
  renovations: "Construction",
  reno: "Construction",
  project: "Construction",
  projects: "Construction",
  rentals: "Rentals",
  rental: "Rentals",
  leasing: "Rentals",
  lease: "Rentals",
  leases: "Rentals",
  tenants: "Rentals",
  tenant: "Rentals",
  propertymanagement: "Rentals",
  pm: "Rentals",
  finance: "Finance",
  financial: "Finance",
  financials: "Finance",
  accounting: "Finance",
  acct: "Finance",
  treasury: "Finance",
  capital: "Finance",
  lending: "Finance",
  executive: "Executive",
  exec: "Executive",
  leadership: "Executive",
  ceo: "Executive",
  founder: "Executive",
  ops: "Executive",
  admin: "Executive",
};

const normalizeDept = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const matchDepartment = (raw: string): string | null => {
  const n = normalizeDept(raw);
  if (!n) return null;
  if (DEPARTMENT_SYNONYMS[n]) return DEPARTMENT_SYNONYMS[n];
  // substring match against synonym keys
  const keys = Object.keys(DEPARTMENT_SYNONYMS).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (n.includes(k) || k.includes(n)) return DEPARTMENT_SYNONYMS[k];
  }
  return null;
};

const parseStatus = (v: string): Status => {
  const s = (v || "").trim().toLowerCase();
  if (!s) return "";
  if (["green", "on track", "ontrack", "on-track", "🟢"].some((k) => s.includes(k))) return "green";
  if (["yellow", "at risk", "atrisk", "at-risk", "🟡"].some((k) => s.includes(k))) return "yellow";
  if (["red", "off track", "offtrack", "off-track", "🔴"].some((k) => s.includes(k))) return "red";
  return "";
};

const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cur.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        cur.push(field); rows.push(cur); cur = []; field = "";
      } else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
};

export const ExecutiveScorecard = () => {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRows(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const update = (idx: number, field: keyof Row, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    toast.success("Scorecard saved");
  };

  const reset = () => {
    setRows(DEFAULT_ROWS);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Scorecard reset");
  };

  const downloadTemplate = () => {
    const headers = ["Department", "KPI", "Status", "Notes"];
    const sample: string[][] = [
      ["Acquisitions", "12 leads / 4 offers / 1 contract", "Green", "Pipeline healthy; focus on Plano zip codes"],
      ["Construction", "3 rehabs on schedule, 1 delayed", "Yellow", "Tile vendor delay on 123 Oak St — ETA Friday"],
      ["Rentals", "2 units leased, 0 vacant > 30 days", "Green", "Renewal letters sent for Q3 expirations"],
      ["Finance", "DSCR 1.42, cash reserves $185k", "Green", "Refi closing on 456 Elm next week"],
      ["Executive", "Weekly scorecard reviewed Monday", "Yellow", "Need to finalize Q4 hiring plan"],
    ];
    const lines = [
      headers.join(","),
      ...sample.map((r) => r.map(csvEscape).join(",")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "executive-scorecard-template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template downloaded");
  };

  const exportCSV = () => {
    const headers = ["Department", "KPI", "Status", "Notes"];
    const lines = [
      headers.join(","),
      ...rows.map((r) =>
        [r.department, r.kpi, STATUS_LABEL[r.status] || "", r.notes].map(csvEscape).join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executive-scorecard-${todayStamp()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    doc.setFontSize(16);
    doc.text("Weekly Executive Scorecard", 40, 40);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated ${todayStamp()}`, 40, 58);

    autoTable(doc, {
      startY: 75,
      head: [["Department", "KPI", "Status", "Notes"]],
      body: rows.map((r) => [r.department, r.kpi, STATUS_LABEL[r.status] || "—", r.notes]),
      headStyles: { fillColor: [191, 149, 63], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 6, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 110, fontStyle: "bold" },
        1: { cellWidth: 200 },
        2: { cellWidth: 90 },
        3: { cellWidth: "auto" },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const r = rows[data.row.index];
          if (r.status === "green") data.cell.styles.textColor = [16, 122, 87];
          if (r.status === "yellow") data.cell.styles.textColor = [161, 124, 0];
          if (r.status === "red") data.cell.styles.textColor = [176, 35, 35];
        }
      },
    });

    doc.save(`executive-scorecard-${todayStamp()}.pdf`);
    toast.success("PDF downloaded");
  };

  const importCSV = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      if (parsed.length === 0) { toast.error("CSV is empty"); return; }
      // detect header row
      const first = parsed[0].map((h) => h.trim().toLowerCase());
      const hasHeader = first.includes("department") || first.includes("kpi");
      const dataRows = hasHeader ? parsed.slice(1) : parsed;

      // index columns from header if present
      const colIdx = { dept: 0, kpi: 1, status: 2, notes: 3 };
      if (hasHeader) {
        first.forEach((h, i) => {
          if (h.startsWith("dep")) colIdx.dept = i;
          else if (h === "kpi") colIdx.kpi = i;
          else if (h.startsWith("stat")) colIdx.status = i;
          else if (h.startsWith("note")) colIdx.notes = i;
        });
      }

      const imported = dataRows.map((r) => ({
        rawDept: (r[colIdx.dept] || "").trim(),
        kpi: (r[colIdx.kpi] || "").trim().slice(0, 200),
        status: parseStatus(r[colIdx.status] || ""),
        notes: (r[colIdx.notes] || "").trim().slice(0, 1000),
      }));

      if (imported.length === 0) { toast.error("No data rows found"); return; }

      // Start from canonical departments, fill via fuzzy matching
      const merged: Row[] = DEFAULT_ROWS.map((d) => ({ ...d }));
      const extras: Row[] = [];
      let matchedCount = 0;
      let unmatchedCount = 0;

      for (const row of imported) {
        const canonical = matchDepartment(row.rawDept);
        if (canonical) {
          const idx = merged.findIndex((m) => m.department === canonical);
          if (idx >= 0) {
            // if slot already populated, append the additional KPI to notes
            if (merged[idx].kpi || merged[idx].status || merged[idx].notes) {
              extras.push({
                department: canonical,
                kpi: row.kpi,
                status: row.status,
                notes: row.notes,
              });
            } else {
              merged[idx] = {
                department: canonical,
                kpi: row.kpi,
                status: row.status,
                notes: row.notes,
              };
            }
            matchedCount++;
            continue;
          }
        }
        unmatchedCount++;
        extras.push({
          department: (row.rawDept || "—").slice(0, 100),
          kpi: row.kpi,
          status: row.status,
          notes: row.notes,
        });
      }

      setRows([...merged, ...extras]);
      toast.success(
        `Imported ${imported.length} row${imported.length === 1 ? "" : "s"} (${matchedCount} matched${unmatchedCount ? `, ${unmatchedCount} unmatched` : ""}). Click Save to persist.`
      );
    } catch (e) {
      console.error(e);
      toast.error("Failed to parse CSV");
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-panel">
            <tr>
              <th className="text-left px-4 py-3 text-accent font-semibold w-[160px]">Department</th>
              <th className="text-left px-4 py-3 text-accent font-semibold">KPI</th>
              <th className="text-left px-4 py-3 text-accent font-semibold w-[150px]">Status</th>
              <th className="text-left px-4 py-3 text-accent font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.department} className="border-t border-border align-top">
                <td className="px-4 py-3 text-foreground font-medium">{row.department}</td>
                <td className="px-4 py-3">
                  <Input
                    value={row.kpi}
                    onChange={(e) => update(i, "kpi", e.target.value.slice(0, 200))}
                    placeholder="e.g. 12 leads / 4 offers"
                    className="bg-panel border-border text-foreground placeholder:text-muted-foreground"
                  />
                </td>
                <td className="px-4 py-3">
                  <Select
                    value={row.status || undefined}
                    onValueChange={(v) => update(i, "status", v)}
                  >
                    <SelectTrigger
                      className={`bg-panel border-border text-foreground ${
                        row.status ? statusStyles[row.status as Exclude<Status, "">] : ""
                      }`}
                    >
                      <SelectValue placeholder="Set status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="green">🟢 On Track</SelectItem>
                      <SelectItem value="yellow">🟡 At Risk</SelectItem>
                      <SelectItem value="red">🔴 Off Track</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Textarea
                    value={row.notes}
                    onChange={(e) => update(i, "notes", e.target.value.slice(0, 1000))}
                    placeholder="Notes, blockers, next steps…"
                    rows={2}
                    className="bg-panel border-border text-foreground placeholder:text-muted-foreground min-h-[60px]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importCSV(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2"
        >
          <Upload className="h-4 w-4" /> Import CSV
        </Button>
        <Button variant="outline" size="sm" onClick={downloadTemplate} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" /> CSV Template
        </Button>
        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
          <FileDown className="h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={exportPDF} className="gap-2">
          <FileText className="h-4 w-4" /> Export PDF
        </Button>
        <Button size="sm" onClick={save} className="gap-2 bg-accent text-black hover:bg-accent/15">
          <Save className="h-4 w-4" /> Save Scorecard
        </Button>
      </div>
    </div>
  );
};
