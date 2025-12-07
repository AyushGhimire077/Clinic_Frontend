import { Routes, Route, useNavigate, Outlet } from "react-router-dom";

const Episode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Episode Management
              </h1>
              <p className="text-slate-600 mt-2">
                Manage patient treatment episodes
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("view")}
                className="px-5 py-2.5 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                View Episodes
              </button>
              <button
                onClick={() => navigate("create")}
                className="px-5 py-2.5 text-white rounded-xl transition-colors font-medium shadow-sm bg-[linear-gradient(135deg,#0d9488_0%,#0369a1_100%)] hover:shadow-md"
              >
                + New Episode
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px]">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">
              Welcome to Episode Management
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create and manage patient treatment episodes. Track appointments,
              billing, and treatment progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("create")}
                className="px-6 py-3 text-white rounded-xl transition-colors font-medium bg-[linear-gradient(135deg,#0d9488_0%,#0369a1_100%)] hover:shadow-md"
              >
                Create New Episode
              </button>
              <button
                onClick={() => navigate("view")}
                className="px-6 py-3 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Browse Episodes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Episode;
