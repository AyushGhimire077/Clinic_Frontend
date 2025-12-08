import { useState } from "react";
import { useEpisodeStore } from "./helper/store";
import { useGlobalStore } from "../../../component/toaster/store";
import type { EpisodeTempReq } from "./helper/interface";
import Back from "../../../component/global/back/back";
import { FaClipboardCheck, FaMoneyBillWave, FaTag, FaSpinner } from "react-icons/fa";
import { FiType } from "react-icons/fi";

const AddEpisodeTemp = () => {
  const { createEpisodeTemplate } = useEpisodeStore();
  const { setToasterData } = useGlobalStore();

  const [form, setForm] = useState<EpisodeTempReq>({
    title: "",
    type: "ONE_TIME",
    billingMode: "PER_VISIT",
    packageCharge: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "packageCharge" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.type) newErrors.type = "Type is required";
    if (!form.billingMode) newErrors.billingMode = "Billing mode is required";
    if (form.packageCharge < 0)
      newErrors.packageCharge = "Charge cannot be negative";
    if (form.billingMode === "PACKAGE" && form.packageCharge <= 0)
      newErrors.packageCharge = "Package charge must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await createEpisodeTemplate(form);

      setToasterData({
        message: res.message || "Template created successfully",
        severity: "success",
        open: true,
      });

      // Reset form
      setForm({
        title: "",
        type: "ONE_TIME",
        billingMode: "PER_VISIT",
        packageCharge: 0,
      });
      setErrors({});
    } catch (err) {
      setToasterData({
        message: err instanceof Error ? err.message : "Failed to create template",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Back />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50">
                <FaClipboardCheck className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Episode Template
                </h1>
                <p className="text-gray-600 mt-1">
                  Create a reusable template for treatment episodes
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaTag className="text-gray-500" />
                Template Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Physical Therapy Session"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title
                    ? "border-red-300 bg-red-50 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                } focus:ring-2 focus:outline-none transition-all`}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  ⚠️ {errors.title}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Give your template a descriptive name
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiType className="text-gray-500" />
                  Episode Type
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.type
                      ? "border-red-300 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } focus:ring-2 focus:outline-none transition-all`}
                >
                  <option value="ONE_TIME">One-time Treatment</option>
                  <option value="PACKAGE">Package Treatment</option>
                </select>
                {errors.type && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    ⚠️ {errors.type}
                  </p>
                )}
              </div>

              {/* Billing Mode */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaMoneyBillWave className="text-gray-500" />
                  Billing Mode
                </label>
                <select
                  name="billingMode"
                  value={form.billingMode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.billingMode
                      ? "border-red-300 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } focus:ring-2 focus:outline-none transition-all`}
                >
                  <option value="PER_VISIT">Per Visit Billing</option>
                  <option value="PACKAGE">Package Billing</option>
                </select>
                {errors.billingMode && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    ⚠️ {errors.billingMode}
                  </p>
                )}
              </div>
            </div>

            {/* Package Charge */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="text-gray-500">₹</span>
                Package Charge
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  NPR
                </span>
                <input
                  type="number"
                  name="packageCharge"
                  value={form.packageCharge}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`w-full pl-16 pr-4 py-3 rounded-lg border ${
                    errors.packageCharge
                      ? "border-red-300 bg-red-50 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } focus:ring-2 focus:outline-none transition-all`}
                />
              </div>
              {errors.packageCharge && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  ⚠️ {errors.packageCharge}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                {form.billingMode === "PACKAGE"
                  ? "Total charge for the complete package"
                  : "Optional: Set default charge for per-visit billing"}
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: loading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Creating Template...
                  </>
                ) : (
                  <>
                    <FaClipboardCheck />
                    Create Template
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                This template will be available for creating new episodes
              </p>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            About Episode Templates
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">•</span>
              <span><strong>One-time:</strong> Single treatment session</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span><strong>Package:</strong> Multiple sessions bundled together</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-0.5">•</span>
              <span><strong>Per Visit:</strong> Charge each appointment separately</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEpisodeTemp;