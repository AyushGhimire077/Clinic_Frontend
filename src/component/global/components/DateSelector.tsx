import React, { useState } from "react";

interface DateSelectorProps {
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ onStartDateChange, onEndDateChange }) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(e.target.value);
        onStartDateChange(e.target.value);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value);
        onEndDateChange(e.target.value);
    };

    const handleToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setStartDate(today);
        setEndDate(today);
        onStartDateChange(today);
        onEndDateChange(today);
    };

    return (
        <div className="flex absolute right-[2%] top-[10%] items-center gap-2">
            <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={handleStartChange}
                className="px-3 py-2 border rounded-lg"
            />
            <input
                type="date"
                name="endDate"
                value={endDate}
                onChange={handleEndChange}
                className="px-3 py-2 border rounded-lg"
            />
            <button
                type="button"
                onClick={handleToday}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
                Today
            </button>
        </div>
    );
};

export default DateSelector;
