import { useState } from "react";
import type { IPatientRequest } from "./helper/interface";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../component/toaster/store";
import Back from "../../../component/global/back/back";
import { usePatientStore } from "./helper/store";

const AddPatient = () => {
  const { createPatient } = usePatientStore();
  const navigate = useNavigate();
  const { setToasterData } = useGlobalStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<IPatientRequest>({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    gender: "MALE",
    dob: "",
    bloodGroup: "A+",
  });

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
      const res = await createPatient(form);
      setToasterData({
        severity: res.severity,
        message: res.message,
        open: true,
      });

      if (res.severity === "success") {
        setTimeout(() => navigate("/patients"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            Register New Patient
          </h1>
          <p className="text-slate-600 text-lg">
            Enter patient details to create a comprehensive medical record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information Card */}
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-teal-600"
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
                    placeholder="Enter patient's full name"
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
                    placeholder="patient@example.com"
                    value={form.email}
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
                    placeholder="+1 (555) 000-0000"
                    value={form.contactNumber}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="dob" className={labelClasses}>
                    Date of Birth *
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information Card */}
            <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                Medical Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="gender" className={labelClasses}>
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bloodGroup" className={labelClasses}>
                    Blood Group *
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className={inputClasses}
                    required
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="address" className={labelClasses}>
                    Residential Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter complete residential address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-linear-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Registering Patient...
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
                  Register Patient  
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-500 mt-3">
              All information will be stored securely and confidentially
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
