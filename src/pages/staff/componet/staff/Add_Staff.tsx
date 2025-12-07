import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Back from "../../../../component/global/back/back";
import { useGlobalStore } from "../../../../component/toaster/store";
import { useRoleStore } from "../staff_roles/helper/store";
import { useStaffStore } from "./helper/store";
import type { IStaffRequest } from "./helper/interface";
import {
  doctorTypeOptions,
  staffTypeOptions,
} from "../../../../component/global/interface";

const AddStaff = () => {
  const { createStaff } = useStaffStore();
  const { roles, get_all_roles } = useRoleStore();
  const { setToasterData } = useGlobalStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<IStaffRequest>({
    name: "",
    email: "",
    password: "",
    contactNumber: 0,
    salary: 0,
    roleId: "",
    type: "NURSE",
    doctorSubType: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]:
        name === "salary" || name === "contactNumber" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createStaff(form);
      setToasterData({
        message: res.message,
        severity: res.severity || "info",
        open: true,
      });

      if (res.severity === "success") {
        setTimeout(() => navigate("/staff/table"), 1500);
      }
    } catch (error) {
      setToasterData({
        message: "Failed to create staff member. Please try again.",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_all_roles();
  }, []);

  const inputClasses =
    "w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  const isDoctor = form.type === "DOCTOR";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      <div
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)",
            }}
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Add New Staff Member
          </h1>
          <p className="text-slate-600 text-lg">
            Register a new healthcare professional to your medical team
          </p>
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/staff/table")}
            className="w-full px-6 py-4 text-white rounded-xl transition-all duration-300 font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-3 group"
            style={{
              background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #374151 0%, #1f2937 100%)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background =
                "linear-gradient(135deg, #475569 0%, #334155 100%)";
            }}
          >
            <svg
              className="w-5 h-5 transform group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View All Staff Members
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div
              className="rounded-2xl p-6 border border-slate-100"
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)",
              }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)",
                  }}
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
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter staff member's full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="staff@clinic.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClasses}>
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" className={labelClasses}>
                    Contact Number *
                  </label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    placeholder="+977 9000000000"
                    value={form.contactNumber || ""}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div
              className="rounded-2xl p-6 border border-slate-100"
              style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)",
              }}
            >
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #0369a1 0%, #7c3aed 100%)",
                  }}
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Employment Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className={labelClasses}>
                    Staff Role *
                  </label>
                  <select
                    id="role"
                    name="roleId"
                    value={form.roleId}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="type" className={labelClasses}>
                    Staff Type *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    {staffTypeOptions.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor Specialization - Only show when staff type is DOCTOR */}
                {isDoctor && (
                  <div>
                    <label htmlFor="doctorSubType" className={labelClasses}>
                      Medical Specialization *
                    </label>
                    <select
                      id="doctorSubType"
                      name="doctorSubType"
                      value={form.doctorSubType ?? ""}
                      onChange={handleChange}
                      className={inputClasses}
                      required={isDoctor}
                    >
                      <option value="">Select specialization</option>
                      {doctorTypeOptions.map((specialization) => (
                        <option
                          key={specialization.label}
                          value={specialization.value}
                        >
                          {specialization.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-2">
                      Required for medical doctors to specify their area of
                      expertise
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="salary" className={labelClasses}>
                    MOnthly Salary *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500">
                      Rs.
                    </span>
                    <input
                      id="salary"
                      name="salary"
                      type="tel"
                      placeholder="0.00"
                      value={form.salary || ""}
                      onChange={handleChange}
                      required
                      className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                    <div className="absolute right-3 top-3">
                      <span className="text-sm font-medium text-slate-600">
                        {form.salary ? formatCurrency(form.salary) : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Staff Type Info Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Staff Type Information
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        {isDoctor
                          ? "Doctors require medical specialization to be specified"
                          : "Select the appropriate staff type for role assignment"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || (isDoctor && !form.doctorSubType)}
              className="w-full py-4 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)",
              }}
              onMouseOver={(e) => {
                if (!loading && !(isDoctor && !form.doctorSubType)) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #0f766e 0%, #075985 100%)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && !(isDoctor && !form.doctorSubType)) {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)";
                }
              }}
            >
              <div className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding Staff Member...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 transform group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Staff Member
                  </>
                )}
              </div>
            </button>

            {isDoctor && !form.doctorSubType && (
              <p className="text-center text-sm text-amber-600 mt-3">
                Please select a medical specialization for the doctor
              </p>
            )}

            <p className="text-center text-sm text-slate-500 mt-3">
              Staff member will receive login credentials via email
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
