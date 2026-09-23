import AuthGuard from "@/Auth/context/AuthGuard";
import Sidebar from "./components/Sidebar";
import "../globals.css";

const DashboardLayout = ({ children }) => {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-zinc-100">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardLayout;