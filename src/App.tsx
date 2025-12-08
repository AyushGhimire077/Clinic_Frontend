import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./pages/auth/store";
import type { JSX } from "react";
import Layout from "./pages/layout/Layout";
import Staff from "./pages/staff/Staff";
import AddRole from "./pages/staff/componet/staff_roles/Add_Role";
 import RoleTable from "./pages/staff/componet/staff_roles/Role_Table";
import AddStaff from "./pages/staff/componet/staff/Add_Staff";
import Patient from "./pages/patient/Patient";
import StaffTable from "./pages/staff/componet/staff/Staff_Table";
import PatientTable from "./pages/patient/componet/helper/Patient_Table";
import AddPatient from "./pages/patient/componet/Add_Patient";
import Appointment from "./pages/appointment/Appointment";
import AppointmentTable from "./pages/appointment/component/Appointment_Table";
import AddAppointment from "./pages/appointment/component/Add_Appointment";
import Services from "./pages/services/Services";
import AddServices from "./pages/services/componet/Add_Services";
import ServiceTable from "./pages/services/componet/Service_Table";
import PatientDetail from "./pages/patient/componet/Patient_Detail";
import Episode from "./pages/episode/Episode";
import AddEpisode from "./pages/episode/component/Add_Episode";
import EpisodeTable from "./pages/episode/component/Episode_Table";
import AddEpisodeTemp from "./pages/episode/component/AddEpisodeTemp";
import EpisodeTempTable from "./pages/episode/component/EpisodeTempTable";
import { Toast } from "./component/toaster/components/Toast";
 
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
 
  return (
    <>
      <Toast />
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
          <Route path="patient">
            <Route index element={<Patient />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="view-patients" element={<PatientTable />} />
            <Route path="detail/:id" element={<PatientDetail />} />
          </Route>

          <Route path="appointment">
            <Route index element={<Appointment />} />
            <Route path="create" element={<AddAppointment />} />
            <Route path="view-appointment" element={<AppointmentTable />} />
            {/* aslo for editing appointment */}
            <Route path="edit/:id" element={<AddAppointment />} />
          </Route>

          <Route path="services">
            <Route index element={<Services />} />
            <Route path="create" element={<AddServices />} />
            <Route path="view-services" element={<ServiceTable />} />
          </Route>

          <Route path="episode">
            <Route index element={<Episode />} />
            <Route path="view" element={<EpisodeTable />} />
            <Route path="create" element={<AddEpisode />} />
            <Route path="create-temp" element={<AddEpisodeTemp />} />
            <Route path="view-templates" element={<EpisodeTempTable />} />
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
