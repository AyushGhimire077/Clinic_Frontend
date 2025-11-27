import { useEffect, useState } from "react";
import { usePatientStore } from "./store";
import { Pagination } from "@mui/material";
import Back from "../../../../component/global/back/back";

const PatientTable = () => {
  const { getAllPatients, getAllActivePatients, searchPatients, patientList } =
    usePatientStore();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [query, setQuery] = useState("");
  const [showActive, setShowActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (query.length > 0) {
        await searchPatients(query, { page, size });
      } else if (showActive) {
        await getAllActivePatients({ page, size });
      } else {
        await getAllPatients({ page, size });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, showActive]);

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const totalPages = Math.ceil(50 / size);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">
              Patient Records
            </h1>
            <p className="text-slate-600 text-lg">
              Manage and view all patient information 
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowActive((prev) => !prev);
                setPage(0);
              }}
              className={`px-6 py-3 rounded-xl transition-all duration-200 font-semibold flex items-center gap-3 border ${
                showActive
                  ? "bg-teal-50 text-teal-700 border-teal-200 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={showActive ? "M5 13l4 4L19 7" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
              {showActive ? "Active Only" : "All Patients"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search patients by name, email, or contact..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            <svg
              className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-linear-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-3"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search Patients
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="text-slate-600">Loading patient records...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-slate-50 to-blue-50/30">
                  <tr>
                    {[
                      "SN",
                      "Patient Name",
                      "Contact Info",
                      "Blood Group",
                      "Gender",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-100"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patientList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <svg
                            className="w-16 h-16 mb-4 text-slate-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg font-medium text-slate-700 mb-2">
                            No patients found
                          </p>
                          <p className="text-sm text-slate-500">
                            {query
                              ? "Try adjusting your search criteria"
                              : "Get started by adding your first patient"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    patientList.map((patient, index) => (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50/50 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded-lg">
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-white">
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {patient.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {patient.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {patient.contactNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            {patient.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-600 capitalize bg-slate-100 px-3 py-1 rounded-lg">
                            {patient.gender.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              patient.isActive
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {patient.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {patientList.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing {page * size + 1}-{Math.min((page + 1) * size, 50)}{" "}
                    of 50 patients
                  </p>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: "10px",
                        margin: "0 2px",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#0d9488 !important",
                        color: "white",
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientTable;
