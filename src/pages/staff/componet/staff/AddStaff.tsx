import { Briefcase, Plus, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "../../../../component/global/components/back/back";
import { inputField } from "../../../../component/global/components/customStyle";

import { doctorTypeOptions, staffTypeOptions } from "../../../../component/constant/select";
import { useToast } from "../../../../component/toaster/useToast";
import { useRoleStore } from "../../role.helper/role.store";
import type { IStaff, IStaffRequest } from "../../staff.helper/staff.interface";
import { useStaffStore } from "../../staff.helper/staff.store";

const AddStaff = () => {
  const { showToast } = useToast();
  const { create, isLoading, update, fetchById } = useStaffStore();
  const { fetchActive, list: roles } = useRoleStore();


  // read parms
  const searchParams = new URLSearchParams(window.location.search);
  const staffId = searchParams.get("id");

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
    e: any
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "contactNumber"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (form.type === "DOCTOR" && !form.doctorSubType) {
      showToast(
        "Please select a medical specialization for the doctor",
        "warning"
      );
      return;
    }


    try {
      if (staffId) {
        await update(staffId, form);
        window.history.back();
        return;
      }
      await create(form);
      window.history.back();

    } catch (error) {
      console.log("Unable to create staff", error)
    }
  };

  const isDoctor = form.type === "DOCTOR";


  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  useEffect(() => {
    if (staffId) {
      setForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        password: "",
        contactNumber: 0,
        salary: 0,
        roleId: "",
        type: "NURSE",
        doctorSubType: null,
      }));
      fetchById(staffId).then((res) => {
        const staffData = res as IStaff;
        setForm({
          name: staffData.name,
          email: staffData.email,
          password: "",
          contactNumber: staffData.contactNumber,
          salary: staffData.salary,
          type: staffData.type,
          roleId: roles.find((role) => role.role === staffData.role)?.id || "",
          doctorSubType: staffData.doctorSubType,
        });
      });
    }
  }, [staffId]);


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {staffId ? "Edit Staff Member" : "Add New Staff Member"}
          </h1>
          <p className="text-muted">{staffId ? "Edit an existing staff member" : "Add a new staff member to your organization"}</p>
        </div>

        <hr className="border-border mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={inputField}
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
                  placeholder="staff@clinic.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputField}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
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
                  placeholder="+977 9*********"
                  value={form.contactNumber || ""}
                  onChange={handleChange}
                  required
                  className={inputField}
                />
              </div>
            </div>

            {/* Employment Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Employment Details
              </h3>
              <hr className="border-border mb-6" />

              <div>
                <label
                  htmlFor="roleId"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Staff Role *
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={form.roleId}
                  onChange={handleChange}
                  className={inputField}
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
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Staff Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={inputField}
                  required
                >
                  {staffTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {isDoctor && (
                <div>
                  <label
                    htmlFor="doctorSubType"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Medical Specialization *
                  </label>
                  <select
                    id="doctorSubType"
                    name="doctorSubType"
                    value={form.doctorSubType ?? ""}
                    onChange={handleChange}
                    className={inputField}
                    required
                  >
                    <option value="">Select specialization</option>
                    {doctorTypeOptions.map((specialization) => (
                      <option
                        key={specialization.value}
                        value={specialization.value}
                      >
                        {specialization.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Monthly Salary *
                </label>
                <div className="relative">
                  <input
                    id="salary"
                    name="salary"
                    type="tel"
                    placeholder="0.00"
                    value={form.salary || ""}
                    onChange={handleChange}
                    required
                    className={`${inputField} pl-10`}
                  />
                  <span className="absolute left-3 top-3 text-md text-muted">
                    Rs.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isLoading || (isDoctor && !form.doctorSubType)}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {staffId ? "Updating..." : " Adding Staff Member..."}
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {staffId ? "Update Staff Member" : "Add Staff Member"}
                </>
              )}
            </button>

            {isDoctor && !form.doctorSubType && (
              <p className="text-center text-sm text-warning mt-2">
                Please select a medical specialization
              </p>
            )}

            <p className="text-center text-sm text-muted mt-2">
              Staff member will receive login credentials via email
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
