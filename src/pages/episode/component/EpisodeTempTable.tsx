import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CreditCard, FileText, Package, Plus } from "lucide-react";
import { BackButton } from "../../../component/global/back/back";
import { formatCurrency } from "../../../component/global/formatters";
import { Pagination } from "../../../component/global/Pagination";
import { SearchInput } from "../../../component/global/SearchInput";
import { useEpisodeStore } from "../helper/episode.store";

const EpisodeTemplateTable = () => {
  const navigate = useNavigate();
  const { episodeTemplateList, totalPages, getAllEpisodeTemplates } =
    useEpisodeStore();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    loadTemplates();
  }, [page]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      await getAllEpisodeTemplates({ page, size: pageSize });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = episodeTemplateList.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
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
            <p className="text-muted">
              Reusable templates for treatment episodes
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {episodeTemplateList.length}
            </div>
            <div className="text-sm text-muted">Total Templates</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {episodeTemplateList.filter((t) => t.type === "ONE_TIME").length}
            </div>
            <div className="text-sm text-muted">One-time</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(
                episodeTemplateList.reduce((sum, t) => sum + t.packageCharge, 0)
              )}
            </div>
            <div className="text-sm text-muted">Total Value</div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search templates..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted/30" />
            <p className="text-lg font-medium text-foreground">
              No templates found
            </p>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first template to get started"}
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {template.title}
                            </p>
                            <p className="text-sm text-muted">
                              ID: {template.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted" />
                          <span className="text-foreground">
                            {template.type === "ONE_TIME"
                              ? "One Time"
                              : "Recurring"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-muted" />
                          <span className="text-foreground">
                            {template.billingMode === "PACKAGE"
                              ? "Package"
                              : "Per Visit"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground">
                          {formatCurrency(template.packageCharge)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/episodes/add?template=${template.id}`)
                          }
                          className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary-light transition-colors"
                        >
                          Use Template
                        </button>
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

export default EpisodeTemplateTable;