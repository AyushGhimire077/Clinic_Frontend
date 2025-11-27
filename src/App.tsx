import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./pages/auth/store";
import type { JSX } from "react";
import Layout from "./pages/layout/Layout";
import Staff from "./pages/staff/Staff";
import AddRole from "./pages/staff/componet/staff_roles/Add_Role";
import Toaster from "./component/toaster/toaster";
import { useGlobalStore } from "./component/toaster/store";
import RoleTable from "./pages/staff/componet/staff_roles/Role_Table";
import AddStaff from "./pages/staff/componet/staff/Add_Staff";
 import Patient from "./pages/patient/Patient";
import StaffTable from "./pages/staff/componet/staff/Staff_Table";
import PatientTable from "./pages/patient/componet/helper/Patient_Table";
import AddPatient from "./pages/patient/componet/Add_Patient";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

const App = () => {
  const token = useAuthStore((state) => state.token);
  const { toasterData, closeToaster } = useGlobalStore();

  return (
    <>
      <Toaster data={toasterData} close={closeToaster} />
      <Routes>
        {/* Public route without Layout */}
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected routes wrapped in Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="home" element={<Dashboard />} />

          {/* staff section */}
          <Route path="staff">
            <Route index element={<Staff />} />
            <Route path="roles">
              <Route index element={<AddRole />} />
              <Route path="view" element={<RoleTable />} />
            </Route>

            {/* add staff */}
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="table" element={<StaffTable />} />
          </Route>

          {/* patient section  */}

        <Route path="patient" >
          <Route index element={<Patient />} />
          <Route path="add-patient" element={<AddPatient />} />
          <Route path="view-patients" element={<PatientTable />} />
        </Route>

        </Route>

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={token ? "/home" : "/sign-in"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
