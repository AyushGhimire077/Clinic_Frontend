import { useLocation, useNavigate } from "react-router-dom";
import type { IServices } from "../../services/helper/interface";
import Back from "../../../component/global/back/back";
import type { IAppointment } from "../helper/interface";

const AppointmentDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment } = location.state || {};


  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Back />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            No Appointment Data Found
          </h1>
          <p className="text-slate-600 mb-6">
            The appointment details could not be loaded. Please go back and try
            again.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-linear-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const {
    patient,
    doctor,
    services,
    id,
    invoiceType,
    dateTime,
    status,
  }: IAppointment = appointment;

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
      CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
      COMPLETED: "bg-green-50 text-green-700 border-green-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-slate-50 text-slate-700 border-slate-200"
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateTotal = () => {
    return services.reduce(
      (total: number, service: IServices) => total + (service.charge || 0),
      0
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-linear-to-b from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Appointment Details
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">
                    Appointment ID:
                  </span>
                  <span className="text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                    #{id}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    status
                  )}`}
                >
                  {status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  {invoiceType}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 min-w-[200px]">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {formatDate(dateTime)}
              </p>
              <p className="text-lg text-slate-600">{formatTime(dateTime)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Patient Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-teal-600"
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
            Patient Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-linear-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {patient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{patient.name}</p>
                <p className="text-sm text-slate-500">Patient</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Contact
                </label>
                <p className="text-sm text-slate-800">
                  {patient.contactNumber}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-sm text-slate-800">{patient.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Blood Group
                  </label>
                  <p className="text-sm font-semibold text-slate-800">
                    {patient.bloodGroup}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Gender
                  </label>
                  <p className="text-sm text-slate-800 capitalize">
                    {patient.gender?.toLowerCase() || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Date of Birth
                </label>
                <p className="text-sm text-slate-800">
                  {patient.dateOfBirth
                    ? new Date(patient.dateOfBirth).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Address
                </label>
                <p className="text-sm text-slate-800">
                  {patient.address || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    patient.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {patient.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
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
            Doctor Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-sm font-semibold text-white">Dr.</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  Dr. {doctor.name}
                </p>
                <p className="text-sm text-slate-500">
                  {doctor.type || "General Practitioner"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Contact
                </label>
                <p className="text-sm text-slate-800">{doctor.contactNumber}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Email
                </label>
                <p className="text-sm text-slate-800">{doctor.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Role
                  </label>
                  <p className="text-sm text-slate-800 capitalize">
                    {doctor.role?.toLowerCase()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Type
                  </label>
                  <p className="text-sm text-slate-800 capitalize">
                    {doctor.type?.toLowerCase() || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Salary
                </label>
                <p className="text-sm font-semibold text-slate-800">
                  {formatCurrency(doctor.salary || 0)}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    doctor.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {doctor.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Services & Billing */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
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
            Services & Billing
          </h2>

          <div className="space-y-4">
            {/* Services List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-700 mb-3">
                Selected Services
              </h3>
              {services.map((service: IServices) => (
                <div
                  key={service.id}
                  className="p-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-slate-800">
                      {service.name}
                    </span>
                    <span className="font-bold text-slate-800">
                      {formatCurrency(service.charge)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {service.type}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        service.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-50 text-slate-600"
                      }`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Billing Summary */}
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Subtotal
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">
                    Tax
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(0)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-lg font-bold text-slate-800">
                    Total
                  </span>
                  <span className="text-lg font-bold text-teal-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Type */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-slate-600 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Billing Type
                  </p>
                  <p className="text-sm text-slate-600 capitalize">
                    {invoiceType.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-8">
        <button className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-semibold">
          Print Details
        </button>
        <button 
        
         onClick={() => navigate(`/appointment/edit/${appointment.id}`, { state: { appointment } })}
        className="px-6 py-3 bg-linear-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md">
          Edit Appointment
        </button>
      </div>
    </div>
  );
};

export default AppointmentDetail;
