import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Loader2,
  Plus,
  RefreshCcw,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../../component/global/components/back/back";
import { Pagination } from "../../../../component/global/components/Pagination";
import { SearchInput } from "../../../../component/global/components/SearchInput";

import type { IEpisode } from "../../helper/episode.interface";
import { useEpisodeStore } from "../../helper/episode.store";


const formatDoctorInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

const getTodayDateString = () => new Date().toISOString().split("T")[0];

// DateSelector Component
const DateSelector: React.FC<{
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear?: () => void;
  start?: string;
  end?: string;
  onApply?: () => void;
}> = ({
  onStartDateChange,
  onEndDateChange,
  onClear,
  start,
  end,
  onApply,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempStartDate, setTempStartDate] = useState<string>(start || "");
    const [tempEndDate, setTempEndDate] = useState<string>(end || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToday = () => {
      const today = getTodayDateString();
      setTempStartDate(today);
      setTempEndDate(today);
    };

    const handleApply = () => {
      onStartDateChange(tempStartDate);
      onEndDateChange(tempEndDate);
      if (onApply) onApply();
      setIsOpen(false);
    };

    const handleReset = () => {
      setTempStartDate("");
      setTempEndDate("");
      onStartDateChange("");
      onEndDateChange("");
      if (onClear) onClear();
      setIsOpen(false);
    };

    const isActive = start || end;

    return (
      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 ${isActive
            ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
            : "border-border hover:border-primary hover:bg-surface text-foreground"
            } ${isOpen ? "ring-2 ring-primary/20" : ""}`}
        >
          <Calendar className="w-4 h-4" />
          <span className="font-medium">
            {start && end
              ? `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`
              : start
                ? `From: ${formatDateForDisplay(start)}`
                : end
                  ? `To: ${formatDateForDisplay(end)}`
                  : "Select Dates"}
          </span>
          {isActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="ml-1 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full mt-2 right-0 w-80 bg-surface border border-border rounded-xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Select Date Range
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface transition-colors"
                >
                  <X className="w-4 h-4 text-muted" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    max={tempEndDate || undefined}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    min={tempStartDate || undefined}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Quick Select</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleToday}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface transition-colors"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const yesterday = new Date(today);
                      yesterday.setDate(yesterday.getDate() - 1);
                      setTempStartDate(yesterday.toISOString().split("T")[0]);
                      setTempEndDate(yesterday.toISOString().split("T")[0]);
                    }}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface transition-colors"
                  >
                    Yesterday
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const last7Days = new Date(today);
                      last7Days.setDate(last7Days.getDate() - 7);
                      setTempStartDate(last7Days.toISOString().split("T")[0]);
                      setTempEndDate(today.toISOString().split("T")[0]);
                    }}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface transition-colors"
                  >
                    Last 7 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date();
                      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                      setTempStartDate(firstDayOfMonth.toISOString().split("T")[0]);
                      setTempEndDate(today.toISOString().split("T")[0]);
                    }}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface transition-colors"
                  >
                    This Month
                  </button>
                </div>
              </div>

              {(tempStartDate || tempEndDate) && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-sm text-foreground">
                    {tempStartDate && tempEndDate
                      ? `Selected: ${formatDateForDisplay(tempStartDate)} - ${formatDateForDisplay(tempEndDate)}`
                      : tempStartDate
                        ? `From: ${formatDateForDisplay(tempStartDate)}`
                        : `To: ${formatDateForDisplay(tempEndDate)}`}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-surface">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-error transition-colors"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:bg-surface rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

// Import X and Check from lucide-react
import { X, Check } from "lucide-react";
import { formatCurrency, formatDate, formatDateForDisplay, getBillingModeTag, getStatusColor, getTypeColor } from "../../../../component/utils/ui.helpers";

const EpisodeTable = () => {
  const navigate = useNavigate();
  const {
    episodeList,
    pagination,
    count,
    getAllEpisodes,
    filterByStatus,
    countEpisodes,
    searchEpisodes,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
  } = useEpisodeStore();

  const pageSize = 10;
  const today = getTodayDateString();

  // Local UI State
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if viewing today's episodes
  const isViewingToday = useMemo(() => {
    if (!startDate || !endDate) return false;
    return startDate === today && endDate === today;
  }, [startDate, endDate, today]);

  // Check if date filter is active
  const isDateFilterActive = useMemo(() => {
    return !!startDate || !!endDate;
  }, [startDate, endDate]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await countEpisodes();
      const params = { page, size: pageSize };

      if (debouncedSearch.trim()) {
        await searchEpisodes(debouncedSearch.trim(), params);
      } else if (statusFilter) {
        await filterByStatus(statusFilter, params);
      } else if (startDate || endDate) {
        // Fetch with date filter
        await getAllEpisodes(params); // This should accept date filters
      } else {
        await getAllEpisodes(params);
      }
    } catch (err) {
      setError("Failed to load episodes. Please try again.");
      console.error("Error fetching episodes:", err);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    statusFilter,
    startDate,
    endDate,
    countEpisodes,
    searchEpisodes,
    filterByStatus,
    getAllEpisodes,
  ]);

  // Initial fetch and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply date filter
  const applyDateFilter = useCallback(() => {
    // Dates are already applied via onStartDateChange and onEndDateChange
    setPage(0);
  }, []);

  // Reset all filters
  const refreshData = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPage(0);
    setStartDate("");
    setEndDate("");
  }, [setStartDate, setEndDate]);

  // Quick filter for today
  const viewTodayEpisodes = useCallback(() => {
    setStartDate(today);
    setEndDate(today);
    setPage(0);
  }, [today, setStartDate, setEndDate]);

  // Memoized stats
  const stats = useMemo(
    () => [
      {
        label: "Total Episodes",
        value: count?.TOTAL || 0,
        icon: CalendarDays,
        color: "text-primary",
      },
      {
        label: "Active",
        value: count?.ACTIVE || 0,
        icon: CheckCircle,
        color: "text-success",
      },
      {
        label: "Completed",
        value: count?.COMPLETED || 0,
        icon: Calendar,
        color: "text-info",
      },
      {
        label: "Cancelled",
        value: count?.CANCELLED || 0,
        icon: AlertCircle,
        color: "text-error",
      },
    ],
    [count]
  );

  // Handle local date changes
  const handleLocalStartChange = useCallback((date: string) => {
    setStartDate(date);
  }, [setStartDate]);

  const handleLocalEndChange = useCallback((date: string) => {
    setEndDate(date);
  }, [setEndDate]);

  return (
    <div className="max-w-[90em] mx-auto p-4 md:p-6 space-y-6">
      {/* Top Section with Back Button, Title, and Actions */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-2">
          <BackButton className="mb-2" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Episode Management</h1>
            <p className="text-muted">Track and manage patient treatment episodes</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <DateSelector
            onStartDateChange={handleLocalStartChange}
            onEndDateChange={handleLocalEndChange}
            onClear={refreshData}
            start={startDate ?? ""}
            end={endDate ?? ""}
            onApply={applyDateFilter}
          />

          <div className="flex items-center gap-3">
            <button
              onClick={viewTodayEpisodes}
              className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${isViewingToday
                ? "bg-primary/10 border-primary text-primary"
                : "border-border hover:bg-surface text-foreground"
                }`}
            >
              <Eye className="w-4 h-4" />
              <span>Today's Episodes</span>
            </button>

            <button
              onClick={() => navigate("/episode/add")}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 focus-ring shadow-soft"
            >
              <Plus className="w-5 h-5" />
              <span>New Episode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Indicator */}
      {isDateFilterActive && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-primary">Date Filter Active</p>
                <p className="text-xs text-muted">
                  {startDate && `From: ${formatDateForDisplay(startDate)}`}
                  {endDate && startDate && ` • To: ${formatDateForDisplay(endDate)}`}
                  {endDate && !startDate && `To: ${formatDateForDisplay(endDate)}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs font-medium text-primary hover:text-primary-dark underline"
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface border border-border rounded-xl p-5 hover:shadow-soft transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search episodes by patient, doctor, or episode title..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <button
              onClick={refreshData}
              className="px-4 py-2.5 rounded-lg border border-border hover:bg-surface flex items-center gap-2 transition-colors"
              title="Reset all filters"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={fetchData}
              className="ml-auto text-sm font-medium hover:underline"
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-foreground font-medium">Loading episodes...</p>
              <p className="text-sm text-muted mt-2">Please wait a moment</p>
            </div>
          ) : episodeList.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="w-20 h-20 mx-auto mb-6 text-muted/30" />
              <p className="text-xl font-medium text-foreground mb-2">
                No episodes found
              </p>
              <p className="text-muted max-w-md mx-auto mb-6">
                {searchQuery.trim() || statusFilter || isDateFilterActive
                  ? "Try adjusting your search criteria or clearing your filters."
                  : "Start by creating your first treatment episode."}
              </p>
              {!(searchQuery.trim() || statusFilter || isDateFilterActive) && (
                <button
                  onClick={() => navigate("/episode/add")}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Episode
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header with Summary */}
              <div className="px-6 py-4 bg-surface border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Showing {episodeList.length} of {pagination?.totalItems || 0} episodes
                      {isDateFilterActive && (
                        <span className="ml-2 inline-block w-2 h-2 bg-success rounded-full" title="Custom date filter applied"></span>
                      )}
                    </h3>
                    {isViewingToday && (
                      <p className="text-sm text-success mt-1">
                        Today's episodes ({formatDateForDisplay(today)})
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-muted">
                    Page {page + 1} of {pagination?.totalPages || 1}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      {["Episode", "Patient", "Doctor", "Dates", "Type", "Charge", "Status"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {episodeList.map((episode: IEpisode) => {
                      const billingTag = getBillingModeTag(episode.billingMode);
                      const isToday = formatDate(episode.startDate) === formatDate(today);

                      return (
                        <tr
                          key={episode.id}
                          className="hover:bg-primary-light/5 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/episode/view/${episode.id}`)}
                        >
                          {/* Episode */}
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              {isToday && (
                                <span className="mt-1 w-2 h-2 bg-info rounded-full  shrink-0" title="Today's episode"></span>
                              )}
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {episode.title}
                                </p>
                                <span
                                  className={`inline-block mt-1 px-2.5 py-1 text-xs font-medium rounded-full border ${billingTag.className}`}
                                >
                                  {billingTag.label}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Patient */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center border border-border shrink-0">
                                <User className="w-5 h-5 text-muted" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {episode.patient.name}
                                </p>
                                <p className="text-sm text-muted truncate">
                                  {episode.patient.id || "No ID"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Doctor */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                <span className="font-bold text-primary text-sm">
                                  {formatDoctorInitials(episode.primaryDoctor.name)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  Dr. {episode.primaryDoctor.name}
                                </p>
                                <p className="text-sm text-muted truncate">
                                  {episode.primaryDoctor.doctorSubType || "General"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted shrink-0" />
                                <span className="text-sm text-foreground whitespace-nowrap">
                                  {formatDate(episode.startDate)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted/60 shrink-0" />
                                <span className={`text-sm px-2 py-1 rounded-full whitespace-nowrap ${episode?.endDate
                                  ? "text-muted"
                                  : "text-warning bg-warning/10"
                                  }`}>
                                  {episode?.endDate ? formatDate(episode.endDate) : "PENDING"}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${getTypeColor(
                                episode.type
                              )}`}
                            >
                              {episode.type === "ONE_TIME" ? "One Time" : "Recurring"}
                            </span>
                          </td>

                          {/* Charge */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-success shrink-0" />
                              <span className="font-bold text-foreground whitespace-nowrap">
                                {formatCurrency(episode.packageCharge)}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                                episode.status
                              )}`}
                            >
                              {episode.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-border">
                <Pagination
                  currentPage={pagination?.currentPage || 0}
                  totalPages={pagination?.totalPages || 1}
                  onPageChange={setPage}

                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeTable;