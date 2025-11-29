import { useEffect, useState } from "react";
import { userServiceStore } from "../helper/store";
import type { IServices } from "../helper/interface";
import { Pagination } from "@mui/material";
import Back from "../../../component/global/back/back";

const ServiceTable = () => {
  const { servicesList, getAllServices, getAllActiveServices, searchServices } =
    userServiceStore();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [query, setQuery] = useState("");
  const [showActive, setShowActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      if (query.length > 0) {
        await searchServices(query, { page, size });
      } else if (showActive) {
        await getAllActiveServices({ page, size });
      } else {
        await getAllServices({ page, size });
      }
    } catch (error) {
      console.error("Failed to load services:", error);
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

  const handleStatusToggle = async (service: IServices) => {
    // Implement status toggle logic here
    console.log("Toggle service status:", service);
  };

  const handleEdit = (service: IServices) => {
    // Implement edit logic here
    console.log("Edit service:", service);
  };

  const totalPages = Math.ceil(servicesList.length / size) || 1;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Back />
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Medical Services</h1>
            <p className="text-slate-600 text-lg">
              Manage all healthcare services and treatments offered by your clinic
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showActive ? "M5 13l4 4L19 7" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
              {showActive ? "Active Only" : "All Services"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search services by name, description, or staff type..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
            />
            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-xl hover:from-teal-600 hover:to-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md whitespace-nowrap flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Services
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="text-slate-600">Loading services...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50/30">
                  <tr>
                    {["Service Name", "Description", "Staff Type", "Charge", "Status", "Actions"].map((header) => (
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
                  {servicesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16zM9 10h.01M15 10h.01" />
                          </svg>
                          <p className="text-lg font-medium text-slate-700 mb-2">No services found</p>
                          <p className="text-sm text-slate-500">
                            {query ? "Try adjusting your search criteria" : "Get started by creating your first service"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    servicesList.map((service) => (
                      <tr
                        key={service.id}
                        className="hover:bg-slate-50/50 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{service.name}</p>
                              <p className="text-xs text-slate-500">ID: {service.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700 line-clamp-2 max-w-xs">
                            {service.description}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                            {service.type?.toLowerCase() || "Any"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-slate-800">
                            {formatCurrency(service.charge)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              service.isActive
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleStatusToggle(service)}
                              className={`p-2 rounded-lg transition-colors duration-200 ${
                                service.isActive
                                  ? "text-orange-400 hover:bg-orange-50 hover:text-orange-600"
                                  : "text-green-400 hover:bg-green-50 hover:text-green-600"
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {service.isActive ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                )}
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleEdit(service)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            {servicesList.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing {page * size + 1}-{Math.min((page + 1) * size, servicesList.length)} of {servicesList.length} services
                  </p>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: '10px',
                        margin: '0 2px',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#0d9488 !important',
                        color: 'white',
                      }
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

export default ServiceTable;