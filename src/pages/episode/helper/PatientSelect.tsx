import { useEffect, useState } from "react";
import { Search, ChevronDown, User } from "lucide-react";
import { usePatientStore } from "../../patient/helper/patient.store";

interface PatientSelectProps {
    value: string;
    onChange: (patientId: string) => void;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    error?: string;
}

const PatientSelect = ({
    value,
    onChange,
    disabled = false,
    label = "Patient",
    required = false,
    error,
}: PatientSelectProps) => {
    const { getAllActivePatients, patientList } = usePatientStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        setLoading(true);
        try {
            await getAllActivePatients({ page: 0, size: 100 });
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patientList.filter((patient) => {
        return (
            searchTerm === "" ||
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.contactNumber?.toString().includes(searchTerm.toLowerCase())
        );
    });

    const selectedPatient = patientList.find((patient) => patient.id === value);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-2">
                {label}
                {required && <span className="text-error ml-1">*</span>}
            </label>

            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
            w-full px-4 py-3 text-left border rounded-lg
            ${error ? "border-error" : "border-border"}
            ${disabled ? "bg-surface cursor-not-allowed" : "bg-background"}
            focus:ring-2 focus:ring-primary focus:border-transparent
            transition-colors flex items-center justify-between
          `}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {selectedPatient ? (
                            <>
                                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                                    <span className="font-medium text-primary">
                                        {getInitials(selectedPatient.name)}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-foreground truncate">
                                        {selectedPatient.name}
                                    </p>
                                    <p className="text-sm text-muted truncate">
                                        {selectedPatient.email || selectedPatient.contactNumber || "No contact info"}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <span className="text-muted">
                                Select {label.toLowerCase()}...
                            </span>
                        )}
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {isOpen && !disabled && (
                    <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-elevated max-h-96 overflow-hidden">
                        <div className="p-3 border-b border-border">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search patients by name, email, or phone..."
                                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {loading ? (
                                <div className="py-4 text-center">
                                    <div className="w-6 h-6 border-2 border-primary-light border-t-primary rounded-full animate-spin mx-auto" />
                                </div>
                            ) : filteredPatients.length === 0 ? (
                                <div className="py-8 text-center text-muted">
                                    <User className="w-8 h-8 mx-auto mb-2 text-muted/30" />
                                    No patients found
                                </div>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <button
                                        key={patient.id}
                                        type="button"
                                        onClick={() => {
                                            onChange(patient.id);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`
                      w-full px-4 py-3 text-left transition-colors hover:bg-primary-light/10
                      ${value === patient.id ? "bg-primary-light/20" : ""}
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${value === patient.id ? "bg-primary-light" : "bg-surface"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-medium ${value === patient.id
                                                        ? "text-primary"
                                                        : "text-foreground"
                                                        }`}
                                                >
                                                    {getInitials(patient.name)}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground truncate">
                                                    {patient.name}
                                                </p>
                                                <div className="flex  gap-1 mt-1">
                                                    {patient.contactNumber && (
                                                        <p className="text-sm bg-surface-light px-2 pb-1 text-muted truncate">
                                                            {patient.contactNumber}
                                                        </p>

                                                    )}
                                                    {patient.gender && (
                                                        <span className="text-xs text-primary px-2 py-1 bg-primary-light rounded self-start">
                                                            {patient.gender}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
};

export default PatientSelect;