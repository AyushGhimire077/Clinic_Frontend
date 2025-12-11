// import { useToast } from "../../../component/toaster/useToast";
// import { usePatientStore } from "../../patient/helper/patient.store";
// import { useStaffStore } from "../../staff/staff.helper/staff.store";
// import { useAppointmentStore } from "../helper/appointment.store";

// export const useLoadAppointmentDependencies = () => {
//   const { getAllActiveStaff } = useStaffStore();

//   const { getAllActivePatients } = usePatientStore();

//   const { getAllAppointments } = useAppointmentStore();

//   const { showToast } = useToast();

//   const pagination = { page: 0, size: 10 };

//   const loadDependencies = async () => {
//     try {
//       await Promise.all([
//         getAllActiveStaff(pagination),
//         getAllActivePatients(pagination),
//         getAllAppointments(pagination),
//       ]);
//     } catch (error) {
//       showToast("Error loading dependencies", "error");
//     }
//   };

//   return { loadDependencies };
// };
