import { api } from "./api-client";

export type ProjectStatus = "planned" | "in_progress" | "on_hold" | "completed" | "cancelled";

export interface Project {
  id: string;
  userId: string;
  propertyId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  budget: number | null;
  actualCost: number | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  propertyId: string;
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  budget?: number | null;
  actualCost?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export async function fetchProjects(): Promise<Project[]> {
  return api.get<Project[]>("/projects");
}

export async function addProject(data: ProjectInput): Promise<Project> {
  return api.post<Project>("/projects", data);
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<Project> {
  return api.patch<Project>(`/projects/${id}`, data);
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete(`/projects/${id}`);
}
