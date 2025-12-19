import {
  Activity,
  AlertCircle,
  Calendar,
  Edit2,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../component/global/components/back/back";
import { usePatientStore } from "../helper/patient.store";
import { calculateAge, formatDateForDisplay } from "../../../component/utils/ui.helpers";



const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n?.[0] || "")
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Sub-components for better organization
const PatientStatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${isActive
      ? "bg-success/10 text-success border border-success/20"
      : "bg-error/10 text-error border border-error/20"
      }`}
  >
    <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? "bg-success" : "bg-error"}`} />
    {isActive ? "Active Patient" : "Inactive"}
  </span>
);

const InfoCard = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string
}) => (
  <div className={`bg-surface border border-border rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const LoadingSkeleton = () => (
  <div className="max-w-6xl mx-auto animate-pulse">
    <div className="mb-6">
      <div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="space-y-6">
      <div className="h-40 bg-gray-200 rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl"></div>
        <div className="space-y-6">
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-40 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchById, list } = usePatientStore();

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPatient = useCallback(async () => {
    if (!id) {
      setError("Patient ID is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Try cache first for instant feedback
      const cachedPatient = list.find((p) => p.id === id);
      if (cachedPatient) {
        setPatient(cachedPatient);
      }

      // Always fetch fresh data in background
      const freshPatient = await fetchById(id);

      // Only update if data differs from cache
      if (!cachedPatient || JSON.stringify(cachedPatient) !== JSON.stringify(freshPatient)) {
        setPatient(freshPatient);
      }
    } catch (error) {
      console.error("Failed to load patient:", error);

      // If we have cached data, show it with a warning
      const cachedPatient = list.find((p) => p.id === id);
      if (cachedPatient) {
        setPatient(cachedPatient);
      } else {
        setError("Failed to load patient data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, fetchById, list]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  const handleRefresh = () => {
    loadPatient();
  };

  const handleRetry = () => {
    setError(null);
    loadPatient();
  };

  if (loading && !patient) {
    return <LoadingSkeleton />;
  }

  if (error && !patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-error/50" />
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Unable to Load Patient
          </h1>
          <p className="text-muted mb-6 max-w-md mx-auto">
            {error}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors"
            >
              Back to Patients
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted/30" />
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Patient Not Found
          </h1>
          <p className="text-muted mb-6">
            The patient you're looking for doesn't exist or has been removed.
          </p>
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

  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
            <p className="text-sm text-muted">Manage and view patient information</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-5 h-5 text-muted" />
          </button>
          <button
            onClick={() => navigate(`/patient/edit/${patient.id}`, { state: { patient: patient } })}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <InfoCard className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-linear-to-br from-primary-light to-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-white">
                {getInitials(patient.name)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {patient.name}
                </h1>
                <PatientStatusBadge isActive={patient.isActive} />
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Born {formatDateForDisplay(patient.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  <span className="capitalize">{patient.gender.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>{patient.bloodGroup}</span>
                </div>
                {/* register on */}
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{formatDateForDisplay(patient.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">

          </div>
        </div>
      </InfoCard>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Full Name
                  </label>
                  <p className="text-foreground font-medium text-lg">{patient.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Date of Birth
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="text-foreground font-medium">
                      {formatDateForDisplay(patient.dateOfBirth)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Age
                  </label>
                  <p className="text-foreground font-medium text-lg">{age} years</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Contact Number
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted" />
                    <a
                      href={`tel:${patient.contactNumber}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {patient.contactNumber}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted" />
                    <a
                      href={`mailto:${patient.email}`}
                      className="text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {patient?.email || "N/A"}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">
                    Gender
                  </label>
                  <p className="text-foreground font-medium text-lg capitalize">
                    {patient.gender.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <label className="text-sm font-medium text-muted block mb-2">
                Address
              </label>
              <div className="flex items-start gap-3 p-4 bg-background border border-border rounded-lg">
                <MapPin className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                <p className="text-foreground leading-relaxed">{patient.address}</p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Medical Information */}
          <InfoCard>
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-error/10 rounded-lg">
                <Activity className="w-5 h-5 text-error" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Medical Information
              </h2>
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-background border border-border rounded-lg">
                <label className="text-sm font-medium text-muted block mb-2">
                  Blood Group
                </label>
                <div className="mt-2">
                  <span className="inline-flex items-center justify-center px-4 py-3 rounded-lg bg-error/10 text-error font-bold text-xl min-w-20">
                    {patient.bloodGroup}
                  </span>
                </div>
                <p className="text-sm text-muted mt-3">
                  Critical medical information for emergencies
                </p>
              </div>

              <div className="p-4 bg-background border border-border rounded-lg">
                <label className="text-sm font-medium text-muted block mb-2">
                  Patient Status
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <div
                    className={`w-3 h-3 rounded-full ${patient.isActive ? "bg-success animate-pulse" : "bg-error"
                      }`}
                  />
                  <span
                    className={`font-medium text-lg ${patient.isActive ? "text-success" : "text-error"
                      }`}
                  >
                    {patient.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-sm text-muted mt-3">
                  {patient.isActive
                    ? "Patient can schedule new appointments"
                    : "Patient cannot schedule new appointments"}
                </p>
              </div>
            </div>
          </InfoCard>


        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/patient/edit/${patient.id}`, { state: { patient: patient } })}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Patient Details
            </button>
            <button
              onClick={() => navigate(`/episode/add?patientId=${patient.id}`)}
              className="px-6 py-3 bg-linear-to-r from-info to-info/80 text-white rounded-lg hover:from-info/80 hover:to-info transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Create New Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;