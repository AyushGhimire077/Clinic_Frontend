import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Calendar, CreditCard, FileText, Plus, User } from "lucide-react";
import { BackButton } from "../../../component/global/back/back";
import { SearchInput } from "../../../component/global/SearchInput";
import { useToast } from "../../../component/toaster/useToast";
import { useStaffStore } from "../../staff/staff.helper/staff.store";
import { useEpisodeStore } from "../helper/episode.store";
import {
  billingModeOptions,
  episodeTypeOptions,
  statusOptions,
} from "../../../component/global/interface";
import DoctorStaffSelect from "../helper/DoctorStaffSelect";
import { usePatientStore } from "../../patient/helper/patient.store";

const AddEpisode = () => {
  const { showToast } = useToast();
  const { createEpisode, episodeTemplateList, getAllEpisodeTemplates } =
    useEpisodeStore();
  const { getAllActiveStaff } = useStaffStore();
  const { getAllActivePatients, patientList } = usePatientStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    type: "ONE_TIME" as const,
    billingMode: "PER_VISIT" as const,
    status: "ACTIVE" as const,
    primaryDoctorId: "",
    patientId: "",
    templateId: "",
    packageCharge: 0,
  });

  const [loading, setLoading] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");

  useEffect(() => {
    getAllActiveStaff({ page: 0, size: 100 });
    getAllActivePatients({ page: 0, size: 100 });
    getAllEpisodeTemplates({ page: 0, size: 100 });
  }, []);

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

    if (
      !form.title ||
      !form.startDate ||
      !form.endDate ||
      !form.primaryDoctorId ||
      !form.patientId
    ) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      showToast("End date cannot be before start date", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await createEpisode(form);
      showToast(res.message, res.severity);

      if (res.severity === "success") {
        setTimeout(() => navigate("/episodes"), 1500);
      }
    } catch (error) {
      showToast("Failed to create episode", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patientList.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchPatient.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchPatient.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create New Episode
          </h1>
          <p className="text-muted">
            Start a new treatment episode for a patient
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
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
                className="input-field"
                required
              />
            </div>

            <div>
              <label
                htmlFor="templateId"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Use Template (Optional)
              </label>
              <select
                id="templateId"
                name="templateId"
                value={form.templateId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Template</option>
                {episodeTemplateList.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title} ({template.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-foreground mb-2"
              >
                End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted" />
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Type and Billing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="input-field pl-10"
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
                  className="input-field pl-10"
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
                className="input-field"
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

          {/* Doctor Selection */}
          <DoctorStaffSelect
            value={form.primaryDoctorId}
            onChange={(id) =>
              setForm((prev) => ({ ...prev, primaryDoctorId: id }))
            }
            label="Primary Doctor"
            required
            filterType="DOCTOR"
          />

          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Patient *
            </label>
            <SearchInput
              value={searchPatient}
              onChange={setSearchPatient}
              placeholder="Search patients..."
              className="mb-4"
            />

            <div className="border border-border rounded-lg max-h-64 overflow-y-auto">
              {filteredPatients.length === 0 ? (
                <div className="py-8 text-center text-muted">
                  <User className="w-8 h-8 mx-auto mb-2 text-muted/30" />
                  No patients found
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, patientId: patient.id }))
                    }
                    className={`
                      w-full px-4 py-3 text-left transition-colors hover:bg-primary-light/10
                      ${
                        form.patientId === patient.id
                          ? "bg-primary-light/20"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-muted" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {patient.name}
                        </p>
                        <p className="text-sm text-muted">
                          {patient.email || "No email"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
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
              <span className="absolute left-3 top-3 text-muted">$</span>
              <input
                id="packageCharge"
                name="packageCharge"
                type="number"
                min="0"
                step="0.01"
                value={form.packageCharge}
                onChange={handleChange}
                placeholder="0.00"
                className="input-field pl-10"
                required
              />
            </div>
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
                  Creating Episode...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Episode
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEpisode;
