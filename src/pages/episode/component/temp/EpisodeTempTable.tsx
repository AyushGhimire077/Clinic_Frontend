import { CreditCard, FileText, Filter, Plus, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BackButton } from "../../../../component/global/components/back/back";
import { Pagination } from "../../../../component/global/components/Pagination";
import { SearchInput } from "../../../../component/global/components/SearchInput";
import { formatCurrency } from "../../../../component/utils/ui.helpers";
import { useEpisodeTemplateStore } from "../../helper/episode.template.store";

const EpisodeTemplateTable = () => {
  const navigate = useNavigate();
  const {
    list: templates,
    isLoading,
    pagination,
    fetchAll,
    setPage,
    searchByName,
    disable,
    enable,
    fetchActive,
  } = useEpisodeTemplateStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter templates client-side based on search (if using client-side filtering)
  // Remove this if you want server-side only filtering
  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      setSearchQuery("");
      setShowActiveOnly(true);
      setPage(0);
      await fetchAll();
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchAll, setPage]);

  const handleEnable = useCallback(async (id: string) => {
    try {
      await enable(id);
      // Refresh the list after enabling
      if (showActiveOnly) {
        await fetchActive();
      } else {
        await fetchAll();
      }
    } catch (error) {
      console.error("Failed to enable template:", error);
    }
  }, [enable, fetchAll, fetchActive, showActiveOnly]);

  const handleDisable = useCallback(async (id: string) => {
    try {
      await disable(id);
      // Refresh the list after disabling
      if (showActiveOnly) {
        await fetchActive();
      } else {
        await fetchAll();
      }
    } catch (error) {
      console.error("Failed to disable template:", error);
    }
  }, [disable, fetchAll, fetchActive, showActiveOnly]);


  // Calculate stats
  const totalTemplates = templates.length;
  const oneTimeTemplates = templates.filter((t) => t.type === "ONE_TIME").length;
  const totalValue = templates.reduce((sum, t) => sum + t.packageCharge, 0);
  const activeTemplates = templates.filter((t) => t.isActive).length;



  // Load templates on mount and when filters change
  useEffect(() => {
    const loadData = async () => {
      if (searchQuery.trim()) {
        await searchByName(searchQuery);
      } else if (showActiveOnly) {
        await fetchActive();
      } else {
        await fetchAll();
      }
    };

    loadData();
  }, [searchQuery, showActiveOnly, pagination.currentPage]);

  return (
    <div className="max-w-[90em] mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Episode Templates
            </h1>
            <p className="text-muted">Reusable templates for treatment episodes</p>
          </div>

          <button
            onClick={() => navigate("/episode/templates/add")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Template
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{totalTemplates}</div>
            <div className="text-sm text-muted">Total Templates</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{oneTimeTemplates}</div>
            <div className="text-sm text-muted">One-time</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(totalValue)}
            </div>
            <div className="text-sm text-muted">Total Value</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{activeTemplates}</div>
            <div className="text-sm text-muted">Active</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search templates by name..."
              className="flex-1"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-lg border border-border hover:bg-surface disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <RefreshCcw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${showActiveOnly
                ? "bg-primary-light border-primary text-primary"
                : "border-border hover:bg-surface"
                }`}
            >
              <Filter className="w-4 h-4" />
              {showActiveOnly ? "Active Only" : "All Templates"}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted/30" />
            <p className="text-lg font-medium text-foreground">No templates found</p>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first template to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Billing
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Charge
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="text-foreground font-medium">
                              {template.title}
                            </div>
                            {template.description && (
                              <div className="text-sm text-muted truncate max-w-xs">
                                {template.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.type === "ONE_TIME"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                          }`}>
                          {template.type === "ONE_TIME" ? "One Time" : "Recurring"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.billingMode === "PACKAGE"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                          }`}>
                          {template.billingMode === "PACKAGE" ? "Package" : "Per Visit"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-foreground font-medium">
                          {formatCurrency(template.packageCharge)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {template.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/episode/templates/${template.id}`)}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
                          >
                            <CreditCard className="w-4 h-4" />
                            Use
                          </button>
                          <button
                            onClick={() => navigate(`/episode/templates/edit/${template.id}`)}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors text-sm"
                          >
                            Edit
                          </button>
                          {template.isActive ? (
                            <button
                              onClick={() => handleDisable(template.id)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                            >
                              Disable
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnable(template.id)}
                              className="px-4 py-2 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm"
                            >
                              Enable
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
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={pagination.currentPage || 0}
                totalPages={pagination.totalPages || 1}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EpisodeTemplateTable;