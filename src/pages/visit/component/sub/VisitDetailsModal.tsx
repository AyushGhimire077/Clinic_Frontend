import {
    Activity,
    Briefcase,
    CreditCard,
    DollarSign,
    Droplet,
    Edit2,
    FileCheck,
    Mail,
    MapPin,
    Phone,
    Pill,
    Stethoscope,
    User,
    X
} from "lucide-react";
import { useState } from "react";
import type { IVisit } from "../../helper/vist.interface";

interface VisitDetailsModalProps {
    visit: IVisit;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: any
    formatDate: any
}

export const VisitDetailsModal = ({
    visit,
    isOpen,
    onClose,
    onUpdate,
    formatDate,
}: VisitDetailsModalProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        note: visit.note || "",
        prescribedMedicines: visit.prescribedMedicines?.join("\n") || "",
    });
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const success = await onUpdate(visit.id, {
                note: editForm.note,
                prescribedMedicines: editForm.prescribedMedicines.split("\n").filter(Boolean),
            });

            if (success) {
                setIsEditing(false);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const calculateTotalCharge = () => {
        return visit.services?.reduce((total, service) => total + (service.charge || 0), 0) || 0;
    };

    const InfoSection = ({ title, icon: Icon, children }: any) => (
        <div className="bg-background rounded-lg border border-border p-5">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                {title}
            </h4>
            {children}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-xl border border-border shadow-soft max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-border bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                <FileCheck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground">Visit Details</h3>
                                <p className="text-sm text-muted mt-1">
                                    Created: {visit.createdAt ? formatDate(visit.createdAt) : "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2.5 hover:bg-primary/10 rounded-lg transition-colors"
                                    title="Edit Visit"
                                >
                                    <Edit2 className="w-5 h-5 text-primary" />
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2.5 hover:bg-error/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-error" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <InfoSection title="Patient Information" icon={User}>
                            <div className="space-y-3">
                                {[
                                    { label: "Name", value: visit.patient?.name },
                                    { label: "Contact", value: visit.patient?.contactNumber, icon: Phone },
                                    { label: "Email", value: visit.patient?.email, icon: Mail },
                                    { label: "Gender", value: visit.patient?.gender },
                                    { label: "Blood Group", value: visit.patient?.bloodGroup, icon: Droplet },
                                    { label: "Address", value: visit.patient?.address, icon: MapPin },
                                ].map(
                                    (item) =>
                                        item.value && (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-sm text-muted flex items-center gap-1">
                                                    {item.icon && <item.icon className="w-3 h-3" />}
                                                    {item.label}:
                                                </span>
                                                <span className="text-sm font-medium text-foreground text-right">
                                                    {item.value}
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        </InfoSection>

                        <InfoSection title="Doctor Information" icon={Stethoscope}>
                            <div className="space-y-3">
                                {[
                                    { label: "Name", value: visit.doctor?.name },
                                    { label: "Specialization", value: visit.doctor?.doctorSubType },
                                    { label: "Contact", value: visit.doctor?.contactNumber, icon: Phone },
                                ].map(
                                    (item) =>
                                        item.value && (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-sm text-muted">{item.label}:</span>
                                                <span className="text-sm font-medium text-foreground">
                                                    {item.value}
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        </InfoSection>

                        <InfoSection title="Episode Information" icon={Briefcase}>
                            <div className="space-y-3">
                                {[
                                    { label: "Title", value: visit.episode?.title },
                                    { label: "Type", value: visit.episode?.type },
                                    { label: "Billing", value: visit.episode?.billingMode, icon: CreditCard },
                                    { label: "Status", value: visit.episode?.status },
                                ].map(
                                    (item) =>
                                        item.value && (
                                            <div key={item.label} className="flex justify-between items-start">
                                                <span className="text-sm text-muted">
                                                    {item.icon && <item.icon className="w-3 h-3 inline mr-1" />}
                                                    {item.label}:
                                                </span>
                                                <span className="text-sm font-medium text-foreground">
                                                    {item.value}
                                                </span>
                                            </div>
                                        )
                                )}
                            </div>
                        </InfoSection>

                        <InfoSection title="Visit Information" icon={Activity}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted">Status:</span>
                                    <span className="text-sm font-medium text-foreground">{visit.status}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-muted">Total Charge:</span>
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1">
                                        <DollarSign className="w-3 h-3" />
                                        {calculateTotalCharge()}
                                    </span>
                                </div>
                                <div>
                                    <h5 className="text-sm text-muted mb-1">Note:</h5>
                                    {isEditing ? (
                                        <textarea
                                            value={editForm.note}
                                            onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-foreground whitespace-pre-wrap">
                                            {visit.note || "N/A"}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-sm text-muted mb-1 flex items-center gap-1">
                                        <Pill className="w-3 h-3" />
                                        Prescribed Medicines:
                                    </h5>
                                    {isEditing ? (
                                        <textarea
                                            value={editForm.prescribedMedicines}
                                            onChange={(e) => setEditForm({ ...editForm, prescribedMedicines: e.target.value })}
                                            className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                                            rows={3}
                                            placeholder="Enter each medicine on a new line"
                                        />
                                    ) : visit.prescribedMedicines.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {visit.prescribedMedicines.map((med, index) => (
                                                <li key={index} className="text-sm font-medium text-foreground">
                                                    {med}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm font-medium text-foreground">N/A</p>
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-sm text-muted mb-1 flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        Services ({visit.services.length}):
                                    </h5>
                                    {visit.services.length > 0 ? (
                                        <ul className="space-y-1">
                                            {visit.services.map((service) => (
                                                <li key={service.id} className="text-sm font-medium text-foreground flex justify-between">
                                                    <span>{service.name}</span>
                                                    <span>${service.charge.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm font-medium text-foreground">N/A</p>
                                    )}
                                </div>
                            </div>
                        </InfoSection>
                    </div>
                </div>

                {/* Modal Footer */}
                {isEditing && (
                    <div className="p-6 border-t border-border bg-surface flex justify-end gap-4">
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditForm({
                                    note: visit.note || "",
                                    prescribedMedicines: visit.prescribedMedicines?.join("\n") || "",
                                });
                            }}
                            className="px-5 py-2.5 bg-muted/10 text-muted rounded-lg hover:bg-muted/20 transition disabled:opacity-50"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};