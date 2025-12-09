import { useNavigate } from "react-router-dom";
import {
  FaFileMedical,
  FaPlus,
  FaEye,
  FaTags,
  FaClipboardList,
} from "react-icons/fa";
import { FiFileText, FiEye } from "react-icons/fi";

const EpisodeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Episode Management
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage patient treatment episodes efficiently
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("view")}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium hover:border-gray-400"
              >
                <FiEye className="text-lg" />
                View Episodes
              </button>
              <button
                onClick={() => navigate("add")}
                className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #059669 0%, #0d9488 100%)",
                }}
              >
                <FaPlus />
                New Episode
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FaFileMedical className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Episodes</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <FaClipboardList className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Templates</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <FaTags className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-24 h-24 bg-linear-to-br from-blue-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to Episode Management
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
              Streamline your patient care workflow. Create episodes, manage
              treatments, track progress, and handle billing—all in one place.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <button
                onClick={() => navigate("add")}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-teal-50 group-hover:bg-teal-100 mb-4">
                  <FaPlus className="text-teal-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Create Episode
                </h3>
                <p className="text-sm text-gray-500">Start new treatment</p>
              </button>

              <button
                onClick={() => navigate("templates/add")}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 mb-4">
                  <FaClipboardList className="text-blue-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  New Template
                </h3>
                <p className="text-sm text-gray-500">
                  Create reusable template
                </p>
              </button>

              <button
                onClick={() => navigate("templates/view")}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100 mb-4">
                  <FaTags className="text-purple-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  View Templates
                </h3>
                <p className="text-sm text-gray-500">Browse all templates</p>
              </button>

              <button
                onClick={() => navigate("view")}
                className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 mb-4">
                  <FaEye className="text-gray-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Browse All</h3>
                <p className="text-sm text-gray-500">View all episodes</p>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use templates to save time on recurring treatment plans</li>
            <li>• Track episode progress with our built-in monitoring tools</li>
            <li>• Set billing preferences per episode type</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDashboard;
