import { useNavigate } from "react-router-dom";
import { Users, Settings } from "lucide-react";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Add Staff Member",
      description: "Register new healthcare professionals",
      icon: Users,
      color: "from-primary to-primary-dark",
      hoverColor: "from-primary-dark to-primary",
      onClick: () => navigate("/staff/add-staff"),
    },
    {
      title: "Manage Roles",
      description: "Configure staff roles and permissions",
      icon: Settings,
      color: "from-info to-blue-600",
      hoverColor: "from-blue-600 to-blue-700",
      onClick: () => navigate("/staff/roles"),
    },
  ];

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
        <p className="text-muted">Manage staff members and their roles</p>
      </div>

      <div className="space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={item.onClick}
              className={`
                w-full p-6 text-left rounded-lg border border-border 
                bg-surface hover:shadow-medium transition-all duration-200
                hover-lift
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StaffDashboard;
