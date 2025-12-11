import { Calendar, Home, Save, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BackButton } from "../../../component/global/components/back/back";
import { inputField } from "../../../component/global/components/customStyle";
import { genderOptions } from "../../../component/global/utils/global.interface";
import { useToast } from "../../../component/toaster/useToast";
import type { IPatient, IPatientRequest } from "../helper/patient.interface";
import { usePatientStore } from "../helper/patient.store";

const AddPatient = () => {
  const { showToast } = useToast();
  const { createPatient, editPatient } = usePatientStore();
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();
  const editPatientData = location.state?.patient as IPatient | undefined;

  const [form, setForm] = useState<IPatientRequest>({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    gender: "MALE",
    dob: "",
    bloodGroup: "A+",
    oneTimeFlag: false,
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

    if (!form.name || !form.contactNumber || !form.dob) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setIsLoading(true);

    try {
      const res = isEditing
        ? await editPatient(editPatientData!.id, form)
        : await createPatient(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setForm({
          name: "",
          email: "",
          contactNumber: "",
          address: "",
          gender: "MALE",
          dob: "",
          bloodGroup: "A+",
          oneTimeFlag: false,
        });

        window.history.back();
      }
    } catch (error) {
      showToast("Failed to create patient", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (editPatientData) {
      setForm({
        name: editPatientData.name,
        email: editPatientData.email,
        contactNumber: editPatientData.contactNumber.toString(),
        address: editPatientData.address,
        gender: editPatientData.gender,
        dob: editPatientData.dateOfBirth,
        bloodGroup: editPatientData.bloodGroup,
        oneTimeFlag: editPatientData.oneTimeFlag || false,
      });
      setIsEditing(true);
    }
  }, [editPatientData]);

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
            {isEditing
              ? `Edit ${editPatientData?.name}`
              : "Register New Patient"}
          </h1>
          <p className="text-muted">
            {isEditing
              ? "Update patient details below"
              : "Fill in the details to register a new patient"}
          </p>
        </div>

        <hr className="border-border mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <hr className="border-border mb-6" />

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
                  className={inputField}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="patient@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={inputField}
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
                  placeholder="+977 1234567890"
                  value={form.contactNumber}
                  onChange={handleChange}
                  className={inputField}
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

              <hr className="border-border mb-6" />

              <div>
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Date of Birth *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-4 w-5 h-5 text-muted" />
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className={`${inputField} pl-10`}
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
                  className={inputField}
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
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={inputField}
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
              <Home className="absolute left-3 top-4 w-5 h-5 text-muted" />
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter complete residential address"
                value={form.address}
                onChange={handleChange}
                className={`${inputField} pl-10`}
                required
              />
            </div>
          </div>

          {/* one time flag */}
          <div className="flex items-center justify-end py-t gap-3">
            <input
              id="oneTimeFlag"
              name="oneTimeFlag"
              type="checkbox"
              checked={form.oneTimeFlag}
              onChange={(e) => {
                setForm({
                  ...form,
                  oneTimeFlag: e.target.checked,
                });
              }}
              className="w-5 h-5"
            />
            <label
              htmlFor="oneTimeFlag"
              className="text-sm font-medium text-foreground"
            >
              One Time Patient
            </label>
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
                  {isEditing ? "Updating Patient..." : "Registering Patient..."}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? "Update Patient" : "Register Patient"}
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
