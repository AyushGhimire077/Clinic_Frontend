import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Activity, Edit2, Filter, Phone, Printer, RefreshCcw, Users } from "lucide-react";
import { BackButton } from "../../../component/global/components/back/back";
import { Pagination } from "../../../component/global/components/Pagination";
import { SearchInput } from "../../../component/global/components/SearchInput";
import { usePatientStore } from "../helper/patient.store";
import { useToast } from "../../../component/toaster/useToast";

const PatientTable = () => {
  const navigate = useNavigate();
  const {
    patientList,
    totalPages,

    getAllPatients,
    getAllActivePatients,
    searchPatients,
    disablePatient,
    enablePatient,
    countPatients,

    count,
  } = usePatientStore();

  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        await searchPatients(searchQuery, { page, size: pageSize });
      } else if (showActiveOnly) {
        await getAllActivePatients({ page, size: pageSize });
      } else {
        await getAllPatients({ page, size: pageSize });
      }


      countPatients();
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (id: string) => {
    const res = await enablePatient(id);
    showToast(res.message, res.severity);
  };

  const handleDisable = async (id: string) => {
    const res = await disablePatient(id);
    showToast(res.message, res.severity);
  };


  const refreshData = () => {
    setSearchQuery("");
    setShowActiveOnly(false);
    setPage(0);
    loadData();
  }

  useEffect(() => {
    loadData();
  }, [page, showActiveOnly]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        setPage(0);
        loadData();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  type GenderRatio = { MALE?: number; FEMALE?: number };
  const genderRatio: GenderRatio = count.get("genderRatio") || {};
  const male = genderRatio.MALE ?? 0;
  const female = genderRatio.FEMALE ?? 0;

  const display = `M${male}/F${female}`;


  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header Section */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Patient Records
            </h1>
            <p className="text-muted">
              Manage and view all patient information
            </p>
          </div>

          <button
            onClick={() => navigate("/patient/add")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Users className="w-5 h-5" />
            New Patient
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {count.get("total")?.toString() || "0"}
            </div>
            <div className="text-sm text-muted">Total Patients</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {count.get("active")?.toString() || "0"}
            </div>
            <div className="text-sm text-muted">Active Patients</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-semibold pb-1 text-foreground">
              {display}
            </div>
            <div className="text-sm text-muted">Gender Distribution</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search patients by name, email, or contact..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refreshData} className="px-4 py-2 rounded-lg border border-border hover:bg-surface"><RefreshCcw className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${showActiveOnly
                ? "bg-primary-light border-primary text-primary"
                : "border-border hover:bg-surface"
                }`}
            >
              <Activity className="w-4 h-4" />
              {showActiveOnly ? "Active Only" : "All Patients"}
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : patientList.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted/30" />
            <p className="text-lg font-medium text-foreground">
              No patients found
            </p>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first patient"}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Medical
                    </th>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {patientList.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light text-primary rounded-lg flex items-center justify-center font-medium">
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {patient.name}
                            </p>
                            <p className="text-sm text-muted">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted" />
                          <span className="text-foreground">
                            {patient.contactNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error/10 text-error">
                            {patient.bloodGroup}
                          </span>
                          <p className="text-sm text-muted capitalize">
                            {patient.gender.toLowerCase()} •{" "}
                            {calculateAge(patient.dateOfBirth)} years
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {patient.oneTimeFlag ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
                            OneTime
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
                            Regular
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${patient.isActive ? "bg-success" : "bg-error"
                              }`}
                          />
                          <span
                            className={`text-sm font-medium ${patient.isActive ? "text-success" : "text-error"
                              }`}
                          >
                            {patient.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/patient/${patient.id}/detail`)
                            }
                            className="p-2 text-muted hover:text-info hover:bg-info/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/patient/edit/${patient.id}`, { state: { patient: patient } })
                            }
                            className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Patient"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {patient.isActive ? (
                            <button
                              onClick={async () => {
                                await handleDisable(patient.id);
                              }}
                              className="p-2 text-error hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              title="Disable Patient"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                await handleEnable(patient.id);
                              }}
                              className="p-2 text-success hover:text-success hover:bg-success/10 rounded-lg transition-colors"
                              title="Enable Patient"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border">
                <Pagination
                  currentPage={page + 1}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export default PatientTable;
