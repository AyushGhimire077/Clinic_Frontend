import { AlertCircle, Calendar } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "../../../../component/global/components/back/back";
import { useToast } from "../../../../component/toaster/useToast";
import type { IPatient } from "../../../patient/helper/patient.interface";
import { usePatientStore } from "../../../patient/helper/patient.store";
import type { EpisodeRequest } from "../../helper/episode.interface";
import { useEpisodeStore } from "../../helper/episode.store";
import EpisodeFormSections from "./sub/EpisodeFormSections";
import FormActions from "./sub/FormActions";
import PatientInfoBanner from "./sub/PatientInfoBanner";
import TemplateSelection from "./sub/TemplateSelection";


const AddEpisode = () => {
  const { showToast } = useToast();
  const { createEpisode, episodeTemplateList, getAllEpisodeTemplates } =
    useEpisodeStore();
  const { getPatientById, patientList } = usePatientStore();
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId") || "";
  const templateId = queryParams.get("template") || "";

  const [form, setForm] = useState<EpisodeRequest>({
    title: "",
    startDate: new Date().toISOString().slice(0, 10),
    type: "ONE_TIME",
    billingMode: "PER_VISIT",
    status: "ACTIVE",
    primaryDoctorId: "",
    patientId: patientId,
    packageCharge: 0,
    appointment: false,
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(templateId);
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);

  // Fetch templates on mount
  useEffect(() => {
    getAllEpisodeTemplates({ page: 0, size: 100 });
  }, [getAllEpisodeTemplates]);

  // Handle patient ID from URL
  useEffect(() => {
    const loadPatientFromUrl = async () => {
      if (!patientId) return;

      // Check if patient already exists in store
      const existingPatient = patientList.find((p) => p.id === patientId);
      if (existingPatient) {
        setSelectedPatient(existingPatient);
        setForm((prev) => ({ ...prev, patientId }));
        return;
      }

      // Fetch patient from API
      setPatientLoading(true);
      setPatientError(null);
      try {
        const patient = await getPatientById(patientId);
        if (patient) {
          setSelectedPatient(patient);
          setForm((prev) => ({ ...prev, patientId }));
          showToast(`Patient ${patient.name} loaded`, "success");
        } else {
          setPatientError("Patient not found");
          showToast("Patient not found. Please select a patient.", "warning");
        }
      } catch (error) {
        console.error("Failed to load patient:", error);
        setPatientError("Failed to load patient details");
        showToast("Failed to load patient details", "error");
      } finally {
        setPatientLoading(false);
      }
    };

    loadPatientFromUrl();
  }, [patientId, getPatientById, patientList, showToast]);

  // Handle template selection and auto-fill
  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      setSelectedTemplateId(templateId);

      if (!templateId) {
        // Clear template data if no template selected
        setForm((prev) => ({
          ...prev,
          title: "",
          type: "ONE_TIME",
          billingMode: "PER_VISIT",
          packageCharge: 0,

        }));
        return;
      }

      const selectedTemplate = episodeTemplateList.find(
        (t) => t.id === templateId
      );
      if (selectedTemplate) {
        setForm((prev) => ({
          ...prev,
          title: selectedTemplate.title,
          type: selectedTemplate.type,
          billingMode: selectedTemplate.billingMode,
          packageCharge: selectedTemplate.packageCharge,
        }));
      }
    },
    [episodeTemplateList]
  );

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target instanceof HTMLInputElement) ? target.checked : undefined;

    // Clear template if user manually changes an auto-filled field
    if (
      selectedTemplateId &&
      ["title", "type", "billingMode", "packageCharge"].includes(name)
    ) {
      setSelectedTemplateId("");
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "packageCharge"
            ? value === ""
              ? 0
              : parseFloat(value) || 0
            : value,
    }));
  };


  // Handle patient selection
  const handlePatientSelect = (id: string) => {
    setForm((prev) => ({ ...prev, patientId: id }));

    // Find and set selected patient for display
    const patient = patientList.find((p) => p.id === id);
    setSelectedPatient(patient || null);
    setPatientError(null);
  };

  // Form validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!form.title.trim()) errors.push("Episode title is required");
    if (!form.startDate) errors.push("Start date is required");
    if (!form.primaryDoctorId) errors.push("Primary doctor is required");
    if (!form.patientId) errors.push("Patient is required");
    if (form.packageCharge <= 0)
      errors.push("Package charge must be greater than 0");

    // Additional validations
    if (form.startDate) {
      const startDate = new Date(form.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        errors.push("Start date cannot be in the past");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors } = validateForm();
    if (!isValid) {
      showToast(errors[0], "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await createEpisode(form);

      console.log(res)

      showToast(res.message, res.severity);

      if (res.severity.toLowerCase() !== "success") return;

      if (form.appointment) {
        navigate(`/appointment/create?episodeId=${res.data.id}&patientId=${form.patientId}`, {
          state: { episodeId: res.data.id, patientId: form.patientId },
        });
        return;
      }

      setForm({
        title: "",
        startDate: new Date().toISOString().slice(0, 10),
        type: "ONE_TIME",
        billingMode: "PER_VISIT",
        status: "ACTIVE",
        primaryDoctorId: "",
        patientId: "",
        packageCharge: 0,
        appointment: false,
      });

      navigate("/episode/view");
    } catch (error: any) {
      console.error("Create episode error:", error);
      showToast(
        error?.response?.data?.message || "Failed to create episode",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };



  // Handle cancel
  const handleCancel = () => {
    if (form.patientId || form.title || form.primaryDoctorId) {
      if (
        window.confirm(
          "Are you sure you want to cancel? Any unsaved changes will be lost."
        )
      ) {
        navigate("/episode/view");
      }
    } else {
      navigate("/episode/view");
    }
  };

  // Auto close template dropdown on template select
  useEffect(() => {
    if (selectedTemplateId) {
      setShowTemplateDropdown(false);
    }
  }, [selectedTemplateId]);

  // Calculate minimum date (today)
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-gray-50/30 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-linear-to-r from-primary to-primary-dark px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <BackButton className="bg-white/90 border-border" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
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
          </div>

          <div className="p-6 md:p-8">
            {/* Patient Info Banner */}
            <PatientInfoBanner
              patient={selectedPatient}
              onRemovePatient={() => {
                setForm((prev) => ({ ...prev, patientId: "" }));
                setSelectedPatient(null);
              }}
            />

            {/* Patient Loading/Error States */}
            {patientLoading && (
              <div className="mb-6 p-4 bg-surface border border-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted">Loading patient details...</p>
                </div>
              </div>
            )}

            {patientError && (
              <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-error" />
                  <div>
                    <p className="text-sm text-error font-medium">
                      {patientError}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Please select a patient manually from the dropdown below
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Template Selection */}
            <TemplateSelection
              episodeTemplateList={episodeTemplateList}
              selectedTemplateId={selectedTemplateId}
              form={form}
              onTemplateSelect={handleTemplateSelect}
              showTemplateDropdown={showTemplateDropdown}
              onToggleDropdown={() =>
                setShowTemplateDropdown(!showTemplateDropdown)
              }
            />

            {/* Main Form */}
            <form onSubmit={handleSubmit}>
              <EpisodeFormSections
                form={form}
                selectedPatient={selectedPatient}
                patientLoading={patientLoading}
                loading={loading}
                minDate={minDate}
                onPatientSelect={handlePatientSelect}
                onFieldChange={handleChange}
              />

              {/* Action Buttons */}
              <FormActions
                form={form}
                loading={loading}
                onFieldChange={handleChange}

                patientLoading={patientLoading}
                selectedTemplateId={selectedTemplateId}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEpisode;