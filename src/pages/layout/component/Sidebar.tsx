import { IoLogoCapacitor } from "react-icons/io5";
import { Link, useMatch } from "react-router-dom";
import { getSidebarItems } from "../../../component/utils/sidebarUtils";
import { useAuthStore } from "../../auth/auth.store/auth.store";

export const Sidebar = () => {
  const { user } = useAuthStore();
  const sidebarItems = getSidebarItems.map((item) => ({
    id: item.key,
    label: item.label,
    path: item.url,
    icon: item.icon,
  }));

  console.log(sidebarItems)

  return (
    <aside className="fixed xl:sticky top-0 left-0 h-screen w-64 bg-surface border-r border-border shadow-soft flex flex-col z-50">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <IoLogoCapacitor className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-foreground">ClinicHub</h1>
            <p className="text-xs text-muted">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {sidebarItems.map((item: any) => {
            const match = useMatch({ path: item.path, end: item.path === "/" });
            const isActive = !!match;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-muted hover:bg-primary-light hover:text-primary"
                  }
                  focus-ring
                `}
                title={item.label}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-current"
                    }`}
                />
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs bg-error text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile (if user exists) */}
      {user && (
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-light text-primary rounded-full">
              {user.name ??
                ""
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.name}
              </p>
              {user.email && (
                <p className="text-xs text-muted truncate">{user.email}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
