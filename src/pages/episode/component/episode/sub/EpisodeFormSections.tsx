import { Calendar, CreditCard, FileText, User } from "lucide-react";
import { billingModeOptions, episodeTypeOptions, statusOptions } from "../../../../../component/constant/select";
import { inputField } from "../../../../../component/global/components/customStyle";
import type { EpisodeRequest } from "../../../helper/episode.interface";
import DoctorStaffSelect from "../../../utils/DoctorStaffSelect";
import PatientSelect from "../../../utils/PatientSelect";

interface EpisodeFormSectionsProps {
    form: EpisodeRequest;
    selectedPatient: any;
    patientLoading: boolean;
    loading: boolean;
    minDate: string;
    onPatientSelect: (id: string) => void;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EpisodeFormSections = ({
    form,
    selectedPatient,
    patientLoading,
    loading,
    minDate,
    onPatientSelect,
    onFieldChange,
}: EpisodeFormSectionsProps) => {
    return (
        <div className="space-y-6">
            {/* Patient and Doctor Selection */}
            <div className="bg-surface rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Patient & Doctor Details
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <PatientSelect
                            value={form.patientId}
                            onChange={onPatientSelect}
                            label="Select Patient *"
                            required
                            disabled={patientLoading || !!selectedPatient}
                        />
                        {form.patientId && !selectedPatient && (
                            <p className="text-xs text-muted mt-2">
                                Patient selected but details not loaded
                            </p>
                        )}
                    </div>

                    <div>
                        <DoctorStaffSelect
                            value={form.primaryDoctorId}
                            onChange={(id) =>
                                onFieldChange({
                                    target: { name: "primaryDoctorId", value: id },
                                } as any)
                            }
                            label="Select Doctor *"
                            required
                            filterType="DOCTOR"
                        />
                    </div>
                </div>
            </div>

            {/* Episode Details */}
            <div className="bg-surface rounded-xl p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Episode Details
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div  >
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
                            onChange={onFieldChange}
                            placeholder="Physical Therapy Session, Follow-up Consultation"
                            className={`${inputField} bg-white w-full`}
                            required
                            disabled={loading}
                        />
                        <p className="text-xs text-muted mt-2">
                            Descriptive title for the treatment episode
                        </p>
                    </div>




                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Start Date *
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-muted pointer-events-none" />
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={form.startDate}
                                onChange={onFieldChange}
                                min={minDate}
                                className={`${inputField} pl-10 bg-white w-full`}
                                required
                                disabled={loading}
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
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-muted pointer-events-none" />
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={onFieldChange}
                                className={`${inputField} pl-10 bg-white w-full`}
                                required
                                disabled={loading}
                            >
                                <option value="">Select episode type</option>
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
                            onChange={onFieldChange}
                            className={`${inputField} bg-white w-full`}
                            required
                            disabled={loading}
                        >
                            <option value="">Select status</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="billingMode"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Billing Mode *
                        </label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3 w-5 h-5 text-muted pointer-events-none" />
                            <select
                                id="billingMode"
                                name="billingMode"
                                value={form.billingMode}
                                onChange={onFieldChange}
                                className={`${inputField} pl-10 bg-white w-full`}
                                required
                                disabled={loading}
                            >
                                <option value="">Select billing mode</option>
                                {billingModeOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-muted mt-2">
                            How this episode will be billed
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="packageCharge"
                            className="block text-sm font-medium text-foreground mb-2"
                        >
                            Package Charge (Rs.) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-[17px] text-muted pointer-events-none">
                                Rs.
                            </span>
                            <input
                                id="packageCharge"
                                name="packageCharge"
                                type="tel"
                                min="0"
                                step="0.01"
                                value={form.packageCharge}
                                onChange={onFieldChange}
                                placeholder="0.00"
                                className={`${inputField} pl-10 bg-white w-full`}
                                required
                                disabled={loading}
                            />
                        </div>
                        <p className="text-xs text-muted mt-2">
                            Total charge for this episode
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default EpisodeFormSections;