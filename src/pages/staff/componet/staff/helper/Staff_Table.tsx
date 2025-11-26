import { useEffect } from "react";
import { useStaffStore } from "./store";

const StaffTable = () => {
  const { staffList, getAllStaff } = useStaffStore();
console.log(staffList)

  useEffect(() => {
    getAllStaff({ page: 1, pageSize: 10 });
  }, [getAllStaff]);
  return (
    <>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Staff Table</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Contact Number</th>
              <th className="py-2 px-4 border-b">Salary</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Active</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="py-2 px-4 border-b">{staff.id}</td>
                <td
                  className="py
-2 px-4 border-b"
                >
                  {staff.name}
                </td>
                <td className="py-2 px-4 border-b">{staff.email}</td>
                <td className="py-2 px-4 border-b">{staff.contactNumber}</td>
                <td className="py-2 px-4 border-b">{staff.salary}</td>
                <td className="py-2 px-4 border-b">{staff.role}</td>
                <td className="py-2 px-4 border-b">
                  {staff.isActive ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default StaffTable;
