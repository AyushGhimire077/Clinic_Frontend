import { Pagination } from "@mui/material";
import {
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { BackButton } from "../../../component/global/components/back/back";
import type { IAppointment } from "../helper/appointment.interface";
import { useAppointmentStore } from "../helper/appointment.store";

const AppointmentTable = () => {
  const { appointments, getAllAppointments, filterByStatus } =
    useAppointmentStore();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      await getAllAppointments({ page, size });
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [page]);

  useEffect(() => {
    async function filter() {
      await filterByStatus(statusFilter, { page, size });
    }
    filter();
  }, [statusFilter]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      BOOKED: "bg-blue-100 text-blue-700 border-blue-200",
      CHECKED_IN: "bg-green-100 text-green-700 border-green-200",
      COMPLETED: "bg-purple-100 text-purple-700 border-purple-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
      MISSED: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-slate-100 text-slate-700 border-slate-200"
    );
  };

  const getBillingModeColor = (mode: string) => {
    const colors = {
      PER_VISIT: "bg-indigo-100 text-indigo-700",
      PACKAGE: "bg-pink-100 text-pink-700",
      INSURANCE: "bg-teal-100 text-teal-700",
    };
    return colors[mode as keyof typeof colors] || "bg-slate-100 text-slate-700";
  };

  const handleAction = (appointment: IAppointment, action: string) => {
    switch (action) {
      case "view":
        navigate(`/appointment/view/${appointment.id}`, {
          state: { appointment },
        });
        break;
      case "edit":
        navigate(`/appointment/edit?appointmentId=${appointment.id}`, {
          state: { appointment },
        });
        break;
    }
  };

  const statusOptions = [
    { value: "ALL", label: "All Appointments" },
    { value: "BOOKED", label: "Booked" },
    { value: "CHECKED_IN", label: "Checked In" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "MISSED", label: "Missed" },
  ];

  const totalPages = Math.ceil(appointments.length / size) || 1;

  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-[90em] mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="bg-surface rounded-lg shadow-soft border border-border p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Appointment Management
              </h1>
              <p className="text-muted">
                View and manage all patient appointments and schedules
              </p>
            </div>
            <button
              onClick={() => navigate("/appointment/create")}
              className="px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors focus-ring flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              New Appointment
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setStatusFilter(option.value);
                  setPage(0);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all font-medium text-sm border ${
                  statusFilter === option.value
                    ? "bg-primary text-white border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface rounded-lg shadow-soft border border-border overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-light border-t-primary rounded-full animate-spin" />
                <p className="text-muted">Loading appointments...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface border-b border-border">
                    <tr>
                      {[
                        "Patient",
                        "Doctor",
                        "Episode",
                        "Date & Time",
                        "Billing Mode",
                        "Package Charge",
                        "Duration",
                        "Status",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-muted">
                            <Calendar className="w-12 h-12 mb-4 text-muted/30" />
                            <p className="text-lg font-medium text-foreground mb-2">
                              No appointments found
                            </p>
                            <p className="text-sm">
                              {statusFilter !== "ALL"
                                ? `No ${statusFilter.toLowerCase()} appointments`
                                : "Get started by scheduling your first appointment"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="hover:bg-surface/50 transition-colors"
                        >
                          {/* Patient */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-foreground">
                                  {appointment.episode.patient.name}
                                </p>
                                <p className="text-sm text-muted">
                                  {appointment.episode.patient.contactNumber}
                                </p>
                                <p className="text-xs text-muted mt-1">
                                  DOB:{" "}
                                  {formatDate(
                                    appointment.episode.patient.dateOfBirth
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Doctor */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="font-medium text-foreground">
                                  Dr. {appointment.episode.primaryDoctor.name}
                                </p>
                                <p className="text-sm text-muted">
                                  {appointment.episode.primaryDoctor.role}
                                </p>
                                {appointment.episode.primaryDoctor
                                  .doctorSubType && (
                                  <p className="text-xs text-muted mt-1">
                                    {
                                      appointment.episode.primaryDoctor
                                        .doctorSubType
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Episode */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">
                                {appointment.episode.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${getBillingModeColor(
                                    appointment.episode.billingMode
                                  )}`}
                                >
                                  {appointment.episode.billingMode}
                                </span>
                                <span className="text-xs px-2 py-1 bg-surface text-foreground rounded border border-border">
                                  {appointment.episode.type}
                                </span>
                              </div>
                              <p className="text-xs text-muted">
                                {formatDate(appointment.episode.startDate)} -{" "}
                                {formatDate(
                                  appointment.episode.endDate || "Present"
                                )}
                              </p>
                            </div>
                          </td>

                          {/* Date & Time */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {formatDateTime(appointment.scheduledDateTime)}
                              </span>
                            </div>
                          </td>

                          {/* Billing Mode */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBillingModeColor(
                                appointment.episode.billingMode
                              )}`}
                            >
                              {appointment.episode.billingMode.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          {/* Package Charge */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <span className="font-medium text-foreground">
                                Rs. {appointment.episode.packageCharge}
                              </span>
                            </div>
                          </td>

                          {/* Duration */}
                          <td className="px-6 py-4">
                            <div className="text-sm text-muted">
                              <p>
                                Start:{" "}
                                {formatDate(appointment.episode.startDate)}
                              </p>
                              {appointment.episode.endDate && (
                                <p>
                                  End: {formatDate(appointment.episode.endDate)}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleAction(appointment, "view")
                                }
                                className="p-2 text-primary hover:bg-primary-light rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(appointment, "edit")
                                }
                                className="p-2 text-warning hover:bg-warning/10 rounded-lg transition-colors"
                                title="Edit Appointment"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {appointments.length > 0 && (
                <div className="px-6 py-4 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-muted">
                      Showing {page * size + 1} -{" "}
                      {Math.min((page + 1) * size, appointments.length)} of{" "}
                      {appointments.length} appointments
                    </p>
                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      color="primary"
                      shape="rounded"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: "8px",
                          margin: "0 2px",
                          fontSize: "0.875rem",
                        },
                        "& .Mui-selected": {
                          backgroundColor: "#0891b2 !important",
                          color: "white",
                        },
                        "& .MuiPaginationItem-root:hover": {
                          backgroundColor: "#f0f9ff",
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentTable;
