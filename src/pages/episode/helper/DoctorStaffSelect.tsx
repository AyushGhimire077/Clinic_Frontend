import { useEffect, useState } from "react";

import { Search, ChevronDown, User } from "lucide-react";
import { useStaffStore } from "../../staff/staff.helper/staff.store";

interface DoctorStaffSelectProps {
  value: string;
  onChange: (staffId: string) => void;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  filterType?: string; // "DOCTOR" to filter only doctors
}

const DoctorStaffSelect = ({
  value,
  onChange,
  disabled = false,
  label = "Primary Doctor",
  required = false,
  error,
  filterType,
}: DoctorStaffSelectProps) => {
  const { getAllActiveStaff, staffList } = useStaffStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      await getAllActiveStaff({ page: 0, size: 100 });
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter((staff) => {
    if (filterType && staff.type !== filterType) return false;

    return (
      searchTerm === "" ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedStaff = staffList.find((staff) => staff.id === value);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left border rounded-lg
            ${error ? "border-error" : "border-border"}
            ${disabled ? "bg-surface cursor-not-allowed" : "bg-background"}
            focus:ring-2 focus:ring-primary focus:border-transparent
            transition-colors flex items-center justify-between
          `}
        >
          <div className="flex items-center gap-3 min-w-0">
            {selectedStaff ? (
              <>
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-medium text-primary">
                    {getInitials(selectedStaff.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedStaff.name}
                  </p>
                  <p className="text-sm text-muted truncate">
                    {selectedStaff.role}
                    {selectedStaff.doctorSubType &&
                      ` • ${selectedStaff.doctorSubType}`}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-muted">
                Select {label.toLowerCase()}...
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-elevated max-h-96 overflow-hidden">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full pl-10 pr-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="py-4 text-center">
                  <div className="w-6 h-6 border-2 border-primary-light border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="py-8 text-center text-muted">
                  <User className="w-8 h-8 mx-auto mb-2 text-muted/30" />
                  No staff found
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
                      w-full px-4 py-3 text-left transition-colors hover:bg-primary-light/10
                      ${value === staff.id ? "bg-primary-light/20" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          value === staff.id ? "bg-primary-light" : "bg-surface"
                        }`}
                      >
                        <span
                          className={`font-medium ${
                            value === staff.id
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {getInitials(staff.name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {staff.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-surface rounded">
                            {staff.role}
                          </span>
                          {staff.doctorSubType && (
                            <span className="text-xs px-2 py-1 bg-primary-light text-primary rounded">
                              {staff.doctorSubType}
                            </span>
                          )}
                          {!staff.isActive && (
                            <span className="text-xs px-2 py-1 bg-error/10 text-error rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

export default DoctorStaffSelect;
