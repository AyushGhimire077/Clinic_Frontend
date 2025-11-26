import Back from "../../../global/back/back";
import { useRoleStore } from "./helper/store";

const RoleTable = () => {
  const { get_all_roles, roles } = useRoleStore();

 
  const handleRefresh = async () => {
    await get_all_roles();
  };

  return (
    <div>
      <Back />
      <div>
        <button className="p-8" onClick={handleRefresh}>
          Refresh
        </button>

        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Permissions</th>
              <th className="border border-gray-300 px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td className="border border-gray-300 px-4 py-2">{role.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {role.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {role.permissions.join(", ")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {role.is_active ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleTable;
