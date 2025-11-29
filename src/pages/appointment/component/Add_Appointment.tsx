import { useEffect, useState } from "react";
import { useAppointmentStore } from "../helper/store";
import type { IAppointmentRequest } from "../helper/interface";
import { useGlobalStore } from "../../../component/toaster/store";
import { useStaffStore } from "../../staff/componet/staff/helper/store";
import { usePatientStore } from "../../patient/componet/helper/store";

const AddAppointment = () => {
  const { create } = useAppointmentStore();
  const { setToasterData } = useGlobalStore();
  const { staffList, getAllActiveStaff } = useStaffStore();
  const { patientList, getAllActivePatients } = usePatientStore();

  const [form, setForm] = useState<IAppointmentRequest>({
    patientId: "",
    doctorId: "",
    appointmentDateTime: "",
    invoiceType: "ONE_TIME", // default
    services: [],
    appointmentStatus: "OPEN", // default
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await create(form);

      setToasterData({
        message: res.message,
        severity: res.severity,
        open: true,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paginamtion = { page: 0, size: 100 };

  useEffect(() => {
    getAllActiveStaff(paginamtion);
    getAllActivePatients(paginamtion);
  }, []);

  return (
    <div>
      <h2>Add Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="patientId"
          placeholder="Patient ID"
          value={form.patientId}
          onChange={handleChange}
        />
        <input
          type="text"
          name="doctorId"
          placeholder="Doctor ID"
          value={form.doctorId}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="appointmentDateTime"
          value={form.appointmentDateTime}
          onChange={handleChange}
        />
        <select
          name="invoiceType"
          value={form.invoiceType}
          onChange={handleChange}
        >
          <option value="ONE_TIME">ONE_TIME</option>
          <option value="CONTINUOUS">CONTINUOUS</option>
        </select>
        <select
          name="appointmentStatus"
          value={form.appointmentStatus}
          onChange={handleChange}
        >
          <option value="PENDING">PENDING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AddAppointment;
