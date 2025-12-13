import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  DollarSign,
  Filter,
  Plus,
  RefreshCcw,
  User,
} from "lucide-react";
import { BackButton } from "../../../../component/global/components/back/back";
import { Pagination } from "../../../../component/global/components/Pagination";
import { SearchInput } from "../../../../component/global/components/SearchInput";
import {
  formatCurrency,
  formatDate,
} from "../../../../component/global/utils/global.utils.";
import { useEpisodeStore } from "../../helper/episode.store";

const EpisodeTable = () => {
  const navigate = useNavigate();
  const { episodeList, totalPages, totalItems, getAllEpisodes, getAllActiveEpisode } =
    useEpisodeStore();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const loadEpisodes = async () => {
    setLoading(true);
    try {
      await getAllEpisodes({ page, size: pageSize });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page === 0) return; // skip reloading unnecessarily
    loadEpisodes();
  }, [page]);

  const filteredEpisodes = episodeList.filter((episode) => {
    if (
      searchQuery &&
      !episode.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !episode.patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (statusFilter && episode.status !== statusFilter) return false;
    return true;
  });

  const refreshData = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPage(0);
    loadEpisodes();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on new search
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success/10 text-success";
      case "CLOSED":
        return "bg-muted/10 text-muted";
      default:
        return "bg-surface text-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ONE_TIME":
        return "bg-primary-light text-primary";
      case "RECURRING":
        return "bg-info/10 text-info";
      default:
        return "bg-surface text-foreground";
    }
  };

  return (
    <div className="max-w-[90em] mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Episodes</h1>
            <p className="text-muted">Manage patient treatment episodes</p>
          </div>

          <button
            onClick={() => navigate("/episode/add")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Episode
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {totalItems}
            </div>
            <div className="text-sm text-muted">Total Episodes</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {episodeList.filter((e) => e.status === "ACTIVE").length}
            </div>
            <div className="text-sm text-muted">Active</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {episodeList.filter((e) => e.type === "RECURRING").length}
            </div>
            <div className="text-sm text-muted">Recurring</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(
                episodeList.reduce((sum, e) => sum + e.packageCharge, 0)
              )}
            </div>
            <div className="text-sm text-muted">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search episodes by title or patient..."
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="px-4 py-2 rounded-lg border border-border hover:bg-surface"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredEpisodes.length === 0 ? (
          <div className="py-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted/30" />
            <p className="text-lg font-medium text-foreground">
              No episodes found
            </p>
            <p className="text-muted">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Create your first episode to get started"}
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
                      Episode
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Dates
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
                  {filteredEpisodes.map((episode) => (
                    <tr
                      key={episode.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {episode.title}
                          </p>
                          <p className="text-sm text-muted">
                            {episode.billingMode === "PACKAGE"
                              ? "Package"
                              : "Per Visit"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-muted" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {episode.patient.name}
                            </p>
                            <p className="text-sm text-muted">Patient</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                            <span className="font-medium text-primary">
                              {episode.primaryDoctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              Dr. {episode.primaryDoctor.name}
                            </p>
                            <p className="text-sm text-muted">
                              {episode.primaryDoctor.doctorSubType || "General"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">Start:</span>{" "}
                            {formatDate(episode.startDate)}
                          </p>
                          <p className="text-sm text-foreground">
                            <span className="font-medium">End:</span>
                            {" PENDING"}
                            {episode.endDate != null
                              ? formatDate(episode.startDate)
                              : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                            episode.type
                          )}`}
                        >
                          {episode.type === "ONE_TIME"
                            ? "One Time"
                            : "Recurring"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-success" />
                          <span className="font-bold text-foreground">
                            {formatCurrency(episode.packageCharge)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            episode.status
                          )}`}
                        >
                          {episode.status}
                        </span>
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

export default EpisodeTable;
