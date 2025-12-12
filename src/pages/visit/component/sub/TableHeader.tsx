import { Filter, Search } from "lucide-react";
import { inputField } from "../../../../component/global/components/customStyle";
import DateSelector from "../../../../component/global/components/DateSelector";
import { visitStatusOptions } from "../../../../component/global/utils/select";


interface TableHeaderProps {
    title: string;
    subtitle: string;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onFilterChange: (value: string) => void;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

export const TableHeader = ({
    title,
    subtitle,
    searchTerm,
    onSearchChange,
    filterStatus,
    onFilterChange,
    onStartDateChange,
    onEndDateChange,
}: TableHeaderProps) => {
    return (
        <div className="bg-surface rounded-xl border border-border shadow-soft p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{title}</h1>
                    <p className="text-muted text-sm">{subtitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by patient, doctor, or episode..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={inputField + " pl-10"}
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className={inputField + " pl-10"}
                    >
                        <option value="">All Statuses</option>
                        {visitStatusOptions.map((v) => (
                            <option key={v.value} value={v.value}>
                                {v.label}
                            </option>
                        ))}
                    </select>
                </div>

                <DateSelector
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                />
            </div>
        </div>
    );
};