import { useEffect, useState } from "react";
import { useStaffStore } from "./helper/store";
import type { StaffRequest } from "./helper/interface";
import { useRoleStore } from "../staff_roles/helper/store";
import { useGlobalStore } from "../../../../component/toaster/store";
import { useNavigate } from "react-router-dom";

const AddStaff = () => {
  const { createStaff } = useStaffStore();
  const { roles, get_all_roles } = useRoleStore();
  const { setToasterData } = useGlobalStore();

  const navigate = useNavigate();
  const [form, setForm] = useState<StaffRequest>({
    name: "",
    email: "",
    password: "",
    contactNumber: 0,
    salary: 0,
    role: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "salary" || name === "contactNumber" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createStaff(form);
    setToasterData({
      message: res.message,
      severity: res.severity || "info",
      open: true,
    });
  };

  useEffect(() => {
    get_all_roles();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add Staff</h2>

      <button onClick={() => navigate("/staff/table")}>View Staff </button>

      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "email", "password"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field}
            value={(form as any)[field]}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        ))}

        {/* Role */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>

        <input
          name="contactNumber"
          type="number"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Staff
        </button>
      </form>
    </div>
  );
};

export default AddStaff;
