import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Back from "../../../../component/global/back/back";
import { useGlobalStore } from "../../../../component/toaster/store";
import { Permissions } from "../../../../component/utils/permissons";
import { useRoleStore } from "./helper/store";

const permissionValues = Object.values(Permissions);

const AddRole = () => {
  const { create_role, get_all_roles } = useRoleStore();
  const { setToasterData } = useGlobalStore();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  const togglePermission = (perm: string) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const notify = (message: string, severity: any) => {
    setToasterData({ open: true, message, severity });
  };

  const resetForm = () => {
    setRoleName("");
    setSelected([]);
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      role: roleName.trim(),
      permissions: selected,
      is_active: isActive,
    };

    try {
      const res = await create_role(payload);

      notify(res.message, res.severity);

      if (res.status === 200) {
        await get_all_roles();
        resetForm();
      }
    } catch (err: any) {
      notify(err.message || "Something went wrong", "error");
    }
  };

  // one time fetch for viewing roles table
  useEffect(() => {
    get_all_roles();
  }, []);

  return (
    <div className="  bg-white p-6 rounded-lg shadow mx-auto">
      <Back />

      <div>
        <button onClick={() => navigate("view")}>View Roles</button>
      </div>

      <div className=" mt-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-5">Add Role</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Name */}
          <div className="flex flex-col gap-1">
            <label className="font-medium">Role Name</label>
            <input
              type="text"
              placeholder="Enter the role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Permissions</label>

            <div className="flex flex-wrap gap-3">
              {permissionValues.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(perm)}
                    onChange={() => togglePermission(perm)}
                    className="cursor-pointer"
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          {/* Active Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="cursor-pointer"
            />
            Active
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="px-5 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition w-fit"
          >
            Add Role
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRole;
