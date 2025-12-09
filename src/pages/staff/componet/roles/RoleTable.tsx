import { useEffect, useState } from "react";

import { Shield, CheckCircle, XCircle, Edit2, Filter } from "lucide-react";
import { BackButton } from "../../../../component/global/back/back";
import { SearchInput } from "../../../../component/global/SearchInput";
import { useToast } from "../../../../component/toaster/useToast";
import { useRoleStore } from "../../role.helper/role.store";
import { Pagination } from "../../../../component/global/Pagination";

const RoleTable = () => {
  const { showToast } = useToast();
  const {
    roles,
    totalPages,
    totalItems,
    getAllRoles,
    getAllActiveRoles,
    enableRole,
    disableRole,
  } = useRoleStore();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const loadRoles = async () => {
    setLoading(true);
    try {
      if (showActiveOnly) {
        await getAllActiveRoles({ page, size: pageSize });
      } else {
        await getAllRoles({ page, size: pageSize });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, [page, showActiveOnly]);

  const handleEnable = async (id: string) => {
    const res = await enableRole(id);
    showToast(res.message, res.severity);
  };

  const handleDisable = async (id: string) => {
    const res = await disableRole(id);
    showToast(res.message, res.severity);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.permissions.some((p) =>
        p.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Role Management
            </h1>
            <p className="text-muted">Manage user roles and permissions</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <button
                onClick={() => setShowActiveOnly(!showActiveOnly)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  showActiveOnly
                    ? "bg-primary-light border-primary text-primary"
                    : "border-border hover:bg-surface"
                }`}
              >
                {showActiveOnly ? "Show All" : "Active Only"}
              </button>
            </div>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search roles or permissions..."
              className="w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">{totalItems}</div>
          <div className="text-sm text-muted">Total Roles</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {roles.filter((r) => r.isActive).length}
          </div>
          <div className="text-sm text-muted">Active Roles</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {roles.reduce((acc, role) => acc + role.permissions.length, 0)}
          </div>
          <div className="text-sm text-muted">Total Permissions</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-2xl font-bold text-foreground">
            {new Set(roles.flatMap((r) => r.permissions)).size}
          </div>
          <div className="text-sm text-muted">Unique Permissions</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted/30" />
            <p className="text-lg font-medium text-foreground">
              No roles found
            </p>
            <p className="text-muted">Create your first role to get started</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Permissions
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
                  {filteredRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {role.role}
                          </p>
                          <p className="text-sm text-muted">
                            ID: {role.id.substring(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {role.permissions.slice(0, 3).map((perm) => (
                            <span
                              key={perm}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-light text-primary"
                            >
                              {perm}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-surface text-muted">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              role.isActive ? "bg-success" : "bg-error"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              role.isActive ? "text-success" : "text-error"
                            }`}
                          >
                            {role.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {role.isActive ? (
                            <button
                              onClick={() => handleDisable(role.id)}
                              className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                              title="Disable Role"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnable(role.id)}
                              className="p-2 text-success hover:bg-success/10 rounded-lg transition-colors"
                              title="Enable Role"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit Role"
                            onClick={() => {
                              // Navigate to edit page or open modal
                              // navigate(`/staff/roles/edit/${role.id}`);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
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

export default RoleTable;
