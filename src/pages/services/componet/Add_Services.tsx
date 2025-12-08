import React, { useState } from "react";
import { userServiceStore } from "../helper/store";
import type { IServicesRequest } from "../helper/interface";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "../../../component/toaster/toast.store";
import Back from "../../../component/global/back/back";
import { doctorTypeOptions } from "../../../component/global/interface";

const AddServices = () => {
  const { createServices } = userServiceStore();
  const navigate = useNavigate();
  const { setToasterData } = useGlobalStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<IServicesRequest>({
    name: "",
    description: "",
    charge: 0.00,
    type: "", // default enum
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "charge") {
      setForm((prev) => ({ ...prev, charge: parseFloat(value) || 0 }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createServices(form);

      setToasterData({
        severity: res.severity,
        message: res.message,
        open: true,
      });

      if (res.severity === "success") {
        setTimeout(() => navigate("/services"), 1500);
      }
    } catch (error) {
      setToasterData({
        severity: "error",
        message: "Failed to create service. Please try again.",
        open: true,
      });
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
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                d="M12 6v12m6-6H6"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Add Service</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className={labelClasses}>Service Name</label>
            <input
              name="name"
              className={inputClasses}
              onChange={handleChange}
              value={form.name}
              placeholder="Enter service name"
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              name="description"
              className={inputClasses}
              onChange={handleChange}
              value={form.description}
              placeholder="Service description"
            />
          </div>

          {/* Charge */}
          <div>
            <label className={labelClasses}>Charge</label>
            <input
              name="charge"
              type="number"
              className={inputClasses}
              onChange={handleChange}
              value={form.charge}
              placeholder="0"
            />
          </div>

          {/* Staff Type (ENUM) */}
          <div>
            <label className={labelClasses}>Staff Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="">Select type</option>

              {doctorTypeOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
          >
            {loading ? "Saving..." : "Save Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddServices;
