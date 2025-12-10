import { AlertCircle, Plus } from "lucide-react";

interface FormActionsProps {
    loading: boolean;
    patientLoading: boolean;
    selectedTemplateId: string;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const FormActions = ({
    loading,
    patientLoading,
    selectedTemplateId,
    onCancel,
    onSubmit,
}: FormActionsProps) => {
    return (
        <div className="pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-surface transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading || patientLoading}
                    className="px-8 py-3 bg-linear-to-r from-primary to-primary-dark text-white font-semibold rounded-lg hover:from-primary-dark hover:to-primary transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    onClick={onSubmit}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating Episode...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            {selectedTemplateId ? "Create from Template" : "Create Episode"}
                        </>
                    )}
                </button>
            </div>

            <div className="mt-6 p-4 bg-background rounded-lg border border-border">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-muted  shrink-0 mt-0.5" />
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