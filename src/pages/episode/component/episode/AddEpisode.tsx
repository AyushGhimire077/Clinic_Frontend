import { AlertCircle, Calendar } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { BackButton } from "../../../../component/global/components/back/back";
import { useToast } from "../../../../component/toaster/useToast";
import type { IPatient } from "../../../patient/helper/patient.interface";
import { usePatientStore } from "../../../patient/helper/patient.store";
import { useEpisodeStore } from "../../helper/episode.store";

import EpisodeFormSections from "./sub/EpisodeFormSections";
import FormActions from "./sub/FormActions";
import PatientInfoBanner from "./sub/PatientInfoBanner";
import TemplateSelection from "./sub/TemplateSelection";
import type { IEpisodeRequest } from "../../helper/episode.interface";
import { useEpisodeTemplateStore } from "../../helper/episode.template.store";

const AddEpisode = () => {
  const { showToast } = useToast();
  const { create } = useEpisodeStore();
  const { list: episodeTemplateList } = useEpisodeTemplateStore();
  const { fetchById: getPatientById, list: patientList } = usePatientStore();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get("patientId") || "";
  const templateIdFromUrl = queryParams.get("template") || "";

  const [form, setForm] = useState<IEpisodeRequest>({
    title: "",
    startDate: new Date().toISOString().slice(0, 10),
    type: "ONE_TIME",
    billingMode: "PER_VISIT",
    status: "ACTIVE",
    primaryDoctorId: "",
    patientId: patientIdFromUrl,
    packageCharge: 0,
    appointment: false,
  });

  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templateIdFromUrl);
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [patientError, setPatientError] = useState<string | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  /** Generic async loader */
  const withLoader = async (fn: () => Promise<any>, onError?: (err: any) => void) => {
    setLoading(true);
    try {
      return await fn();
    } catch (err) {
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  /** Load patient from URL */
  useEffect(() => {
    if (!patientIdFromUrl) return;

    const loadPatient = async () => {
      const existing = patientList.find((p) => p.id === patientIdFromUrl);
      if (existing) return setSelectedPatient(existing);

      setPatientLoading(true);
      setPatientError(null);
      try {
        const patient = await getPatientById(patientIdFromUrl);
        if (patient) {
          setSelectedPatient(patient);
          setForm((prev) => ({ ...prev, patientId: patient.id }));
          showToast(`Patient ${patient.name} loaded`, "success");
        } else {
          setPatientError("Patient not found");
          showToast("Patient not found. Please select manually.", "warning");
        }
      } catch (err) {
        setPatientError("Failed to load patient details");
        showToast("Failed to load patient details", "error");
      } finally {
        setPatientLoading(false);
      }
    };

    loadPatient();
  }, [patientIdFromUrl, getPatientById, patientList, showToast]);

  /** Template selection handler */
  const handleTemplateSelect = useCallback(
    (id: string) => {
      setSelectedTemplateId(id);

      if (!id) {
        setForm((prev) => ({ ...prev, title: "", type: "ONE_TIME", billingMode: "PER_VISIT", packageCharge: 0 }));
        return;
      }

      const template = episodeTemplateList.find((t) => t.id === id);
      if (!template) return;

      setForm((prev) => ({
        ...prev,
        title: template.title,
        type: template.type,
        billingMode: template.billingMode,
        packageCharge: template.packageCharge,
      }));
    },
    [episodeTemplateList]
  );

  /** Form change handler */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;

    // Clear template if user edits auto-filled fields
    if (selectedTemplateId && ["title", "type", "billingMode", "packageCharge"].includes(name)) {
      setSelectedTemplateId("");
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "packageCharge" ? parseFloat(value) || 0 : value,
    }));
  };


  /** Patient select handler */
  const handlePatientSelect = (id: string) => {
    setForm((prev) => ({ ...prev, patientId: id }));
    setSelectedPatient(patientList.find((p) => p.id === id) || null);
    setPatientError(null);
  };

  
  /** Form validation */
  const validateForm = () => {
    const errors: string[] = [];
    if (!form.title.trim()) errors.push("Episode title is required");
    if (!form.startDate) errors.push("Start date is required");
    if (!form.primaryDoctorId) errors.push("Primary doctor is required");
    if (!form.patientId) errors.push("Patient is required");
    if (form.packageCharge <= 0) errors.push("Package charge must be greater than 0");

    const start = new Date(form.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) errors.push("Start date cannot be in the past");

    return { isValid: errors.length === 0, errors };
  };

  /** Submit handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();
    if (!isValid) return showToast(errors[0], "warning");

    const res: any = await withLoader(() => create(form));

    if (!res || res.severity.toLowerCase() !== "success") return;

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
  };

  /** Cancel handler */
  const handleCancel = () => {
    if (form.patientId || form.title || form.primaryDoctorId) {
      if (!window.confirm("Are you sure? Unsaved changes will be lost.")) return;
    }
    navigate("/episode/view");
  };

  /** Auto-close template dropdown */
  useEffect(() => {
    if (selectedTemplateId) setShowTemplateDropdown(false);
  }, [selectedTemplateId]);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-gray-50/30 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-linear-to-r from-primary to-primary-dark px-6 py-6 flex flex-col sm:flex-row sm:items-center gap-6">
            <BackButton className="bg-white/90 border-border" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Episode</h1>
                <p className="text-primary-light text-sm mt-1">
                  Start a new treatment episode for a patient
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <PatientInfoBanner
              patient={selectedPatient}
              onRemovePatient={() => {
                setForm((prev) => ({ ...prev, patientId: "" }));
                setSelectedPatient(null);
              }}
            />

            {patientLoading && (
              <div className="mb-6 p-4 bg-surface border border-border rounded-xl flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted">Loading patient details...</p>
              </div>
            )}

            {patientError && (
              <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-error" />
                <div>
                  <p className="text-sm text-error font-medium">{patientError}</p>
                  <p className="text-xs text-muted mt-1">Please select a patient manually</p>
                </div>
              </div>
            )}

            <TemplateSelection
              episodeTemplateList={episodeTemplateList}
              selectedTemplateId={selectedTemplateId}
              form={form}
              onTemplateSelect={handleTemplateSelect}
              showTemplateDropdown={showTemplateDropdown}
              onToggleDropdown={() => setShowTemplateDropdown(!showTemplateDropdown)}
            />

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

              <FormActions
                onFieldChange={handleChange}
                form={form}
                loading={loading}
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
