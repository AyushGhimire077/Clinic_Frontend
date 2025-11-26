import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AuthPage from "../auth/AuthPage";
import { getTokenFromCookies } from "../global/config";
import Sidebar from "./Sidebar";
import AppBar from "./AppBar";

const Layout = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getTokenFromCookies());
  }, []);

  if (!token) {
    return <AuthPage />;
  }

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full px-3">
          <AppBar />
          <div className="w-full mt-2 overflow-y-scroll rounded">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
