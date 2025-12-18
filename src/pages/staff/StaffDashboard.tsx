import { Users, Settings, UserPlus, Shield, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaffStore } from "./staff.helper/staff.store";
import { useRoleStore } from "./role.helper/role.store";

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState<"staff" | "roles">("staff");
  const { fetchCount, count } = useStaffStore();
  const { list, fetchActive } = useRoleStore();

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const tabs = [
    {
      id: "staff",
      label: "Staff Management",
      cards: [
        {
          title: "Add Staff Member",
          description: "Register new healthcare professionals",
          icon: UserPlus,
          color: "from-primary to-primary-dark",
          onClick: () => handleNavigation("/staff/add-staff"),
        },
        {
          title: "View Staff Members",
          description: "Browse and manage all staff records",
          icon: Users,
          color: "from-success to-success",
          onClick: () => handleNavigation("/staff/table"),
        },
      ],
    },
    {
      id: "roles",
      label: "Role Management",
      cards: [
        {
          title: "Manage Roles",
          description: "Configure staff roles and permissions",
          icon: Settings,
          color: "from-info to-info",
          onClick: () => handleNavigation("/staff/roles"),
        },
        {
          title: "View Roles",
          description: "Browse staff roles and access levels",
          icon: Shield,
          color: "from-success to-success",
          onClick: () => handleNavigation("/staff/roles/view"),
        },
      ],
    },
  ];


  const currentTab = tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    async function getCount() {
      try {
        await fetchCount();
      } catch (error) {
        console.error("Error loading staff count:", error);
      }
    }



    getCount();
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-primary-dark shadow-soft">
            <Users className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mt-4">
            Staff Management
          </h1>
          <p className="text-muted text-sm">Manage your healthcare team</p>
        </div>

        {/* TABS */}
        <div className="flex bg-surface rounded-2xl shadow-soft p-1 mb-8 max-w-md mx-auto border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-4 text-sm duration-300  font-medium rounded-xl transition-colors ${activeTab === tab.id
                ? "bg-primary text-white"
                : "text-muted hover:bg-primary-light hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentTab?.cards.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                className="text-left bg-surface rounded-xl p-6 border border-border shadow-soft hover:bg-primary-light/40 transition-all"
                onClick={item.onClick}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-linear-to-br ${item.color} flex items-center justify-center shadow-soft`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted">{item.description}</p>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* OVERVIEW BOXES */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-primary">
              {count?.active ?? 0}
            </div>
            <div className="text-sm text-muted">Active Staff</div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-success">
              {(count?.total ?? 0) - (count?.active ?? 0)}
            </div>
            <div className="text-sm text-muted">InActive Staff</div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold  text-info">{list.length}</div>
            <div className="text-sm text-muted">Roles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
