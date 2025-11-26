import { useNavigate } from "react-router-dom";

const Staff = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate("/staff/add-staff")}
      >
        Add Staff
      </button>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => navigate("/staff/roles")}
      >
        Add Roles
      </button>
    </div>
  );
};

export default Staff;
