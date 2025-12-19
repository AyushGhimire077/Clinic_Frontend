import { Users, UserPlus, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "./helper/patient.store";
import PatientPopup from "./componet/PatientPopup";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { fetchCount, count, fetchAll, list } =
    usePatientStore();

  const cards = [
    {
      title: "Add New Patient",
      description: "Register a new patient",
      icon: UserPlus,
      color: "from-primary to-primary-dark",
      onClick: () => navigate("add"),
    },
    {
      title: "View All Patients",
      description: "Browse all patient records",
      icon: Users,
      color: "from-info to-info",
      onClick: () => navigate("view"),
    },
  ];

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PatientPopup />

        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center bg-linear-to-br from-primary to-primary-dark shadow-soft">
            <Users className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mt-4">
            Patient Management
          </h1>
          <p className="text-muted text-sm">Manage and monitor your patients</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((item) => {
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

                  <ChevronRight className="w-5 h-5 text-muted transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-primary">
              {count?.total ?? "0"}
            </div>
            <div className="text-sm text-muted">Total Patients</div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-success">
              {count?.active ?? "0"}
            </div>
            <div className="text-sm text-muted">Active Patients</div>
          </div>

          <div className="p-4 bg-surface border border-border rounded-xl shadow-soft">
            <div className="text-3xl font-bold text-primary-dark">
              {count?.oneTime ?? "0"}
            </div>
            <div className="text-sm text-muted">One-Time Patients</div>
          </div>
        </div>

        {/* recntly  top 3 */}
        {list.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Patients
            </h3>
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="divide-y divide-border">
                {list.slice(0, 3).map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 flex items-center justify-between hover:bg-primary-light/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {patient.name}
                        </p>
                        <p className="text-sm text-muted">
                          {patient.gender.toLowerCase()} • {patient.bloodGroup}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${patient.isActive
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                        }`}
                    >
                      {patient.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                ))}
              </div>
              {list.length > 3 && (
                <div className="p-4 border-t border-border text-center">
                  <button
                    onClick={() => navigate("view")}
                    className="text-primary hover:text-primary-dark font-medium text-sm"
                  >
                    View all {list.length} patients
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
