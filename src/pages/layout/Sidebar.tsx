import { Link, useLocation } from "react-router-dom";
import { baseSidebarItems } from "../../component/utils/sidebarUtils";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed xl:sticky top-0 left-0 h-screen w-64 bg-linear-to-b from-white to-blue-50/30 border-r border-slate-100 shadow-sm flex flex-col px-4 py-6 transition-all duration-300 z-30">
      {/* App Title */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-linear-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">MediCare Pro</h1>
        <p className="text-xs text-slate-500 mt-1">Clinic Management</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-1">
        {baseSidebarItems.map((item) => {
          const isActive = location.pathname.includes(item.url);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              to={`/${item.url}`}
              className={`
                flex items-center gap-3 p-3 rounded-xl 
                transition-all duration-200 group
                ${
                  isActive
                    ? "bg-linear-to-r from-teal-500 to-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-800"
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-colors ${
                  isActive 
                    ? "text-white" 
                    : "text-teal-500 group-hover:text-blue-600"
                }`}
              />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Profile Section */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-linear-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-white">DR</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Dr. Sarah Wilson</p>
            <p className="text-xs text-slate-500">Cardiologist</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;