import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../auth/store";

const AppBar = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user from store
    useAuthStore.setState({ token: null, user: null });
    // Optionally clear cookies if you use them
    navigate("/sign-in");
  };

  return (
    <div className="w-full h-16 bg-white dark:bg-gray-900 shadow-md flex justify-between items-center px-6">
      <div className="text-2xl font-bold text-gray-800 dark:text-white">
        
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <FaUserCircle
              size={24}
              className="text-gray-600 dark:text-gray-200"
            />
            <span className="hidden sm:inline text-gray-800 dark:text-white">
              {user.name}
            </span>
            <button
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AppBar;
