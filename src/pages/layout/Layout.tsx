import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../auth/store/auth.store";
import { Sidebar } from "./component/Sidebar";
import { AppBar } from "./component/AppBar";

const Layout = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 bg-gray-900 text-white ">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <AppBar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
