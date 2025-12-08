import { useEffect, useState } from "react";
import { useEpisodeStore } from "./helper/store";
import { useGlobalStore } from "../../../component/toaster/store";
import type { EpisodeTempReq } from "./helper/interface";
import Back from "../../../component/global/back/back";
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { FiPackage, FiRefreshCw } from "react-icons/fi";

const EpisodeTempTable = () => {
  const { getAllEpisodeTemplates, episodeTemplateList } = useEpisodeStore();
  const { setToasterData } = useGlobalStore();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      await getAllEpisodeTemplates({ page: 0, size: 100 });
    } catch {
      setToasterData({
        message: "Failed to fetch templates",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = episodeTemplateList.filter((temp) =>
    temp.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    return type === "PACKAGE"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  const getBillingColor = (billingMode: string) => {
    return billingMode === "PACKAGE"
      ? "bg-purple-100 text-purple-800"
      : "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Back />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-linear-to-br from-blue-50 to-teal-50">
                  <FaClipboardList className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Episode Templates
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your reusable episode templates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchTemplates}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                >
                  <FiRefreshCw className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg">
                <FaFilter className="text-gray-500" />
                <span>Total Templates: {episodeTemplateList.length}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg">
                <FaFileAlt className="text-gray-500" />
                <span>Showing: {filteredTemplates.length} results</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading templates...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClipboardList className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No templates found
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? "Try a different search term"
                    : "Create your first template to get started"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Template Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Billing Mode
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Package Charge
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTemplates.map(
                    (temp: EpisodeTempReq, idx: number) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <FaFileAlt className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {temp.title}
                              </p>
                              <p className="text-sm text-gray-500">
                                Created just now
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              temp.type
                            )}`}
                          >
                            <FiPackage />
                            {temp.type}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getBillingColor(
                              temp.billingMode
                            )}`}
                          >
                            <FaMoneyBillWave />
                            {temp.billingMode === "PACKAGE"
                              ? "Package"
                              : "Per Visit"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              NPR {temp.packageCharge.toLocaleString()}
                            </span>
                            {temp.billingMode === "PACKAGE" && (
                              <span className="text-xs text-gray-500">
                                (package)
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <button className="text-sm px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              Edit
                            </button>
                            <button className="text-sm px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                              Use
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          {filteredTemplates.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredTemplates.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {episodeTemplateList.length}
                  </span>{" "}
                  templates
                </p>
                <div className="flex items-center gap-4">
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Previous
                  </button>
                  <span className="text-sm font-medium text-gray-900">1</span>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>💡</span>
            Template Management Tips
          </h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>
              • Templates save time when creating similar episodes repeatedly
            </li>
            <li>
              • Use package billing for bundled treatments with fixed pricing
            </li>
            <li>
              • Edit templates anytime - changes apply to future episodes only
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EpisodeTempTable;
