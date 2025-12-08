import { useEffect, useState } from "react";
import { useGlobalStore } from "../../../component/toaster/store";
import { useStaffStore } from "../../staff/componet/staff/helper/store";
import { useEpisodeStore } from "./helper/store";
import type { EpisodeRequest } from "./helper/interface";
import type { AlertColor } from "@mui/material";

const AddEpisode = () => {
  const { createEpisode } = useEpisodeStore();
  const { setToasterData } = useGlobalStore();
  const { getAllActiveStaff, staffList } = useStaffStore();

  const [form, setForm] = useState<EpisodeRequest>({
    title: "",
    startDate: "",
    endDate: "",
    type: "ONE_TIME", // "ONE_TIME" | "RECURRING"
    billingMode: "PER_VISIT", // or  "PACKAGE"
    status: "OPEN", // OPEN, COMPLETED, CANCELLED
    primaryDoctorId: "",
    packageCharge: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const inputClasses = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white ${
      hasError ? "border-red-300" : "border-slate-200"
    }`;

  const labelClasses = "block text-sm font-semibold text-slate-700 mb-2";

  // Load staff on mount
  useEffect(() => {
    getAllActiveStaff({ page: 0, size: 1000 });
  }, []);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (new Date(form.endDate) < new Date(form.startDate))
      newErrors.endDate = "End date cannot be before start date";
    if (!form.primaryDoctorId)
      newErrors.primaryDoctorId = "Primary doctor is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "packageCharge" ? Number(value) : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToasterData({
        message: "Please fix form errors",
        severity: "warning",
        open: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createEpisode(form);
      setToasterData({
        message: res.message,
        severity: res.severity.toLowerCase() as AlertColor,
        open: true,
      });
      if (res.severity.toUpperCase() === "SUCCESS") {
        // reset form
        setForm({
          title: "",
          startDate: "",
          endDate: "",
          type: "ONE_TIME",
          billingMode: "PER_VISIT",
          status: "OPEN",
          primaryDoctorId: "",
          packageCharge: 0,
        });
        setErrors({});
      }
    } catch {
      setToasterData({
        message: "Failed to create episode",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Add New Episode</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClasses}>
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className={inputClasses(!!errors.title)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className={labelClasses}>
              Start Date *
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className={inputClasses(!!errors.startDate)}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className={labelClasses}>
              End Date *
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              className={inputClasses(!!errors.endDate)}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="type" className={labelClasses}>
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClasses(!!errors.type)}
          >
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
          </select>
        </div>

        <div>
          <label htmlFor="billingMode" className={labelClasses}>
            Billing Mode *
          </label>
          <select
            id="billingMode"
            name="billingMode"
            value={form.billingMode}
            onChange={handleChange}
            className={inputClasses(!!errors.billingMode)}
          >
            <option value="ONE_TIME">One-time</option>
            <option value="CONTINUOUS">Continuous</option>
          </select>
        </div>

        <div>
          <label htmlFor="primaryDoctorId" className={labelClasses}>
            Primary Doctor *
          </label>
          <select
            id="primaryDoctorId"
            name="primaryDoctorId"
            value={form.primaryDoctorId}
            onChange={handleChange}
            className={inputClasses(!!errors.primaryDoctorId)}
          >
            <option value="">Select Doctor</option>
            {staffList
              .filter((d) => d.type === "DOCTOR")
              .map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name} - {d.doctorSubType || "General"}
                </option>
              ))}
          </select>
          {errors.primaryDoctorId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.primaryDoctorId}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="packageCharge" className={labelClasses}>
            Package Charge *
          </label>
          <input
            id="packageCharge"
            name="packageCharge"
            type="number"
            value={form.packageCharge}
            onChange={handleChange}
            className={inputClasses(!!errors.packageCharge)}
          />
          {errors.packageCharge && (
            <p className="text-red-500 text-sm mt-1">{errors.packageCharge}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Episode"}
        </button>
      </form>
    </div>
  );
};

export default AddEpisode;
