import { CreditCard, FileText, Package, Save } from "lucide-react";
import { useState } from "react";
import { BackButton } from "../../../component/global/back/back";
import {
  billingModeOptions,
  episodeTypeOptions,
} from "../../../component/global/interface";
import { useToast } from "../../../component/toaster/useToast";
import type { EpisodeTempReq } from "../helper/episode.interface";
import { useEpisodeStore } from "../helper/episode.store";
import { inputField } from "../../../component/global/customStyle";

const AddEpisodeTemplate = () => {
  const { showToast } = useToast();
  const { createEpisodeTemplate } = useEpisodeStore();

  const [form, setForm] = useState<EpisodeTempReq>({
    title: "",
    type: "ONE_TIME" as const,
    billingMode: "PER_VISIT" as const,
    packageCharge: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "packageCharge" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      showToast("Template title is required", "warning");
      return;
    }

    if (form.billingMode === "PACKAGE" && form.packageCharge <= 0) {
      showToast("Package charge must be greater than 0", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await createEpisodeTemplate(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setForm({
          title: "",
          type: "ONE_TIME",
          billingMode: "PER_VISIT",
          packageCharge: 0,
        });
      }
    } catch (error) {
      showToast("Failed to create template", "error");
    } finally {
      setLoading(false);
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Episode Template
          </h1>
          <p className="text-muted">
            Save time by creating reusable episode templates
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Template Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Standard Physical Therapy Package"
              className={inputField}
              required
            />
          </div>

          {/* Type and Billing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Episode Type *
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={inputField + " pl-10"}
                  required
                >
                  {episodeTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="billingMode"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Billing Mode *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <select
                  id="billingMode"
                  name="billingMode"
                  value={form.billingMode}
                  onChange={handleChange}
                  className={inputField + " pl-10"}
                  required
                >
                  {billingModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Package Charge */}
          <div>
            <label
              htmlFor="packageCharge"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Package Charge *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3  text-muted">Rs.</span>
              <input
                id="packageCharge"
                name="packageCharge"
                type="tel"
                min="0"
                step="0.01"
                value={form.packageCharge}
                onChange={handleChange}
                placeholder="0.00"
                className={inputField + " pl-10"}
                required
              />
            </div>
            <p className="text-sm text-muted mt-2">
              {form.billingMode === "PACKAGE"
                ? "Total charge for the complete package"
                : "Default charge for per-visit billing"}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Template...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Template
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEpisodeTemplate;
