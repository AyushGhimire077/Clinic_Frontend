import { CalendarCheck, ChevronRight, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVisitStore } from "./helper/vist.store";
import { visitStatusOptions } from "../../component/global/utils/select";
import VisitTable from "./component/VistiTable";
import type { VisitStatus } from "../../component/global/utils/enums";
import DateSelector from "../../component/global/components/DateSelector";

const VisitDashboard = () => {
    const [activeTab, setActiveTab] = useState<"visits" | "today">("visits");
    const navigate = useNavigate();

    const { countByStatus, setStartDate, setEndDate, startDate, endDate } = useVisitStore();
    const [statusCounts, setStatusCounts] = useState<Record<VisitStatus, number>>();

    const fetchVisitCounts = async () => {
        const counts: Record<string, number> = {};

        for (const status of visitStatusOptions) {
            const res = await countByStatus(status.value);
            counts[status.value] = res.data || 0;
        }

        setStatusCounts(counts);
    };

    useEffect(() => {
        // When date changes, refetch counts
        fetchVisitCounts();
    }, [startDate, endDate]);

    const handleNavigation = (path: string) => navigate(path);

    const handleStartDateChange = (date: string) => {
        setStartDate(date ?? "");
    };

    const handleEndDateChange = (date: string) => {
        setEndDate(date ?? "");
    };



    const tabs = [
        {
            id: "visits",
            label: "Visit Management",
            cards: [
                {
                    title: "Add Visit",
                    description: "Register a new patient visit",
                    icon: CalendarCheck,
                    color: "from-primary to-primary-dark",
                    onClick: () => handleNavigation("view"),
                },
                {
                    title: "View Visits",
                    description: "Browse and manage all visits",
                    icon: ClipboardList,
                    color: "from-success to-success",
                    onClick: () => handleNavigation("view"),
                },
            ],
        },
        { id: "today", label: "Today's Pending" },
    ];




    const currentTab = tabs.find((tab) => tab.id === activeTab);

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">

                {/* DATE SELECTOR */}
                {activeTab === "visits" && (
                    <DateSelector
                        onStartDateChange={handleStartDateChange}
                        onEndDateChange={handleEndDateChange}
                    />
                )}

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-primary-dark shadow-soft">
                        <CalendarCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mt-4">
                        Visit Management
                    </h1>
                    <p className="text-muted text-sm">Manage patient visits efficiently</p>
                </div>

                {/* TABS */}
                <div className="flex bg-surface rounded-2xl shadow-soft p-1 mb-8 max-w-md mx-auto border border-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-2.5 px-4 text-sm duration-300 font-medium rounded-xl transition-colors ${activeTab === tab.id
                                ? "bg-primary text-white"
                                : "text-muted hover:bg-primary-light hover:text-foreground"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CARDS */}
                {currentTab?.cards && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {currentTab.cards.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.title}
                                    className="text-left bg-surface rounded-xl p-6 border border-border shadow-soft hover:bg-primary-light/40 transition-all"
                                    onClick={item.onClick}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center shadow-soft`}
                                        >
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg text-foreground mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-muted">{item.description}</p>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* OVERVIEW BOXES */}
                {activeTab === "visits" && (
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-primary">
                                {(statusCounts?.PENDING || 0) +
                                    (statusCounts?.ONGOING || 0) +
                                    (statusCounts?.COMPLETED || 0) +
                                    (statusCounts?.CANCELLED || 0) +
                                    (statusCounts?.SCHEDULED || 0)}
                            </div>
                            <div className="text-sm text-muted">Total Visits</div>
                        </div>
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-success">{statusCounts?.ONGOING || 0}</div>
                            <div className="text-sm text-muted">Ongoing Visits</div>
                        </div>
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-warning">{statusCounts?.PENDING || 0}</div>
                            <div className="text-sm text-muted">Pending Visits</div>
                        </div>
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-danger">{statusCounts?.CANCELLED || 0}</div>
                            <div className="text-sm text-muted">Cancelled Visits</div>
                        </div>
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-info">{statusCounts?.SCHEDULED || 0}</div>
                            <div className="text-sm text-muted">Scheduled Visits</div>
                        </div>
                        <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
                            <div className="text-3xl font-bold text-info">{statusCounts?.COMPLETED || 0}</div>
                            <div className="text-sm text-muted">Completed Visits</div>
                        </div>
                    </div>
                )}
            </div>

            {/* TABLE */}
            {activeTab === "today" && (
                <div className="mt-12 max-w-7xl mx-auto">
                    <VisitTable status="PENDING" />
                </div>
            )}
        </div>
    );
};

export default VisitDashboard;
