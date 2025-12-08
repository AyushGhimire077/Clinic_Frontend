 import { usePatientStore } from "../../patient/componet/helper/store";
import { useStaffStore } from "../../staff/componet/staff/helper/store";
import { useAppointmentStore } from "../helper/store";
import { useGlobalStore } from "../../../component/toaster/toast.store";

export const useLoadAppointmentDependencies = () => {
  const { getAllActiveStaff } = useStaffStore();

  const { getAllActivePatients } = usePatientStore();

  const { getAllAppointments } = useAppointmentStore();

  const { setToasterData } = useGlobalStore();

  const pagination = { page: 0, size: 10 };

  const loadDependencies = async () => {
    try {
      await Promise.all([
        getAllActiveStaff(pagination),
        getAllActivePatients(pagination),
        getAllAppointments(pagination),
      ]);
    } catch (error) {
      setToasterData({
        message: "Failed to load required data",
        severity: "error",
        open: true,
      });
    }
  };

  return { loadDependencies };
};
