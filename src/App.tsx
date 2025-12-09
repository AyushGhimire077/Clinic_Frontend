import type { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toast } from "./component/toaster/components/Toast";
import AuthPage from "./pages/auth/AuthPage";
import { useAuthStore } from "./pages/auth/store/auth.store";

import Dashboard from "./pages/Dashboard";
import AddEpisode from "./pages/episode/component/AddEpisode";
import AddEpisodeTemp from "./pages/episode/component/AddEpisodeTemp";
import EpisodeTable from "./pages/episode/component/EpisodeTable";
import EpisodeTempTable from "./pages/episode/component/EpisodeTempTable";
import Episode from "./pages/episode/Episode";

import AddPatient from "./pages/patient/componet/AddPatient";
import PatientDetail from "./pages/patient/componet/PatientDetail";
import Patient from "./pages/patient/PatientDashboard";
import PatientTable from "./pages/patient/componet/PatientTable";

import AddRole from "./pages/staff/componet/roles/AddRole";
import RoleTable from "./pages/staff/componet/roles/RoleTable";
import AddStaff from "./pages/staff/componet/staff/AddStaff";
import StaffTable from "./pages/staff/componet/staff/StaffTable";
import StaffDashboard from "./pages/staff/StaffDashboard";

import ServicesDashboard from "./pages/services/ServicesDashboard";
import AddService from "./pages/services/componet/AddService";
import ServiceTable from "./pages/services/componet/ServiceTable";

import Layout from "./pages/layout/Layout";
import { getTokenFromCookies } from "./component/global/config";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getTokenFromCookies();

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuthStore();
  const token = user?.token;

  if (token) return <Navigate to="/home" replace />;

  return children;
};

const App = () => {
  const { user } = useAuthStore();
  const token = user?.token;

   return (
    <>
      <Toast />

      <Routes>
        {/* Public */}
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Protected */}
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

          {/* Staff */}
          <Route path="staff">
            <Route index element={<StaffDashboard />} />
            <Route path="roles">
              <Route index element={<AddRole />} />
              <Route path="view" element={<RoleTable />} />
            </Route>
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="table" element={<StaffTable />} />
          </Route>

          {/* Patient */}
          <Route path="patient">
            <Route index element={<Patient />} />
            <Route path="add" element={<AddPatient />} />

            <Route path="view" element={<PatientTable />} />
            <Route path=":id/detail" element={<PatientDetail />} />
          </Route>

          {/* Services */}
          <Route path="services">
            <Route index element={<ServicesDashboard />} />
            <Route path="create" element={<AddService />} />
             <Route path="view-services" element={<ServiceTable />} />
          </Route>

          {/* Episode */}
          <Route path="episode">
            <Route index element={<Episode />} />
            <Route path="view" element={<EpisodeTable />} />
            <Route path="create" element={<AddEpisode />} />
            <Route path="create-temp" element={<AddEpisodeTemp />} />
            <Route path="view-templates" element={<EpisodeTempTable />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/home" : "/sign-in"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
