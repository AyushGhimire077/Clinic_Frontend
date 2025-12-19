import type { JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { getTokenFromCookies } from "./component/global/config";
import PageNotFound from "./component/PageNotFound";
import { Toast } from "./component/toaster/components/Toast";
import AppointmentDashboard from "./pages/appointment/AppointmentDashboard ";
import AddAppointment from "./pages/appointment/component/AddAppointment";
import AppointmentTable from "./pages/appointment/component/AppointmentTable";
import { useAuthStore } from "./pages/auth/auth.store/auth.store";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import AddEpisode from "./pages/episode/component/episode/AddEpisode";
import EpisodeDetail from "./pages/episode/component/episode/EpisodeDetail";
import EpisodeTable from "./pages/episode/component/episode/EpisodeTable";
import AddEpisodeTemp from "./pages/episode/component/temp/AddEpisodeTemp";
import EpisodeTempTable from "./pages/episode/component/temp/EpisodeTempTable";
import EpisodeDashboard from "./pages/episode/EpisodeDashboard";
import Layout from "./pages/layout/Layout";
import AddPatient from "./pages/patient/componet/AddPatient";
import PatientDetail from "./pages/patient/componet/PatientDetail";
import PatientTable from "./pages/patient/componet/PatientTable";
import Patient from "./pages/patient/PatientDashboard";
import AddService from "./pages/services/componet/AddService";
import ServiceTable from "./pages/services/componet/ServiceTable";
import ServicesDashboard from "./pages/services/ServicesDashboard";
import AddRole from "./pages/staff/componet/roles/AddRole";
import RoleTable from "./pages/staff/componet/roles/RoleTable";
import AddStaff from "./pages/staff/componet/staff/AddStaff";
import StaffTable from "./pages/staff/componet/staff/StaffTable";
import StaffDashboard from "./pages/staff/StaffDashboard";
import VisitInfo from "./pages/visit/component/VisitInfo";
import VisitTable from "./pages/visit/component/VistiTable";
import VisitDashboard from "./pages/visit/VistiDashboard";

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
              <Route path="edit" element={<AddRole />} />
            </Route>
            <Route path="add-staff" element={<AddStaff />} />
            <Route path="edit" element={<AddStaff />} />
            <Route path="table" element={<StaffTable />} />
          </Route>

          {/* Patient */}
          <Route path="patient">
            <Route index element={<Patient />} />
            <Route path="add" element={<AddPatient />} />
            <Route path="edit/:id" element={<AddPatient />} />

            <Route path="view" element={<PatientTable />} />
            <Route path=":id/detail" element={<PatientDetail />} />
          </Route>

          {/* Services */}
          <Route path="services">
            <Route index element={<ServicesDashboard />} />
            <Route path="add" element={<AddService />} />
            <Route path="view" element={<ServiceTable />} />
          </Route>


          {/* Appointment  */}
          <Route path="appointment">
            <Route index element={<AppointmentDashboard />} />
            <Route path="create" element={<AddAppointment />} />

            <Route path="edit" element={<AddAppointment />} />
            <Route path="create" element={<AddAppointment />} />
            <Route path="view-appointment" element={<AppointmentTable />} />


          </Route>


          {/* Visit */}
          <Route path="visits">
            <Route index element={<VisitDashboard />} />
            <Route path="view" element={<VisitTable status="ONGOING" />} />
            <Route path="visit-info" element={<VisitInfo />} />
          </Route>

          {/* Episode */}
          <Route path="episode">
            <Route index element={<EpisodeDashboard />} />
            <Route path="view" element={<EpisodeTable />} />
            <Route path="add" element={<AddEpisode />} />
            <Route path="view/:id" element={<EpisodeDetail />} />
            <Route path="add?patientId=:patientId" element={<AddEpisode />} />
            <Route path="add?template=:template" element={<AddEpisode />} />
            <Route path="templates/add" element={<AddEpisodeTemp />} />
            <Route path="templates/view" element={<EpisodeTempTable />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
