import { FaClipboardList, FaPlus, FaTags } from "react-icons/fa";
import { FiEye, FiFileText } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const EpisodeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-primary-light border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Episode Dashboard</h1>
              <p className="text-foreground mt-1">
                Manage all patient treatment episodes in one place
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("view")}
                className="px-5 py-2.5 bg-surface rounded-lg text-primary border border-primary font-medium shadow-soft hover:shadow-md transition"
              >
                View Episodes
              </button>

              <button
                onClick={() => navigate("add")}
                className="px-5 py-2.5 rounded-lg bg-primary text-background  border border-primary font-medium shadow-soft hover:shadow-md transition"

              >
                + Create Episode
              </button>
            </div>
          </div>
        </div>

        {/* GRID SHORTCUTS */}
        <div className="grid grid-cols-1   sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          <button
            onClick={() => navigate("add")}
            className="bg-surface border border-border rounded-xl shadow-soft p-6 flex flex-col items-center group hover:border-primary  hover:shadow-md transition"
          >
            <div className="p-3 bg-primary-light rounded-lg group-hover:bg-primary/20">
              <FaPlus className="text-primary-dark text-xl" />
            </div>
            <p className="mt-4 font-semibold text-foreground">New Episode</p>
            <p className="text-muted text-sm">Create treatment episode</p>
          </button>

          <button
            onClick={() => navigate("templates/add")}
            className="bg-surface border border-border rounded-xl shadow-soft p-6 flex flex-col items-center group hover:border-info hover:shadow-md transition"
          >
            <div className="p-3 bg-info/20 rounded-lg group-hover:bg-info/30">
              <FaClipboardList className="text-info text-xl" />
            </div>
            <p className="mt-4 font-semibold text-foreground">New Template</p>
            <p className="text-muted text-sm">Standardize episodes</p>
          </button>

          <button
            onClick={() => navigate("templates/view")}
            className="bg-surface border border-border rounded-xl shadow-soft p-6 flex flex-col items-center group hover:border-warning hover:shadow-md transition"
          >
            <div className="p-3 bg-warning/20 rounded-lg group-hover:bg-warning/30">
              <FaTags className="text-warning text-xl" />
            </div>
            <p className="mt-4 font-semibold text-foreground">View Templates</p>
            <p className="text-muted text-sm">Browse all templates</p>
          </button>

          <button
            onClick={() => navigate("view")}
            className="bg-surface border border-border rounded-xl shadow-soft p-6 flex flex-col items-center group hover:border-muted hover:shadow-md transition"
          >
            <div className="p-3 bg-muted/20 rounded-lg group-hover:bg-muted/30">
              <FiEye className="text-muted text-xl" />
            </div>
            <p className="mt-4 font-semibold text-foreground">All Episodes</p>
            <p className="text-muted text-sm">Manage records</p>
          </button>

        </div>

        {/* BIG CENTER CARD */}
        <div className="bg-surface border border-border rounded-2xl shadow-soft p-10 mt-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-primary-light rounded-2xl flex items-center justify-center">
              <FiFileText className="w-12 h-12 text-primary-dark" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">
            Episode Management Center
          </h2>

          <p className="text-muted max-w-xl mx-auto text-lg">
            Handle clinical treatments, templates, billing mode, and more — all from one clean dashboard.
          </p>
        </div>

        {/* TIPS */}
        <div className="mt-8 p-6 bg-info/20 border border-info/40 rounded-xl">
          <h3 className="font-semibold text-info mb-2">💡 Quick Tips</h3>
          <ul className="text-info/90 text-sm space-y-1">
            <li>• Use templates for repetitive treatment episodes.</li>
            <li>• Create episodes directly from patient profile for faster workflow.</li>
            <li>• Use filters inside “View Episodes” to manage treatment progress quickly.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default EpisodeDashboard;
