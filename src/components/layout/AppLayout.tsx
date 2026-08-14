import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

// Mounts Navigation once for the whole authenticated app instead of once
// per page — previously every page rendered its own <Navigation /> copy
// inside an identical wrapper div, remounting the sidebar (and losing any
// of its local state) on every route change.
export function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <Outlet />
    </div>
  );
}
