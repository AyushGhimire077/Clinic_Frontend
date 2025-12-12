import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    Edit,
    FileText,
    Pill,
    Play,
    Save,
    Stethoscope,
    User,
    X,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios_auth } from "../../../component/global/config";
import type { IVisit, IVisitCreate } from "../helper/vist.interface";
import { useVisitStore } from "../helper/vist.store";

const VisitInfo = () => {
    const {
        updateVisit,
        loading,
        startVisit,
        getVisitById,
        cancelVisit,
        completeVisit,
    } = useVisitStore();

    const [currentVisit, setCurrentVisit] = useState<IVisit | null>(null);
    const [availableServices, setAvailableServices] = useState<any[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newMedicine, setNewMedicine] = useState("");
    const [activeTab, setActiveTab] = useState("details");

    const [formData, setFormData] = useState<Partial<IVisitCreate>>({
        note: "",
        prescribedMedicines: [],
        serviceIds: [],
    });

    const urlParams = new URLSearchParams(window.location.search);
    const visitId = urlParams.get("visitId") || "";
    const navigate = useNavigate();

    const loadVisit = async () => {
        if (!visitId) return;
        const res = await getVisitById(visitId);

        if (!res?.data?.data) return;

        const data: IVisit = res.data.data;
        setCurrentVisit(data);

        setFormData({
            note: data.note,
            prescribedMedicines: data.prescribedMedicines ?? [],
            serviceIds: (data.services ?? []).map((s) => Number(s.id)),
        });
    };

    const loadServices = async () => {
        try {
            const res = await axios_auth.get("/api/services/all");
            setAvailableServices(res.data.data ?? []);
        } catch (error) {
            console.error("Failed to load services:", error);
        }
    };

    useEffect(() => {
        loadVisit();
        loadServices();
    }, [visitId]);

    const handleInputChange = (field: keyof IVisitCreate, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const addMedicine = () => {
        if (!newMedicine.trim()) return;
        handleInputChange("prescribedMedicines", [
            ...(formData.prescribedMedicines ?? []),
            newMedicine.trim(),
        ]);
        setNewMedicine("");
    };

    const removeMedicine = (index: number) => {
        const list = [...(formData.prescribedMedicines ?? [])];
        list.splice(index, 1);
        handleInputChange("prescribedMedicines", list);
    };

    const toggleService = (serviceId: number) => {
        const selected = formData.serviceIds ?? [];
        handleInputChange(
            "serviceIds",
            selected.includes(serviceId)
                ? selected.filter((x) => x !== serviceId)
                : [...selected, serviceId]
        );
    };

    const handleUpdate = async () => {
        if (!currentVisit) return;

        const updateData: IVisitCreate = {
            episodeId: currentVisit.episode.id,
            patientId: currentVisit.patient.id,
            doctorId: currentVisit.doctor.id,
            note: formData.note || "",
            prescribedMedicines: formData.prescribedMedicines || [],
            serviceIds: formData.serviceIds || [],
        };

        const res = await updateVisit(currentVisit.id, updateData);
        if (res.severity === "success") {
            setIsEditMode(false);
            loadVisit();
        }
    };

    const handleStatusAction = async (
        action: "start" | "complete" | "cancel"
    ) => {
        if (!currentVisit) return;

        let res;
        if (action === "start") res = await startVisit(currentVisit.id);
        if (action === "complete") res = await completeVisit(currentVisit.id);
        if (action === "cancel") res = await cancelVisit(currentVisit.id);

        if (res?.severity === "success") {
            loadVisit();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            SCHEDULED: "bg-blue-100 text-blue-700 border border-blue-200",
            IN_PROGRESS: "bg-warning/20 text-warning border border-warning/30",
            COMPLETED: "bg-success/20 text-success border border-success/30",
            CANCELLED: "bg-error/20 text-error border border-error/30",
        };
        return colors[status] || "bg-muted/20 text-muted border border-border";
    };

    const getServiceCharge = (services: any[]) => {
        return services.reduce((total, service) => total + (service.charge || 0), 0);
    };

    const getAllowedActions = () => {
        if (!currentVisit) return [];
        const status = currentVisit.status;
        switch (status) {
            case "SCHEDULED":
                return ["start", "cancel"];
            case "PENDING":
                return ["complete", "cancel"];
            case "COMPLETED":
            case "CANCELLED":
                return [];
            default:
                return [];
        }
    };

    if (!currentVisit) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
                    <p className="text-muted">Loading visit details...</p>
                </div>
            </div>
        );
    }

    const allowedActions = getAllowedActions();
    const totalCharge = getServiceCharge(currentVisit.services);

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button and Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/visits")}
                        className="flex items-center gap-2 text-muted hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Visits
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                                Visit Details
                            </h1>
                            <div className="flex items-center gap-4">
                                <p className="text-muted">
                                    Visit ID:{" "}
                                    <span className="font-mono text-sm">{currentVisit.id}</span>
                                </p>
                                <span
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                                        currentVisit.status
                                    )}`}
                                >
                                    {currentVisit.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {!isEditMode ? (
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors focus-ring"
                                    disabled={currentVisit.status === "COMPLETED" || currentVisit.status === "CANCELLED"}
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Visit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdate}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus-ring disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditMode(false);
                                            setFormData({
                                                note: currentVisit.note,
                                                prescribedMedicines: currentVisit.prescribedMedicines,
                                                serviceIds: currentVisit.services.map((s) =>
                                                    Number(s.id)
                                                ),
                                            });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface/80 transition-colors focus-ring"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Action Buttons */}
                    {allowedActions.length > 0 && !isEditMode && (
                        <div className="flex flex-wrap gap-3 mb-6">
                            {allowedActions.includes("start") && (
                                <button
                                    onClick={() => handleStatusAction("start")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus-ring"
                                >
                                    <Play className="w-4 h-4" />
                                    Start Visit
                                </button>
                            )}
                            {allowedActions.includes("complete") && (
                                <button
                                    onClick={() => handleStatusAction("complete")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-lg hover:bg-success-dark transition-colors focus-ring"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Complete Visit
                                </button>
                            )}
                            {allowedActions.includes("cancel") && (
                                <button
                                    onClick={() => handleStatusAction("cancel")}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-error text-white rounded-lg hover:bg-error-dark transition-colors focus-ring"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Cancel Visit
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2 border-b border-border">
                        {["details", "services", "medicines", "notes"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab
                                    ? "bg-primary text-white border-b-2 border-primary"
                                    : "text-muted hover:text-foreground hover:bg-surface"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === "details" && (
                            <>
                                {/* Patient & Doctor Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-surface rounded-xl p-6 border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                                                <User className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    Patient
                                                </h3>
                                                <p className="text-sm text-muted">Visit participant</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-muted">Full Name</p>
                                                <p className="font-medium text-foreground">
                                                    {currentVisit.patient.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted">Contact Number</p>
                                                <p className="font-medium text-foreground">
                                                    {currentVisit.patient.contactNumber}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted">Date of Birth</p>
                                                <p className="font-medium text-foreground">
                                                    {formatDate(currentVisit.patient.dateOfBirth)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-surface rounded-xl p-6 border border-border">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-info-light rounded-lg flex items-center justify-center">
                                                <Stethoscope className="w-6 h-6 text-info" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    Doctor
                                                </h3>
                                                <p className="text-sm text-muted">Treating physician</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-muted">Name</p>
                                                <p className="font-medium text-foreground">
                                                    Dr. {currentVisit.doctor.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted">Role</p>
                                                <p className="font-medium text-foreground">
                                                    {currentVisit.doctor.role}
                                                </p>
                                            </div>
                                            {currentVisit.doctor.doctorSubType && (
                                                <div>
                                                    <p className="text-sm text-muted">Specialization</p>
                                                    <p className="font-medium text-foreground">
                                                        {currentVisit.doctor.doctorSubType}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Episode Information */}
                                <div className="bg-surface rounded-xl p-6 border border-border">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-success-light rounded-lg flex items-center justify-center">
                                            <Activity className="w-6 h-6 text-success" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                Episode
                                            </h3>
                                            <p className="text-sm text-muted">Treatment episode</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted">Episode Title</p>
                                            <p className="font-medium text-foreground">
                                                {currentVisit.episode.title}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted">Billing Mode</p>
                                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-surface text-foreground border border-border">
                                                {currentVisit.episode.billingMode}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted">Start Date</p>
                                            <p className="font-medium text-foreground">
                                                {formatDate(currentVisit.episode.startDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted">
                                                {currentVisit.episode.endDate ? "End Date" : "Status"}
                                            </p>
                                            <p className="font-medium text-foreground">
                                                {currentVisit.episode.endDate
                                                    ? formatDate(currentVisit.episode.endDate)
                                                    : "Active"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === "services" && (
                            <div className="bg-surface rounded-xl p-6 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Services
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {isEditMode
                                                ? "Select services for this visit"
                                                : "Services provided during this visit"}
                                        </p>
                                    </div>
                                    {!isEditMode && (
                                        <div className="text-right">
                                            <p className="text-sm text-muted">Total Charge</p>
                                            <p className="text-2xl font-bold text-foreground">
                                                Rs. {totalCharge}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {isEditMode ? (
                                    <div className="space-y-4">
                                        {availableServices.map((service) => (
                                            <div
                                                key={service.id}
                                                className={`flex items-center justify-between p-4 rounded-lg border ${formData.serviceIds?.includes(Number(service.id))
                                                    ? "border-primary bg-primary-light/10"
                                                    : "border-border bg-background"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.serviceIds?.includes(
                                                            Number(service.id)
                                                        )}
                                                        onChange={() => toggleService(Number(service.id))}
                                                        className="w-5 h-5 text-primary rounded focus-ring"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {service.name}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            {service.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-foreground">
                                                        Rs. {service.charge}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {currentVisit.services.length > 0 ? (
                                            currentVisit.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                                                >
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {service.name}
                                                        </p>
                                                        <p className="text-sm text-muted">
                                                            {service.description}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-foreground">
                                                            Rs. {service.charge}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <Activity className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                                <p className="text-muted">No services recorded</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "medicines" && (
                            <div className="bg-surface rounded-xl p-6 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Medicines
                                        </h3>
                                        <p className="text-sm text-muted">
                                            {isEditMode
                                                ? "Add or remove prescribed medicines"
                                                : "Medicines prescribed during this visit"}
                                        </p>
                                    </div>
                                </div>

                                {isEditMode ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMedicine}
                                                onChange={(e) => setNewMedicine(e.target.value)}
                                                placeholder="Enter medicine name and dosage"
                                                className="input-field flex-1"
                                                onKeyPress={(e) => e.key === "Enter" && addMedicine()}
                                            />
                                            <button
                                                onClick={addMedicine}
                                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors focus-ring"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {formData.prescribedMedicines?.map((medicine, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Pill className="w-4 h-4 text-primary" />
                                                        <span className="text-foreground">{medicine}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeMedicine(index)}
                                                        className="p-1 text-error hover:bg-error/10 rounded transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {currentVisit.prescribedMedicines.length > 0 ? (
                                            currentVisit.prescribedMedicines.map((medicine, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border"
                                                >
                                                    <Pill className="w-4 h-4 text-primary shrink-0" />
                                                    <span className="text-foreground">{medicine}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <Pill className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                                                <p className="text-muted">No medicines prescribed</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "notes" && (
                            <div className="bg-surface rounded-xl p-6 border border-border">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-warning-light rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-warning" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">
                                            Notes
                                        </h3>
                                        <p className="text-sm text-muted">
                                            Doctor's notes and observations
                                        </p>
                                    </div>
                                </div>

                                {isEditMode ? (
                                    <textarea
                                        value={formData.note || ""}
                                        onChange={(e) => handleInputChange("note", e.target.value)}
                                        placeholder="Enter clinical notes, observations, and recommendations..."
                                        className="input-field min-h-[200px]"
                                        rows={8}
                                    />
                                ) : (
                                    <div className="bg-background rounded-lg p-4 border border-border">
                                        {currentVisit.note ? (
                                            <p className="text-foreground whitespace-pre-wrap">
                                                {currentVisit.note}
                                            </p>
                                        ) : (
                                            <p className="text-muted italic">
                                                No notes recorded for this visit
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <div className="bg-surface rounded-xl p-6 border border-border">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Timeline
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground">Created</p>
                                        <p className="text-sm text-muted">
                                            {formatDateTime(currentVisit?.createdAt ?? "")}
                                        </p>
                                    </div>
                                </div>

                                {currentVisit.status !== "SCHEDULED" && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center shrink-0">
                                            <Play className="w-4 h-4 text-success" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Started</p>
                                            <p className="text-sm text-muted">
                                                {currentVisit.status === "PENDING"
                                                    ? "In progress..."
                                                    : "Visit was started"}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentVisit.status === "COMPLETED" && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-4 h-4 text-success" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Completed</p>
                                            <p className="text-sm text-muted">Visit completed</p>
                                        </div>
                                    </div>
                                )}

                                {currentVisit.status === "CANCELLED" && (
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-error-light rounded-full flex items-center justify-center shrink-0">
                                            <XCircle className="w-4 h-4 text-error" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Cancelled</p>
                                            <p className="text-sm text-muted">Visit was cancelled</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="bg-surface rounded-xl p-6 border border-border">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Quick Info
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Total Charge</span>
                                    <span className="font-medium text-foreground">
                                        Rs. {totalCharge}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Services</span>
                                    <span className="font-medium text-foreground">
                                        {currentVisit.services.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Medicines</span>
                                    <span className="font-medium text-foreground">
                                        {currentVisit.prescribedMedicines.length}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted">Billing Mode</span>
                                    <span className="font-medium text-foreground">
                                        {currentVisit.episode.billingMode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-primary-light/20 rounded-xl p-6 border border-primary/20">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-foreground mb-2">
                                        Information
                                    </h4>
                                    <p className="text-sm text-muted">
                                        Visit details and notes are stored permanently in the
                                        patient's medical record.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitInfo;