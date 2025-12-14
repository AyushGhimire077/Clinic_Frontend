import { Calendar, CalendarDays, Check, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { formatDateForDisplay } from "../../../utils/ui.helpers";

interface DateSelectorProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onClear?: () => void;
    start?: string;
    end?: string;
    onApply?: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
    onStartDateChange,
    onEndDateChange,
    onClear,
    start,
    end,

    onApply,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<string>(start || "");
    const [endDate, setEndDate] = useState<string>(end || "");
    const [tempStartDate, setTempStartDate] = useState<string>(start || "");
    const [tempEndDate, setTempEndDate] = useState<string>(end || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setStartDate(start || "");
        setTempStartDate(start || "");
        setEndDate(end || "");
        setTempEndDate(end || "");
    }, [start, end]);

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

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempStartDate(e.target.value);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempEndDate(e.target.value);
    };

    const handleToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setTempStartDate(today);
        setTempEndDate(today);
    };

    const handleApply = () => {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        onStartDateChange(tempStartDate);
        onEndDateChange(tempEndDate);
        if (onApply) onApply();
        setIsOpen(false);
    };

    const handleReset = () => {
        setTempStartDate("");
        setTempEndDate("");
        setStartDate("");
        setEndDate("");
        onStartDateChange("");
        onEndDateChange("");
        setIsOpen(false);

        if (onClear) onClear();
    };

    const formatDisplayDate = (date: string) => {
        if (!date) return "";
        const [month, day] = date.split("-");
        return `${day}/${month}`;
    };

    const getDisplayText = () => {
        if (startDate && endDate) {
            return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;
        }
        return "Select Dates";
    };

    const isActive = startDate || endDate;

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
                <span className="font-medium">{getDisplayText()}</span>
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
                    {/* Header */}
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

                    {/* Content */}
                    <div className="p-4 space-y-4">
                        {/* Date Inputs */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={tempStartDate}
                                        onChange={handleStartChange}
                                        max={tempEndDate || undefined}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">
                                    End Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={tempEndDate}
                                        onChange={handleEndChange}
                                        min={tempStartDate || undefined}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
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

                        {/* Selected Dates Preview */}
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

                    {/* Footer */}
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



export default DateSelector;