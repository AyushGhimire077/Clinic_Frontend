import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { BackButton } from "../../../../component/global/components/back/back";
import { Pagination } from "../../../../component/global/components/Pagination";
import { SearchInput } from "../../../../component/global/components/SearchInput";
import { useStaffStore } from "../../staff.helper/staff.store";
import { formatCurrency } from "../../../../component/utils/ui.helpers";

const StaffTable = () => {
  const { staffList, getAllStaff, searchStaff, pagination } = useStaffStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);

  // { currentPage: 0, pageSize: 10, totalItems: 3, totalPages: 1 }
  console.log(pagination);

  const loadStaff = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        await searchStaff(searchQuery, { page, size });
      } else {
        await getAllStaff({ page, size });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [page, searchQuery]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(0);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return (
    <div className="max-w-[90em] mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-surface border border-border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Staff Members
            </h1>
            <p className="text-muted">Manage and view all staff accounts</p>
          </div>

          <div className="flex items-center gap-4">
            <SearchInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search staff..."
              className="w-64"
            />
            <div className="text-sm text-muted">
              Showing {staffList.length} staff members
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-2 border-primary-light border-t-primary rounded-full animate-spin" />
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <Users className="w-16 h-16 text-muted/30" />
            </div>
            <p className="text-lg font-medium text-foreground">
              No staff members found
            </p>
            <p className="text-muted mb-4">
              Try adjusting your search or go back to the full list.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                window.history.back();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Back to All Staff
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staffList.map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-primary-light/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-light text-primary rounded-full flex items-center justify-center font-medium">
                            {getInitials(staff.name)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {staff.name}
                            </p>
                            <p className="text-sm text-muted">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {staff.contactNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light text-primary">
                          {staff.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {staff.role}
                      </td>
                      <td className=" py-4 text-foreground">
                        {/* {formatCurrency(staff.salary)} */}
                        {staff.salary ? formatCurrency(staff.salary) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${staff.isActive
                            ? "bg-green-100 text-success"
                            : "bg-gray-100 text-muted"
                            }`}
                        >
                          {staff.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border">
              <Pagination
                currentPage={pagination?.currentPage || 0}
                totalPages={pagination?.totalPages || 1}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffTable;
