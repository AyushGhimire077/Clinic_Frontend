import type { AlertColor } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Back from "../../../component/global/back/back";
import { useGlobalStore } from "../../../component/toaster/store";
import type { IPatient } from "../../patient/componet/helper/interface";
import { usePatientStore } from "../../patient/componet/helper/store";
import { userServiceStore } from "../../services/helper/store";
import type { IStaff } from "../../staff/componet/staff/helper/interface";
import { useStaffStore } from "../../staff/componet/staff/helper/store";
import type { IAppointment, IAppointmentRequest } from "../helper/interface";
import { useAppointmentStore } from "../helper/store";

const AddAppointment = () => {
  const { create, update } = useAppointmentStore();
  const { setToasterData } = useGlobalStore();
  const { staffList, getAllActiveStaff } = useStaffStore();
  const { patientList, getAllActivePatients } = usePatientStore();
  const { servicesList, getAllActiveServices } = userServiceStore();
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const editData: IAppointment | undefined = location.state?.appointment;
  const patient = location.state?.patient as IPatient | undefined;

  const [form, setForm] = useState<IAppointmentRequest>({
    patientId: "",
    doctorId: "",
    dateTime: "",
    invoiceType: "ONE_TIME", // CONTINUOUS
    servicesId: [],
    status: "OPEN", // PAID, CANCELLED, PENDING, COMPLETED
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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

    if (!form.patientId) {
      newErrors.patientId = "Patient is required";
    }

    if (!form.doctorId) {
      newErrors.doctorId = "Doctor is required";
    }

    if (!form.dateTime) {
      newErrors.dateTime = "Date and time is required";
    } else if (new Date(form.dateTime) < new Date()) {
      newErrors.dateTime = "Appointment date cannot be in the past";
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

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

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
        servicesId: selectedServices,
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
            patientId: "",
            doctorId: "",
            dateTime: "",
            invoiceType: "ONE_TIME",
            servicesId: [],
            status: "OPEN",
          });
          setSelectedServices([]);
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
        await Promise.all([
          getAllActiveStaff(pagination),
          getAllActivePatients(pagination),
          getAllActiveServices(pagination),
        ]);
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
  }, [
    getAllActiveStaff,
    getAllActivePatients,
    getAllActiveServices,
    setToasterData,
  ]);

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
      patientId: editData.patient.id,
      doctorId: editData.doctor.id,
      dateTime: editData.dateTime
        ? new Date(editData.dateTime).toISOString().slice(0, 16)
        : editData.dateTime || "",
      invoiceType: editData.invoiceType,
      status: editData.status || "OPEN",
      servicesId: [],
    });

    const ids = editData.servicesId.map((s: any) => s.id);
    setSelectedServices(ids);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NRS",
    }).format(amount);
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = servicesList.find((s) => s.id === serviceId);
      return total + (service?.charge || 0);
    }, 0);
  };

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
          <p className="text-slate-600 text-lg">
            {id
              ? `Update appointment details for ${
                  editData?.patient?.name || "patient"
                }`
              : "Book a new appointment for patient consultation and treatment"}
          </p>
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
                  <label htmlFor="patientId" className={labelClasses}>
                    Select Patient *
                  </label>
                  <select
                    id="patientId"
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    required
                    className={inputClasses(!!errors.patientId)}
                    disabled={!!patient && !id} // Disable if pre-selected from patient details
                  >
                    <option value="">Choose a patient</option>
                    {patientList.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.contactNumber}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patientId}
                    </p>
                  )}
                  {patient && !id && (
                    <p className="text-xs text-slate-500 mt-1">
                      Patient pre-selected from patient details
                    </p>
                  )}
                </div>

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
                    name="dateTime"
                    type="datetime-local"
                    value={form.dateTime ?? nowLocal}
                    onChange={handleChange}
                    required
                    className={inputClasses(!!errors.dateTime)}
                  />
                  {errors.dateTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateTime}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="invoiceType" className={labelClasses}>
                      Billing Type
                    </label>
                    <select
                      id="invoiceType"
                      name="invoiceType"
                      value={form.invoiceType}
                      onChange={handleChange}
                      className={inputClasses(false)}
                    >
                      <option value="ONE_TIME">One Time</option>
                      <option value="CONTINUOUS">Continuous</option>
                    </select>
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
                      <option value="OPEN">Open</option>
                      <option value="PAID">Paid</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="PENDING">Pending</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Services Selection */}
          <div
            className="rounded-2xl p-6 border border-slate-100"
            style={{ backgroundColor: "#f7fee7" }} // Light green background
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.success }}
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
                    d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                  />
                </svg>
              </div>
              Select Services
            </h3>

            {servicesList.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>No services available. Please add services first.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesList.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedServices.includes(service.id)
                          ? "border-teal-500 shadow-sm bg-teal-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceToggle(service.id)}
                        className="mt-1 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-slate-800">
                            {service.name}
                          </span>
                          <span className="font-bold text-slate-800">
                            {formatCurrency(service.charge)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {service.description}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                          {service.type}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Total Calculation */}
                {selectedServices.length > 0 && (
                  <div className="mt-6 p-4 rounded-xl border border-teal-200 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">
                        Total Charge:
                      </span>
                      <span className="text-2xl font-bold text-teal-600">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedServices.length} service(s) selected
                    </p>
                  </div>
                )}
              </>
            )}
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
