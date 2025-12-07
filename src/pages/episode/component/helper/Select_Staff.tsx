import { useEffect, useState } from "react";
import { useEpisodeStore } from "../helper/store";
import type { IStaff } from "../../../staff/componet/staff/helper/interface";
import { useStaffStore } from "../../../staff/componet/staff/helper/store";

interface StaffSelectProps {
  value: string;
  onChange: (staffId: string) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
}

const StaffSelect = ({
  value,
  onChange,
  disabled = false,
  label = "Primary Doctor",
  required = false,
  error,
}: StaffSelectProps) => {
  const { getAllActiveStaff, staffList } = useStaffStore();
  const [filteredStaff, setFilteredStaff] = useState<IStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const pagination = { page: 1, size: 1000 };

  useEffect(() => {
    const res = getAllActiveStaff(pagination);
    res.then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStaff(staffList);
    } else {
      const filtered = staffList.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.doctorSubType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staffList]);

  const selectedStaff = staffList.find((staff) => staff.id === value);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
        {required && <span className="text-rose-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || loading}
          className={`
            w-full px-4 py-3 text-left border rounded-xl
            ${error ? "border-rose-500" : "border-slate-300"}
            ${
              disabled
                ? "bg-slate-100 cursor-not-allowed"
                : "bg-white hover:border-slate-400"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-colors duration-200
          `}
        >
          <div className="flex items-center justify-between">
            {selectedStaff ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                  {selectedStaff.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-800">
                    {selectedStaff.name}
                  </div>
                  <div className="text-sm text-slate-500 flex gap-2">
                    <span>{selectedStaff.role}</span>
                    {selectedStaff.doctorSubType && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{selectedStaff.doctorSubType}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-slate-500">Select a doctor...</span>
            )}
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-slate-100">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search doctors..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="py-2">
              {filteredStaff.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500">
                  {loading ? "Loading doctors..." : "No doctors found"}
                </div>
              ) : (
                filteredStaff.map((staff) => (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => {
                      onChange(staff.id);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200
                      ${
                        value === staff.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "border-l-4 border-l-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-medium
                        ${
                          value === staff.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }
                      `}
                      >
                        {staff.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          {staff.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="inline-block px-2 py-1 bg-slate-100 rounded-md mr-2">
                            {staff.role}
                          </span>
                          {staff.doctorSubType && (
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
                              {staff.doctorSubType}
                            </span>
                          )}
                        </div>
                        {staff.isActive === false && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded-md">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
    </div>
  );
};

export default StaffSelect;
