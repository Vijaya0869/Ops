import { describe, expect, it } from "vitest";
import { daysBetween, projectActualCost, projectBudget } from "./project-utils";
import type { Project } from "@/services/projects.service";
import type { RenovationItem } from "@/services/renovation-items.service";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "proj-1",
    userId: "user-1",
    propertyId: "prop-1",
    name: "Kitchen remodel",
    description: null,
    status: "in_progress",
    budget: null,
    actualCost: null,
    startDate: null,
    endDate: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

function makeItem(overrides: Partial<RenovationItem> = {}): RenovationItem {
  return {
    id: "item-1",
    userId: "user-1",
    propertyId: "prop-1",
    projectId: "proj-1",
    category: "Cabinets",
    description: null,
    estimatedCost: 1000,
    actualCost: null,
    completed: false,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

describe("daysBetween", () => {
  it("computes whole days between two dates", () => {
    expect(daysBetween(new Date("2026-01-01"), new Date("2026-01-11"))).toBe(10);
  });

  it("returns a negative number when b is before a", () => {
    expect(daysBetween(new Date("2026-01-11"), new Date("2026-01-01"))).toBe(-10);
  });
});

describe("projectBudget", () => {
  it("uses the project's own budget field when set, ignoring line items", () => {
    const project = makeProject({ budget: 20000 });
    const items = [makeItem({ estimatedCost: 500 })];
    expect(projectBudget(project, items)).toBe(20000);
  });

  it("sums line-item estimates when the project has no budget set", () => {
    const project = makeProject({ budget: null });
    const items = [makeItem({ estimatedCost: 1000 }), makeItem({ estimatedCost: 2500 })];
    expect(projectBudget(project, items)).toBe(3500);
  });

  it("returns 0 when there's no budget and no line items", () => {
    const project = makeProject({ budget: null });
    expect(projectBudget(project, [])).toBe(0);
  });

  it("treats an explicit budget of 0 as set, not falling back to line items", () => {
    const project = makeProject({ budget: 0 });
    const items = [makeItem({ estimatedCost: 5000 })];
    expect(projectBudget(project, items)).toBe(0);
  });
});

describe("projectActualCost", () => {
  it("sums line items' actual cost when items exist", () => {
    const project = makeProject({ actualCost: 999 });
    const items = [makeItem({ actualCost: 400 }), makeItem({ actualCost: 600 })];
    expect(projectActualCost(project, items)).toBe(1000);
  });

  it("treats a null actualCost on a line item as 0, not a skip", () => {
    const project = makeProject();
    const items = [makeItem({ actualCost: 400 }), makeItem({ actualCost: null })];
    expect(projectActualCost(project, items)).toBe(400);
  });

  it("falls back to the project's own actualCost when there are no line items", () => {
    const project = makeProject({ actualCost: 7500 });
    expect(projectActualCost(project, [])).toBe(7500);
  });

  it("falls back to 0 when there are no line items and no actualCost", () => {
    const project = makeProject({ actualCost: null });
    expect(projectActualCost(project, [])).toBe(0);
  });
});
