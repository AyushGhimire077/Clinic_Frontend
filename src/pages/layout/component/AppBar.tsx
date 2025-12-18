import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../component/global/components/back/back";
// import { useAuthStore } from "../../auth/store/auth.store";
import { useAuthStore } from "../../auth/auth.store/auth.store";

export const AppBar = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-background border-b border-border shadow-soft flex items-center justify-between px-6">
      {/* Left section - Back button for mobile */}
      <div className="xl:hidden">
        <BackButton ariaLabel="Back to previous page" />
      </div>

      {/* Welcome to ClinicHub */}
      <div className="hidden xl:flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground ">
          Welcome  {(user?.name ?? "User")} to ClinicHub
        </h1>
      </div>

      {/* Center/Right section */}
      <div className="flex items-center gap-4 ml-auto">
        {user && (
          <>
            <div className="hidden sm:flex items-center gap-3">
              <FaUserCircle className="w-6 h-6 text-muted" />
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {user.type}
                </p>
                {user.name && (
                  <p className="text-xs text-muted capitalize">
                    {user.name.toLowerCase()}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-error border border-error rounded-lg hover:bg-error/5 transition-colors focus-ring"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};
