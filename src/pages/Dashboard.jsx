import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-[calc(100vh-64px)]" style={{ background:"var(--color-bg)" }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8" style={{ background:"var(--color-bg)" }}>
        <Outlet />
      </main>
    </div>
  );
}
