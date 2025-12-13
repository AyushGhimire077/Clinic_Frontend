import {
    AlertCircle,
    Calendar,
    CheckSquare,
    Clock,
    Droplet,
    Eye,
    Phone,
    Play,
    User,
    X
} from "lucide-react";
import type { IVisit } from "../../helper/vist.interface";

interface StatusConfig {
    [key: string]: {
        color: string;
        badge: string;
        icon: any;
    };
}

interface VisitTableRowProps {
    visit: IVisit;
    statusConfig: StatusConfig;
    onStatusAction: (action: "start" | "complete" | "cancel", visitId: string) => void;
    onViewDetails: (visit: IVisit) => void;
    formatDate: any
}

export const VisitTableRow = ({
    visit,
    statusConfig,
    onStatusAction,
    onViewDetails,
    formatDate,
}: VisitTableRowProps) => {
    const StatusIcon = statusConfig[visit.status]?.icon || AlertCircle;

    return (
        <tr
            className="border-b border-border hover:bg-primary/5 cursor-pointer transition-colors group"
            onClick={() => onViewDetails(visit)}
        >
            {/* Patient Column */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">
                            {visit.patient?.name || "N/A"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted mt-1">
                            <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {visit.patient?.contactNumber || "N/A"}
                            </span>
                            {visit.patient?.bloodGroup && (
                                <span className="flex items-center gap-1">
                                    <Droplet className="w-3 h-3" />
                                    {visit.patient.bloodGroup}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* Doctor Column */}
            <td className="px-6 py-4">
                <div className="font-medium text-foreground">
                    {visit.doctor?.name || "N/A"}
                </div>
                {visit.doctor?.doctorSubType && (
                    <div className="text-xs text-muted mt-1">
                        {visit.doctor.doctorSubType}
                    </div>
                )}
            </td>

            {/* Episode Column */}
            <td className="px-6 py-4">
                <div className="font-medium text-foreground mb-1">
                    {visit.episode?.title || "N/A"}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {visit.episode?.type && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            {visit.episode.type}
                        </span>
                    )}
                    {visit.episode?.billingMode && (
                        <span className="text-xs px-2 py-0.5 rounded bg-success/10 text-success font-medium">
                            {visit.episode.billingMode}
                        </span>
                    )}
                </div>
            </td>

            {/* Timeline Column */}
            <td className="px-6 py-4">
                <div className="text-xs space-y-1">
                    <div className="flex items-center gap-1 text-muted">
                        <Calendar className="w-3 h-3" />
                        <span className="font-medium">Created:</span>
                    </div>
                    <div className="text-foreground">
                        {visit.createdAt ? formatDate(visit.createdAt) : "N/A"}
                    </div>
                    {visit.updatedAt && visit.updatedAt !== visit.createdAt && (
                        <>
                            <div className="flex items-center gap-1 text-muted mt-2">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">Updated:</span>
                            </div>
                            <div className="text-foreground">
                                {formatDate(visit.updatedAt)}
                            </div>
                        </>
                    )}
                </div>
            </td>

            {/* Status Column */}
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig[visit.status]?.badge || "bg-muted/10 text-muted"
                        }`}
                >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {visit.status}
                </span>
                {visit.isActive !== undefined && (
                    <div className="text-xs text-muted mt-1">
                        {visit.isActive ? "Active" : "Inactive"}
                    </div>
                )}
            </td>

            {/* Actions Column */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    {visit.status === "SCHEDULED" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusAction("start", visit.id);
                            }}
                            className="p-2 hover:bg-success/10 rounded-lg transition-colors"
                            title="Start Visit"
                        >
                            <Play className="w-4 h-4 text-success" />
                        </button>
                    )}
                    {visit.status === "ONGOING" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusAction("complete", visit.id);
                            }}
                            className="p-2 hover:bg-success/10 rounded-lg transition-colors"
                            title="Complete Visit"
                        >
                            <CheckSquare className="w-4 h-4 text-success" />
                        </button>
                    )}
                    {["PENDING", "SCHEDULED", "ONGOING"].includes(visit.status) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusAction("cancel", visit.id);
                            }}
                            className="p-2 hover:bg-error/10 rounded-lg transition-colors"
                            title="Cancel Visit"
                        >
                            <X className="w-4 h-4 text-error" />
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(visit);
                        }}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4 text-primary" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

