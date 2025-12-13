import { Pagination } from "@mui/material";
import {
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Stethoscope,
    User,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../component/global/components/back/back";
import type { VisitStatus } from "../../../component/global/utils/enums";
import { formatDate } from "../../../component/global/utils/global.utils.";
import { useToast } from "../../../component/toaster/useToast";
import type { IVisit } from "../helper/vist.interface";
import { useVisitStore } from "../helper/vist.store";
import { TableHeader } from "./sub/TableHeader";
import { VisitDetailsModal } from "./sub/VisitDetailsModal";
import { VisitTableRow } from "./sub/VisitTableRow";

// Constants and configuration
const STATUS_CONFIG = {
    SCHEDULED: { color: "text-info", badge: "bg-info/10 text-info", icon: Clock },
    ONGOING: { color: "text-warning", badge: "bg-warning/10 text-warning", icon: Activity },
    COMPLETED: { color: "text-success", badge: "bg-success/10 text-success", icon: CheckCircle },
    CANCELLED: { color: "text-error", badge: "bg-error/10 text-error", icon: XCircle },
    PENDING: { color: "text-muted", badge: "bg-muted/10 text-muted", icon: AlertCircle },
} as const;

const TABLE_HEADERS = [
    { label: "Patient", icon: User, key: "patient" },
    { label: "Doctor", icon: Stethoscope, key: "doctor" },
    { label: "Episode", icon: FileText, key: "episode" },
    { label: "Timeline", icon: Clock, key: "timeline" },
    { label: "Status", icon: Activity, key: "status" },
    { label: "Actions", key: "actions", center: true },
];

const VisitTable = ({ status }: { status: string }) => {
    const {
        getVisitsByStatus,
        startVisit,
        completeVisit,
        cancelVisit,
        loading,
        visitList,
        filter,
        setFilter,
        setStartDate,
        setEndDate,
        updateVisit,
    } = useVisitStore();

    const navigate = useNavigate();
    const { showToast } = useToast();

    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalVisits, setTotalVisits] = useState(0);
    const [selectedVisit, setSelectedVisit] = useState<IVisit | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialize filter from prop
    useEffect(() => {
        if (status) {
            setFilter(status as VisitStatus);
            loadVisits(status as VisitStatus, 0);
        }
    }, [status]);

    // Load visits when page or filter changes
    useEffect(() => {
        loadVisits(filter, page);
    }, [page, filter]);

    const loadVisits = async (statusFilter?: VisitStatus | string, currentPage?: number) => {
        try {
            const response = await getVisitsByStatus(
                (statusFilter || filter || "PENDING") as VisitStatus,
                currentPage ?? page,
                size
            );

            if (response?.data?.totalPages) setTotalPages(response.data.totalPages);
            if (response?.data?.totalElements) setTotalVisits(response.data.totalElements);
        } catch (error) {
            console.error("Failed to load visits:", error);
            showToast("Failed to load visits", "error");
        }
    };

    const handleStatusAction = async (action: "start" | "complete" | "cancel", visitId: string) => {
        try {
            if (action === "start") await startVisit(visitId);
            if (action === "complete") await completeVisit(visitId);
            if (action === "cancel") await cancelVisit(visitId);

            showToast(`Visit ${action}ed successfully`, "success");
            loadVisits();
        } catch (error) {
            console.error(`Failed to ${action} visit:`, error);
            showToast(`Failed to ${action} visit`, "error");
        }
    };

    const handleVisitUpdate = async (visitId: string, data: { note: string; prescribedMedicines: string[] }) => {
        try {
            const res = await updateVisit(visitId, {
                note: data.note,
                prescribedMedicines: data.prescribedMedicines,
                episodeId: "",
                patientId: "",
                doctorId: ""
            });

            showToast(res.message, res.severity);
            loadVisits();
            return true;
        } catch (error) {
            console.error("Failed to update visit:", error);
            showToast("Failed to update visit", "error");
            return false;
        }
    };

    const handleViewDetails = (visit: IVisit) => {
        setSelectedVisit(visit);
        setIsModalOpen(true);
    };

    const handleDateChange = {
        start: (date: string) => setStartDate(date),
        end: (date: string) => setEndDate(date),
    };

    const filteredVisits = searchTerm
        ? visitList.filter(
            (visit) =>
                visit.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visit.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visit.episode?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                visit.status?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : visitList;

    return (
        <div className="max-w-7xl mx-auto">
            <BackButton className="mb-6" />

            <TableHeader
                title="Visit Management"
                subtitle="Track and manage all patient visits efficiently"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterStatus={filter}
                onFilterChange={(value) => {
                    setFilter(value as VisitStatus);
                    setPage(0);
                }}
                onStartDateChange={handleDateChange.start}
                onEndDateChange={handleDateChange.end}
            />

            <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-primary/5 border-b border-border">
                                {TABLE_HEADERS.map((header) => (
                                    <th
                                        key={header.key}
                                        className={`px-6 py-4 text-left ${header.center ? "text-center" : ""}`}
                                    >
                                        <div className={`flex items-center gap-2 ${header.center ? "justify-center" : ""}`}>
                                            {header.icon && <header.icon className="w-4 h-4 text-primary" />}
                                            <span className="text-sm font-semibold text-foreground">{header.label}</span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableLoadingState />
                            ) : filteredVisits.length === 0 ? (
                                <TableEmptyState searchTerm={searchTerm} filter={filter} />
                            ) : (
                                filteredVisits.map((visit) => (
                                    <VisitTableRow
                                        key={visit.id}
                                        visit={visit}
                                        statusConfig={STATUS_CONFIG}
                                        onStatusAction={handleStatusAction}
                                        onViewDetails={handleViewDetails}
                                        formatDate={formatDate}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <TablePagination
                        currentPage={page + 1}
                        totalPages={totalPages}
                        totalVisits={totalVisits}
                        onPageChange={(page) => setPage(page - 1)}
                    />
                )}
            </div>

            {isModalOpen && selectedVisit && (
                <VisitDetailsModal
                    visit={selectedVisit}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedVisit(null);
                    }}
                    onUpdate={handleVisitUpdate}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
};

// Sub-components for better organization

const TableLoadingState = () => (
    <tr>
        <td colSpan={6} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted font-medium">Loading visits...</p>
            </div>
        </td>
    </tr>
);

const TableEmptyState = ({ searchTerm, filter }: { searchTerm: string; filter: string }) => (
    <tr>
        <td colSpan={6} className="px-6 py-16 text-center">
            <AlertCircle className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted font-semibold text-lg mb-1">No visits found</p>
            <p className="text-sm text-muted">
                {searchTerm
                    ? "Try adjusting your search term"
                    : filter
                        ? `No ${filter.toLowerCase()} visits found`
                        : "No visits available"}
            </p>
        </td>
    </tr>
);

const TablePagination = ({
    currentPage,
    totalPages,
    totalVisits,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    totalVisits: number;
    onPageChange: (page: number) => void;
}) => (
    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-border bg-surface gap-4">
        <p className="text-sm text-muted">
            Showing page {currentPage} of {totalPages} • {totalVisits} total visits
        </p>
        <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            size="small"
        />
    </div>
);

export default VisitTable;