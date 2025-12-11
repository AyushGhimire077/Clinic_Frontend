import { Plus, AlertCircle } from "lucide-react";
import type { EpisodeRequest } from "../../../helper/episode.interface";


interface FormActionsProps {
    loading: boolean;
    patientLoading: boolean;
    selectedTemplateId: string;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    form: EpisodeRequest;
    onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

}

const FormActions = ({
    loading,
    form,
    patientLoading,
    onCancel,
    onSubmit,
    onFieldChange
}: FormActionsProps) => {

    const isSubmitting = loading || patientLoading;
    const isDisabled = !form.patientId || !form.primaryDoctorId || !form.title || !form.type || !form.status || !form.billingMode || form.packageCharge <= 0;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) {
            return;
        }
        onFieldChange(e);
    }


    return (
        <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row-reverse gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={onSubmit}
                        className="px-8 py-3 bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {form.appointment ? "Proceed to Appointment..." : "Creating Episode..."}
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                {form.appointment ? "Proceed to Appointment" : "Create Episode"}
                            </>
                        )}
                    </button>
                </div>

                <div className="px-4">
                    <label className="flex items-center gap-2 mt-2 sm:mt-0">
                        <input
                            type="checkbox"
                            name="appointment"
                            checked={form.appointment}
                            onChange={handleCheckboxChange}
                            disabled={isDisabled}
                            className="leading-tight w-4 h-4 text-primary"
                        />
                        <span className="text-[15px] text-foreground">Schedule as Appointment</span>
                    </label>
                </div>
            </div>

            <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                            Before creating an episode
                        </p>
                        <ul className="text-xs text-muted space-y-1">
                            <li>• Ensure patient and doctor details are correct</li>
                            <li>• Verify package charge is accurate</li>
                            <li>• Check that the start date is set correctly</li>
                            <li>• All fields marked with * are required</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormActions;