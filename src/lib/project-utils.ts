import type { Project, ProjectStatus } from "@/services/projects.service";
import type { RenovationItem } from "@/services/renovation-items.service";

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  planned: "bg-muted",
  in_progress: "bg-blue-500",
  on_hold: "bg-warning",
  completed: "bg-success",
  cancelled: "bg-destructive",
};

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

/** Actual spend for a project: sums its renovation items' actual cost, falling
 * back to the project's own actualCost field if it has no line items. */
export function projectActualCost(project: Project, items: RenovationItem[]): number {
  if (items.length > 0) return items.reduce((sum, i) => sum + (i.actualCost ?? 0), 0);
  return project.actualCost ?? 0;
}

/** Budget for a project: uses the project's own budget field if set, else
 * sums its renovation items' estimated cost. */
export function projectBudget(project: Project, items: RenovationItem[]): number {
  if (project.budget != null) return project.budget;
  return items.reduce((sum, i) => sum + i.estimatedCost, 0);
}
