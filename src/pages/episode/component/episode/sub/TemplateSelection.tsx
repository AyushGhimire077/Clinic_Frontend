import { Check, ChevronDown, ChevronUp, FileText, X } from "lucide-react";
import type { IEpisodeTemp } from "../../../helper/episode.interface";
import { useEffect } from "react";



interface TemplateSelectionProps {
    episodeTemplateList: IEpisodeTemp[];
    selectedTemplateId: string;
    onTemplateSelect: (templateId: string) => void;
    showTemplateDropdown: boolean;
    onToggleDropdown: () => void;
    form: {
        patientId: string;
        primaryDoctorId: string;
        title: string;
        startDate: string;
        type: string;
        status: string;
        billingMode: string;
        packageCharge: number;
    };
}

const TemplateSelection = ({
    episodeTemplateList,
    selectedTemplateId,
    onTemplateSelect,
    showTemplateDropdown,
    onToggleDropdown,
    form,
}: TemplateSelectionProps) => {
    const templateOptions = episodeTemplateList.map((template) => ({
        value: template.id,
        label: `${template.title} • ${template.type} • Rs. ${template.packageCharge}`,
        template,
    }));

    const selectedTemplate = episodeTemplateList.find(
        (t) => t.id === selectedTemplateId
    );

    // set form fields when template changes
    useEffect(() => {
        if (selectedTemplate) {
            form.type = selectedTemplate.type;
            form.billingMode = selectedTemplate.billingMode;
            form.packageCharge = selectedTemplate.packageCharge;

        } else {
            form.type = "";
            form.billingMode = "";
            form.packageCharge = 0;
        }
    }, [selectedTemplateId, selectedTemplate, form]);

    return (
        <div className="mb-8 relative">
            <label className="block text-sm font-medium text-foreground mb-2">
                Template (optional)
            </label>

            <button
                type="button"
                onClick={onToggleDropdown}
                className="w-full bg-surface border border-border rounded-lg p-4 flex items-center justify-between hover:bg-surface/80 transition-colors duration-200"
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted" />
                    <span className="text-sm font-medium">
                        {selectedTemplate
                            ? selectedTemplate.title
                            : "No template selected"}
                    </span>
                    {selectedTemplate && (
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            Applied
                        </span>
                    )}
                </div>
                {showTemplateDropdown ? (
                    <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted" />
                )}
            </button>

            {showTemplateDropdown && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-border rounded-xl shadow-lg">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground">Select Template</h3>
                            <span className="text-xs text-muted bg-surface px-2 py-1 rounded">
                                Auto-fill
                            </span>
                        </div>

                        {episodeTemplateList.length === 0 ? (
                            <div className="p-4 text-center text-muted text-sm">
                                No templates available
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <select
                                    value={selectedTemplateId}
                                    onChange={(e) => onTemplateSelect(e.target.value)}
                                    className="w-full p-2 border border-border rounded-lg"
                                >
                                    <option value="">Select a template (optional)</option>
                                    {templateOptions.map(({ value, label }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>

                                {selectedTemplate && (
                                    <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-success" />
                                                <span className="font-medium">
                                                    {selectedTemplate.title}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => onTemplateSelect("")}
                                                className="text-muted hover:text-foreground"
                                                title="Remove template"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="text-center p-2 bg-white rounded border">
                                                <div className="text-muted">Type</div>
                                                <div className="font-medium">{selectedTemplate.type}</div>
                                            </div>
                                            <div className="text-center p-2 bg-white rounded border">
                                                <div className="text-muted">Billing</div>
                                                <div className="font-medium">
                                                    {selectedTemplate.billingMode}
                                                </div>
                                            </div>
                                            <div className="text-center p-2 bg-white rounded border">
                                                <div className="text-muted">Charge</div>
                                                <div className="font-medium text-primary">
                                                    Rs. {selectedTemplate.packageCharge.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSelection;