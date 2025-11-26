import { Link, useLocation } from "react-router-dom";
import { baseSidebarItems } from "../../component/utils/SidebarUtils";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6"> </h1>
      {baseSidebarItems.map((item) => {
        const isActive = location.pathname.includes(item.url);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            to={`/${item.url}`}
            className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700 ${
              isActive ? "bg-gray-700" : ""
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
