
import { User, X } from "lucide-react";

interface Patient {
    id: string;
    name: string;
    gender: string;
    dateOfBirth: string;
}

interface PatientInfoBannerProps {
    patient: Patient | null;
    onRemovePatient: () => void;
}

const PatientInfoBanner = ({ patient, onRemovePatient }: PatientInfoBannerProps) => {
    if (!patient) return null;

    const calculateAge = (dateOfBirth: string) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(patient.dateOfBirth);

    return (
        <div className="mb-6 p-4 bg-success/5 border border-success/20 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-success" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">
                            Creating episode for {patient.name}
                        </h3>
                        <p className="text-sm text-muted">
                            Patient ID: {patient.id.substring(0, 8)}... •{" "}
                            {patient.gender.toLowerCase()} • Age: {age}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onRemovePatient}
                    className="text-muted hover:text-foreground transition-colors p-2"
                    title="Change patient"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default PatientInfoBanner;