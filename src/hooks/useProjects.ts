import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import * as projectsService from "@/services/projects.service";
import type { Project, ProjectInput } from "@/services/projects.service";

export type { Project, ProjectInput };

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    projectsService
      .fetchProjects()
      .then(setProjects)
      .catch((error) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const addProject = async (data: ProjectInput) => {
    try {
      const project = await projectsService.addProject(data);
      setProjects((prev) => [project, ...prev]);
      toast.success("Project added");
      return project;
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
      return null;
    }
  };

  const updateProject = async (id: string, data: Partial<ProjectInput>) => {
    try {
      const updated = await projectsService.updateProject(id, data);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      toast.success("Project updated");
      return updated;
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
      return null;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
      return false;
    }
  };

  return { projects, loading, addProject, updateProject, deleteProject };
}
