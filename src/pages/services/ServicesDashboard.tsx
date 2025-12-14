import { Activity, CheckCircle, DollarSign, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useServicesStore } from "./services.helper/services.store";
import { formatCurrency } from "../../component/utils/ui.helpers";

const ServicesDashboard = () => {
  const navigate = useNavigate();
  const { servicesList } = useServicesStore();

  const quickActions = [
    {
      title: "Add New Service",
      description: "Create a new medical service",
      icon: Plus,
      onClick: () => navigate("add"),
      color: "from-primary to-primary-dark",
    },
    {
      title: "View All Services",
      description: "Browse and manage all services",
      icon: List,
      onClick: () => navigate("view"),
      color: "from-info to-blue-600",
    },
  ];

  // Calculate stats from actual data
  const totalServices = servicesList.length;
  const activeServices = servicesList.filter(
    (service) => service.isActive
  ).length;
  const totalCharge = servicesList.reduce(
    (sum, service) => sum + service.charge,
    0
  );
  const averageCharge = totalServices > 0 ? totalCharge / totalServices : 0;



  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-linear-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Medical Services</h1>
        <p className="text-muted mt-2">
          Manage healthcare services and treatments for your clinic
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={action.onClick}
              className="p-6 bg-surface border border-border rounded-lg hover:shadow-medium transition-all duration-200 hover-lift text-left"
            >
              <div
                className={`w-12 h-12 bg-linear-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted">{action.description}</p>
            </button>
          );
        })}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Services */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Services</p>
              <p className="text-2xl font-bold text-foreground">
                {totalServices}
              </p>
            </div>
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active Services</p>
              <p className="text-2xl font-bold text-foreground">
                {activeServices}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        {/* Average Charge */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Avg. Charge</p>
              <p className="text-2xl font-semibold text-foreground">
                {formatCurrency(averageCharge)}
              </p>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-info" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Services (Optional) */}
      {servicesList.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Services
          </h3>
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {servicesList.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  className="p-4 flex items-center justify-between hover:bg-primary-light/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {service.name}
                      </p>
                      <p className="text-sm text-muted">
                        {service.type || "General"} •{" "}
                        {formatCurrency(service.charge)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${service.isActive
                      ? "bg-success/10 text-success"
                      : "bg-error/10 text-error"
                      }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
            {servicesList.length > 3 && (
              <div className="p-4 border-t border-border text-center">
                <button
                  onClick={() => navigate("view")}
                  className="text-primary hover:text-primary-dark font-medium text-sm"
                >
                  View all {servicesList.length} services
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesDashboard;
