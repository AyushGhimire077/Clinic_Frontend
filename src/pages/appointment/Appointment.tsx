import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Schedule Appointment",
      description: "Book a new patient appointment",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: () => navigate("create"),
      color: "from-teal-500 to-blue-600"
    },
    {
      title: "View Appointments",
      description: "Manage all scheduled appointments",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      onClick: () => navigate("view-appointment"),
      color: "from-blue-500 to-teal-600"
    }
  ];

  const todayStats = [
    { label: "Today's Appointments", value: "12", color: "blue" },
    { label: "Pending", value: "3", color: "orange" },
    { label: "Completed", value: "8", color: "green" },
    { label: "Cancelled", value: "1", color: "red" }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Appointment Management</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Schedule, manage, and track patient appointments with our comprehensive scheduling system
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {todayStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group text-left`}
          >
            <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
              {action.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{action.title}</h3>
            <p className="text-slate-600 leading-relaxed">{action.description}</p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-medium text-teal-600">Get Started</span>
              <svg className="w-5 h-5 text-teal-500 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Upcoming Appointments Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Today's Upcoming Appointments</h2>
          <span className="text-sm text-slate-500">Next 4 hours</span>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">John Doe</p>
                  <p className="text-sm text-slate-500">General Checkup</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">2:30 PM</p>
                <p className="text-sm text-slate-500">Dr. Smith</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;