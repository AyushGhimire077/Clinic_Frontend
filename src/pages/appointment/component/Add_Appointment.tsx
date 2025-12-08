import type { AlertColor } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Back from "../../../component/global/back/back";
import { useGlobalStore } from "../../../component/toaster/toast.store";
import type { IPatient } from "../../patient/componet/helper/interface";
import type { IStaff } from "../../staff/componet/staff/helper/interface";
import { useStaffStore } from "../../staff/componet/staff/helper/store";
import type { IAppointment, IAppointmentRequest } from "../helper/interface";
import { useAppointmentStore } from "../helper/store";
import { appointmentStatusOptions } from "../../../component/global/interface";
import { useEpisodeStore } from "../../episode/component/helper/store";

const AddAppointment = () => {
  const { create, update } = useAppointmentStore();
  const { getAllEpisodes, episodeList} = useEpisodeStore();
  const { setToasterData } = useGlobalStore();
  const { staffList, getAllActiveStaff } = useStaffStore();
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const editData: IAppointment | undefined = location.state?.appointment;
  const patient = location.state?.patient as IPatient | undefined;

  const [form, setForm] = useState<IAppointmentRequest>({
    episodeId: "",
    doctorId: "",
    scheduledDateTime: "",
    status: "BOOKED", //     BOOKED, CHECKED_IN, MISSED, CANCELLED
  });

  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<IStaff | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = {
    primary: "#0d9488",
    primaryDark: "#0f766e",
    secondary: "#0369a1",
    secondaryDark: "#075985",
    success: "#10b981",
    successDark: "#059669",
    warning: "#f59e0b",
    danger: "#ef4444",
    slate: "#64748b",
    slateLight: "#f8fafc",
    slateLighter: "#f1f5f9",
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.episodeId) {
      newErrors.episodeId = "Episode is required";
    }

    if (!form.doctorId) {
      newErrors.doctorId = "Doctor is required";
    }

    if (!form.scheduledDateTime) {
      newErrors.scheduledDateTime = "Date and time is required";
    } else if (new Date(form.scheduledDateTime) < new Date()) {
      newErrors.scheduledDateTime = "Appointment date cannot be in the past";
    }

    if (selectedDoctor && !selectedDoctor.type) {
      newErrors.doctorSpecialization = "Doctor specialization is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "doctorId") {
      const doctor = doctors.find((d) => d.id === value);
      setSelectedDoctor(doctor || null);

      // Clear doctor specialization error when doctor is changed
      if (errors.doctorSpecialization) {
        setErrors((prev) => ({ ...prev, doctorSpecialization: "" }));
      }
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const nowLocal = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToasterData({
        message: "Please fix the form errors before submitting",
        severity: "warning",
        open: true,
      });
      return;
    }

    setLoading(true);

    try {
      const payload: IAppointmentRequest = {
        ...form,
      };

      let res;

      if (id && editData) {
        res = await update(id, payload);
      } else {
        res = await create(payload);
      }

      setToasterData({
        message: res.message,
        severity: res.severity.toLowerCase() as AlertColor,
        open: true,
      });

      if (res.severity === "success") {
        if (!id) {
          // Reset form only for new appointments
          setForm({
            episodeId: "",
            doctorId: "",
            scheduledDateTime: "",
            status: "BOOKED",
          });
          setSelectedDoctor(null);
          setErrors({});
        }
        // Navigate back to appointments list after a delay
        setTimeout(() => navigate("/appointments/view-appointment"), 1500);
      }
    } catch (err) {
      setToasterData({
        message: "Failed to save appointment. Please try again.",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const pagination = { page: 0, size: 1000 };

  // Load related data
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([getAllActiveStaff(pagination)]);
      } catch (error) {
        console.error("Error loading data:", error);
        setToasterData({
          message: "Failed to load required data",
          severity: "error",
          open: true,
        });
      }
    };

    loadData();
  }, [getAllActiveStaff, setToasterData]);

  // Prefill patient if coming from patient details
  useEffect(() => {
    if (patient) {
      setForm((prev) => ({ ...prev, patientId: patient.id }));
    }
  }, [patient]);

  // Prefill edit mode
  useEffect(() => {
    if (!editData) return;

    const doctor = staffList.find((d) => d.id === editData.doctor.id);
    setSelectedDoctor(doctor || null);

    setForm({
      episodeId: editData.episode.id,
      doctorId: editData.doctor.id,
      scheduledDateTime: editData.scheduledDateTime,
      status: editData.status,
    });
  }, [editData, staffList]);

  // Update selected doctor when doctorId changes or staffList loads
  useEffect(() => {
    if (form.doctorId && staffList.length > 0) {
      const doctor = staffList.find((d) => d.id === form.doctorId);
      setSelectedDoctor(doctor || null);
    }
  }, [form.doctorId, staffList]);

  console.log(selectedDoctor);

  const inputClasses = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white ${
      hasError ? "border-red-300" : "border-slate-200"
    }`;

  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  const doctors = staffList.filter(
    (staff) => staff.role === "DOCTOR" || staff.type === "DOCTOR"
  );

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: "bg-blue-50 text-blue-700 border-blue-200",
      PAID: "bg-green-50 text-green-700 border-green-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      COMPLETED: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-slate-50 text-slate-700 border-slate-200"
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      <div
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
        style={{ backgroundColor: colors.slateLight }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ backgroundColor: colors.primary }}
          >
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  id
                    ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    : "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                }
              />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-4 mb-3">
            <h1 className="text-3xl font-bold text-slate-800">
              {id ? "Edit Appointment" : "Schedule New Appointment"}
            </h1>
            {editData && (
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  form.status
                )}`}
              >
                {form.status}
              </span>
            )}
          </div>

          {id && (
            <div className="mt-2 text-sm text-slate-500">
              Appointment ID:{" "}
              <span className="font-mono font-semibold">#{id}</span>
            </div>
          )}
          {patient && !id && (
            <div className="mt-2 text-sm text-green-600 font-medium">
              Pre-selected patient: {patient.name}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient & Doctor Information */}
            <div
              className="rounded-2xl p-6 border border-slate-100"
              style={{ backgroundColor: colors.slateLighter }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Patient & Doctor
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="doctorId" className={labelClasses}>
                    Assign Doctor *
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    required
                    className={inputClasses(!!errors.doctorId)}
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.type || "General Physician"}
                      </option>
                    ))}
                  </select>
                  {errors.doctorId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.doctorId}
                    </p>
                  )}
                </div>

                {/* Doctor Specialization - Only show when doctor is selected */}
                {selectedDoctor && (
                  <div className="space-y-4">
                    <div
                      className="p-4 rounded-xl border border-green-200"
                      style={{ backgroundColor: "#f0fdf4" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: colors.success }}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            Dr. {selectedDoctor.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Selected Doctor
                          </p>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="doctorSpecialization"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Doctor Specialization *
                        </label>
                        <input
                          id="doctorSpecialization"
                          name="doctorSpecialization"
                          type="text"
                          value={selectedDoctor.doctorSubType || ""}
                          readOnly
                          className={inputClasses(
                            !!errors.doctorSpecialization
                          )}
                        />
                        {errors.doctorSpecialization && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.doctorSpecialization}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          Specification based on selected doctor profile.
                        </p>
                      </div>
                    </div>

                    {/* Doctor Contact Info */}
                    <div className="p-3 rounded-xl border border-slate-200 bg-white">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-slate-500">Contact:</span>
                          <p className="font-medium text-slate-800">
                            {selectedDoctor.contactNumber || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Email:</span>
                          <p className="font-medium text-slate-800">
                            {selectedDoctor.email || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Details */}
            <div
              className="rounded-2xl p-6 border border-slate-100"
              style={{ backgroundColor: colors.slateLighter }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Appointment Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="dateTime" className={labelClasses}>
                    Date & Time *
                  </label>
                  <input
                    id="dateTime"
                    name="scheduledDateTime"
                    type="datetime-local"
                    value={form.scheduledDateTime ?? nowLocal}
                    onChange={handleChange}
                    required
                    className={inputClasses(!!errors.scheduledDateTime)}
                  />
                  {errors.dateTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateTime}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className={labelClasses}>
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={inputClasses(false)}
                    >
                      {appointmentStatusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className={labelClasses}>
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputClasses(false)}
                  >
                    {appointmentStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                loading || (selectedDoctor && !selectedDoctor.type) || false
              }
              className="w-full py-4 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              style={{
                backgroundColor:
                  loading || (selectedDoctor && !selectedDoctor.type)
                    ? colors.slate
                    : colors.primary,
              }}
              onMouseOver={(e) => {
                if (!loading && !(selectedDoctor && !selectedDoctor.type)) {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                }
              }}
              onMouseOut={(e) => {
                if (!loading && !(selectedDoctor && !selectedDoctor.type)) {
                  e.currentTarget.style.backgroundColor = colors.primary;
                }
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {id ? "Updating Appointment..." : "Scheduling Appointment..."}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={id ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                    />
                  </svg>
                  {id ? "Update Appointment" : "Schedule Appointment"}
                </>
              )}
            </button>

            {selectedDoctor && !selectedDoctor.type && (
              <p className="text-center text-sm text-amber-600 mt-3">
                Please select a medical specialization for the doctor
              </p>
            )}

            <p className="text-center text-sm text-slate-500 mt-3">
              {id
                ? "Appointment details will be updated immediately"
                : "Appointment confirmation will be sent to the patient"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
