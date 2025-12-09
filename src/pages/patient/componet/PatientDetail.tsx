import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Activity,
  Edit2,
  FileText,
  UserCheck,
  Shield,
} from "lucide-react";
import { BackButton } from "../../../component/global/back/back";
import { useToast } from "../../../component/toaster/useToast";
import { usePatientStore } from "../helper/patient.store";
import { formatDate, formatDateTime } from "../../../component/global/formatters";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getPatientById, patientList } = usePatientStore();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    if (!id) return;

    // First try to find in existing list
    const foundPatient = patientList.find((p) => p.id === id);
    if (foundPatient) {
      setPatient(foundPatient);
      return;
    }

    // If not found, fetch from API
    setLoading(true);
    try {
      const res = await getPatientById(id);

      setPatient(res);
    } catch (error) {
      showToast("Failed to load patient", "error");
      navigate("/patient");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted/30" />
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Patient Not Found
          </h1>
          <button
            onClick={() => navigate("/patient")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Patients
          </button>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-primary">
                {getInitials(patient.name)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {patient.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${patient.isActive
                    ? "bg-success/10 text-success"
                    : "bg-error/10 text-error"
                    }`}
                >
                  {patient.isActive ? "Active Patient" : "Inactive"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-surface text-foreground">
                  {patient.gender.toLowerCase()}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error/10 text-error">
                  {patient.bloodGroup}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{age}</div>
              <div className="text-sm text-muted">Years Old</div>
            </div>
            <div className="text-center text-sm text-muted">
              ID:{" "}
              <span className="font-mono">{patient.id.substring(0, 8)}...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted">
                    Full Name
                  </label>
                  <p className="text-foreground font-medium">{patient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">
                    Date of Birth
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-foreground">
                      {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">Age</label>
                  <p className="text-foreground font-medium">{age} years</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted">
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted" />
                    <span className="text-foreground">
                      {patient.contactNumber}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted" />
                    <span className="text-foreground">{patient.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted">
                    Gender
                  </label>
                  <p className="text-foreground font-medium capitalize">
                    {patient.gender.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-muted">Address</label>
              <div className="flex items-start gap-2 mt-2">
                <MapPin className="w-4 h-4 text-muted mt-1" />
                <p className="text-foreground">{patient.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Medical Information
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-background border border-border rounded-lg">
                <label className="text-sm font-medium text-muted">
                  Blood Group
                </label>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-2 rounded-lg bg-error/10 text-error font-bold text-lg">
                    {patient.bloodGroup}
                  </span>
                </div>
                <p className="text-sm text-muted mt-2">
                  Critical medical information
                </p>
              </div>

              <div className="p-4 bg-background border border-border rounded-lg">
                <label className="text-sm font-medium text-muted">
                  Patient Status
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${patient.isActive ? "bg-success" : "bg-error"
                      }`}
                  />
                  <span
                    className={`font-medium ${patient.isActive ? "text-success" : "text-error"
                      }`}
                  >
                    {patient.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted mt-2">
                  {patient.isActive
                    ? "Can schedule appointments"
                    : "Cannot schedule new appointments"}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Details */}
          <div className="bg-surface border border-border rounded-lg p-6 mt-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Registration Details
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted">
                  Registered On
                </label>
                <p className="text-foreground">
                  {formatDateTime(patient.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted">
                  Last Updated
                </label>
                <p className="text-foreground">
                  {formatDateTime(patient.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
        <button
          onClick={() => navigate("/patients")}
          className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors"
        >
          Back to Patients
        </button>
        <button
          onClick={() => navigate(`/patients/${patient.id}/edit`)}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" />
          Edit Patient
        </button>
        <button
          onClick={() => navigate(`/episodes/add?patientId=${patient.id}`)}
          className="px-6 py-3 bg-info text-white rounded-lg hover:bg-info/80 transition-colors flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Create Episode
        </button>
      </div>
    </div>
  );
};

export default PatientDetail;
