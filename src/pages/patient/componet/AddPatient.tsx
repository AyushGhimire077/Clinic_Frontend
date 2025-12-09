import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Users, Calendar, Home, Save } from "lucide-react";
import { BackButton } from "../../../component/global/back/back";
import { genderOptions } from "../../../component/global/interface";
import { useToast } from "../../../component/toaster/useToast";
import { usePatientStore } from "../helper/patient.store";
import type { IPatientRequest } from "../helper/patient.interface";

const AddPatient = () => {
  const { showToast } = useToast();
  const { createPatient } = usePatientStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<IPatientRequest>({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    gender: "MALE",
    dob: "",
    bloodGroup: "A+",
  });

  const [isLoading, setIsLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.contactNumber || !form.dob) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const res = await createPatient(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setTimeout(() => navigate("/patients"), 1500);
      }
    } catch (error) {
      showToast("Failed to create patient", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Register New Patient
          </h1>
          <p className="text-muted">
            Enter patient details to create a comprehensive medical record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Personal Information
              </h3>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter patient's full name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Contact Number *
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Medical Information
              </h3>

              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted" />
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="bloodGroup"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Blood Group *
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Residential Address *
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-3 w-5 h-5 text-muted" />
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter complete residential address"
                value={form.address}
                onChange={handleChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering Patient...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Register Patient
                </>
              )}
            </button>
            <p className="text-center text-sm text-muted mt-2">
              All information will be stored securely and confidentially
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
