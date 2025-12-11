import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AppointmentDashboard = () => {
  const [activeTab, setActiveTab] = useState<"appointments" | "reports">("appointments");
  const navigate = useNavigate();

  const handleNavigation = (path: string) => navigate(path);

  const tabs = [
    {
      id: "appointments",
      label: "Appointments",
      cards: [
        {
          title: "Schedule Appointment",
          description: "Book a new patient appointment",
          color: "from-teal-500 to-blue-600",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ),
          onClick: () => handleNavigation("create"),
        },
        {
          title: "View Appointments",
          description: "Manage all scheduled appointments",
          color: "from-blue-500 to-teal-600",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          ),
          onClick: () => handleNavigation("view-appointment"),
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      cards: [
        {
          title: "Daily Report",
          description: "View today's appointment summary",
          color: "from-orange-500 to-red-500",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6h4v2H5v-2h4z" />
            </svg>
          ),
          onClick: () => handleNavigation("reports/daily"),
        },
        {
          title: "Monthly Report",
          description: "View monthly appointment summary",
          color: "from-purple-500 to-indigo-500",
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
            </svg>
          ),
          onClick: () => handleNavigation("reports/monthly"),
        },
      ],
    },
  ];

  const todayStats = [
    { label: "Today's Appointments", value: "12", color: "blue" },
    { label: "Pending", value: "3", color: "orange" },
    { label: "Completed", value: "8", color: "green" },
    { label: "Cancelled", value: "1", color: "red" },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-teal-500 to-blue-600 shadow-soft">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mt-4">Appointment Dashboard</h1>
          <p className="text-muted text-sm">Schedule, manage, and track patient appointments</p>
        </div>

        {/* TABS */}
        <div className="flex bg-surface rounded-2xl shadow-soft p-1 mb-8 max-w-md mx-auto border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-4 text-sm duration-300 font-medium rounded-xl transition-colors ${
                activeTab === tab.id ? "bg-primary text-white" : "text-muted hover:bg-primary-light hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {currentTab?.cards.map((card) => (
            <button
              key={card.title}
              onClick={card.onClick}
              className="text-left bg-surface rounded-xl p-6 border border-border shadow-soft hover:bg-primary-light/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg bg-linear-to-br ${card.color} flex items-center justify-center shadow-soft`}>
                  {card.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted">{card.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted group-hover:text-primary transition-all" />
              </div>
            </button>
          ))}
        </div>

        {/* OVERVIEW BOXES */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-4">
          {todayStats.map((stat, idx) => (
            <div key={idx} className="p-4 bg-surface border border-border rounded-xl shadow-soft">
              <div className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDashboard;
