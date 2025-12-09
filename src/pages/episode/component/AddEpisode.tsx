import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CreditCard, FileText, Plus, Check, X } from "lucide-react";

import { BackButton } from "../../../component/global/back/back";
import { inputField } from "../../../component/global/customStyle";
import {
  billingModeOptions,
  episodeTypeOptions,
  statusOptions,
} from "../../../component/global/interface";
import { useToast } from "../../../component/toaster/useToast";
import { useEpisodeStore } from "../helper/episode.store";
import DoctorStaffSelect from "../helper/DoctorStaffSelect";
import PatientSelect from "../helper/PatientSelect";
import type { EpisodeRequest, IEpisodeTemp } from "../helper/episode.interface";

const AddEpisode = () => {
  const { showToast } = useToast();
  const { createEpisode, episodeTemplateList, getAllEpisodeTemplates } =
    useEpisodeStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<EpisodeRequest>({
    title: "",
    startDate: new Date().toISOString().slice(0, 10),
    type: "ONE_TIME" as const,
    billingMode: "PER_VISIT" as const,
    status: "ACTIVE" as const,
    primaryDoctorId: "",
    patientId: "",
    packageCharge: 0,
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllEpisodeTemplates({ page: 0, size: 100 });
  }, []);

  // Handle template selection and auto-fill
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);

    if (!templateId) {
      // Clear template data if no template selected
      setForm(prev => ({
        ...prev,
        title: "",
        type: "ONE_TIME",
        billingMode: "PER_VISIT",
        packageCharge: 0,
      }));
      return;
    }

    const selectedTemplate = episodeTemplateList.find(t => t.id === templateId);

    if (selectedTemplate) {
      setForm(prev => ({
        ...prev,
        title: selectedTemplate.title,
        type: selectedTemplate.type,
        billingMode: selectedTemplate.billingMode,
        packageCharge: selectedTemplate.packageCharge,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // If user manually changes a field that was auto-filled from template, clear the template selection
    if (selectedTemplateId && ["title", "type", "billingMode", "packageCharge"].includes(name)) {
      setSelectedTemplateId("");
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "packageCharge" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.startDate ||
      !form.primaryDoctorId ||
      !form.patientId ||
      form.packageCharge <= 0
    ) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await createEpisode(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setTimeout(() => navigate("/episode/view"), 1500);
      }
    } catch (error) {
      showToast("Failed to create episode", "error");
    } finally {
      setLoading(false);
    }
  };

  // Get selected template for display
  const selectedTemplate = episodeTemplateList.find(t => t.id === selectedTemplateId);



  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Main Card */}
        <div className="bg-surface rounded-lg shadow-soft overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-primary px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Create New Episode
                </h1>
                <p className="text-primary-light text-sm mt-1">
                  Start a new treatment episode for a patient
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Template Selection Section */}
            <div className="mb-8 p-4 bg-primary-light rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Quick Start with Template (Optional)
                  </h3>
                </div>
                <span className="text-xs text-muted bg-white px-2 py-1 rounded border border-border">
                  Auto-fill enabled
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Choose a Template
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    className={inputField}
                  >
                    <option value="">Select Template</option>
                    {episodeTemplateList.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.title} • {template.type} • Rs. {template.packageCharge}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-2">
                    Selecting a template will auto-fill title, type, billing mode, and package charge
                  </p>
                </div>

                {selectedTemplate && (
                  <div className="bg-white p-4 rounded-lg border-2 border-primary shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                          <Check className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {selectedTemplate.title}
                          </h4>
                          <p className="text-sm text-muted">
                            Template applied
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTemplateSelect("")}
                        className="text-muted hover:text-foreground transition-colors"
                        title="Remove template"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div className="text-center p-2 rounded bg-surface">
                        <p className="text-xs text-muted mb-1">Type</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedTemplate.type}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-surface">
                        <p className="text-xs text-muted mb-1">Billing</p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedTemplate.billingMode}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-surface">
                        <p className="text-xs text-muted mb-1">Charge</p>
                        <p className="text-sm font-medium text-primary">
                          Rs. {selectedTemplate.packageCharge}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-surface">
                        <p className="text-xs text-muted mb-1">Status</p>
                        <span className="inline-block px-2 py-1 bg-success/10 text-success text-xs font-medium rounded">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>


                <div className="grid grid-cols-1  md:grid-cols-2 gap-6">


                  <PatientSelect
                    value={form.patientId}
                    onChange={(id) =>
                      setForm((prev) => ({ ...prev, patientId: id }))
                    }
                    label="Patient"
                    required
                  />

                  <DoctorStaffSelect
                    value={form.primaryDoctorId}
                    onChange={(id) =>
                      setForm((prev) => ({ ...prev, primaryDoctorId: id }))
                    }
                    label="Primary Doctor"
                    required
                    filterType="DOCTOR"
                  />
                </div>
              </div>

              {/* Episode Details Section */}
              <div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Episode Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Physical Therapy Session"
                      className={inputField}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted" />
                      <input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        className={`${inputField} pl-10`}

                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Episode Type *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-muted" />
                      <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className={`${inputField} pl-10`}
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
                      htmlFor="status"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={inputField}
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Billing Section */}
              <div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className={`${inputField} pl-10`}

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

                  <div>
                    <label
                      htmlFor="packageCharge"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Package Charge *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 text-[17px] top-3 text-muted">Rs.</span>
                      <input
                        id="packageCharge"
                        name="packageCharge"
                        type="tel"
                        min="0"
                        step="0.01"
                        value={form.packageCharge}
                        onChange={handleChange}
                        placeholder="0.00"
                        className={`${inputField} pl-10`}

                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-border">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Episode...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {selectedTemplateId ? "Create Episode from Template" : "Create Episode"}
                    </>
                  )}
                </button>
                <p className="text-xs text-muted text-center mt-3">
                  All fields marked with * are required
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default AddEpisode;