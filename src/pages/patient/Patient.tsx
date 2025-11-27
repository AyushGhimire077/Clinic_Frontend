import { useNavigate } from "react-router-dom";
import { usePatientStore } from "./componet/helper/store";
import { useEffect } from "react";

const Patient = () => {
  const navigate = useNavigate();

  const { getAllPatients, patientList } = usePatientStore();

  const quickActions = [
    {
      title: "Add New Patient",
      description: "Register a new patient in the system",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      onClick: () => navigate("add-patient"),
      color: "from-teal-500 to-blue-600",
    },
    {
      title: "View All Patients",
      description: "Browse and manage patient records",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      onClick: () => navigate("view-patients"),
      color: "from-blue-500 to-teal-600",
    },
  ];

  useEffect(() => {
    getAllPatients({ page: 0, size: 10 });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-linear-to-br from-teal-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Patient Management
        </h1>
        <p className="text-slate-600">
          Manage patient records and appointments efficiently
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group text-left`}
          >
            <div
              className={`w-14 h-14 bg-linear-to-r ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}
            >
              {action.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {action.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {action.description}
            </p>
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-medium text-teal-600">
                Get Started
              </span>
              <svg
                className="w-5 h-5 text-teal-500 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {patientList.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Active Patients
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {patientList.map((patient) => patient.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;
