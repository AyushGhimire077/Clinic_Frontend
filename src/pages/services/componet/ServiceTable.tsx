import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Activity, Filter, Plus } from "lucide-react";
import { BackButton } from "../../../component/global/back/back";
import { Pagination } from "../../../component/global/Pagination";
import { SearchInput } from "../../../component/global/SearchInput";
import { useServicesStore } from "../services.helper/services.store";

const ServiceTable = () => {
  const navigate = useNavigate();
  const {
    servicesList,
    totalPages,
    totalItems,
    getAllServices,
    getAllActiveServices,
    searchServices,
  } = useServicesStore();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        await searchServices(searchQuery, { page, size: pageSize });
      } else if (showActiveOnly) {
        await getAllActiveServices({ page, size: pageSize });
      } else {
        await getAllServices({ page, size: pageSize });
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const activeServicesCount = servicesList.filter((s) => s.isActive).length;

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
              Medical Services
            </h1>
            <p className="text-muted">
              Manage healthcare services and treatments
            </p>
          </div>

          <button
            onClick={() => navigate("/services/add")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {totalItems}
            </div>
            <div className="text-sm text-muted">Total Services</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {activeServicesCount}
            </div>
            <div className="text-sm text-muted">Active Services</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(
                servicesList.reduce((sum, s) => sum + s.charge, 0)
              )}
            </div>
            <div className="text-sm text-muted">Total Charges</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search services by name or description..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                showActiveOnly
                  ? "bg-primary-light border-primary text-primary"
                  : "border-border hover:bg-surface"
              }`}
            >
              <Activity className="w-4 h-4" />
              {showActiveOnly ? "Active Only" : "All Services"}
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
        ) : servicesList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <Activity className="w-16 h-16 text-muted/30" />
            </div>
            <p className="text-lg font-medium text-foreground">
              No services found
            </p>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by creating your first service"}
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Charge
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {servicesList.map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light text-primary rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {service.name}
                            </p>
                            <p className="text-sm text-muted">
                              ID: {service.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-foreground line-clamp-2">
                          {service.description || "No description"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-primary capitalize">
                          {service.type?.toLowerCase() || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground">
                          {formatCurrency(service.charge)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              service.isActive ? "bg-success" : "bg-error"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              service.isActive ? "text-success" : "text-error"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
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

export default ServiceTable;
