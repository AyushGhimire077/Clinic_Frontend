import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdUpdate } from "react-icons/md";
import { TbInvoice } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../component/global/components/back/back";
import { useAppointmentStore } from "../helper/appointment.store";
import type { IAppointment } from "../helper/appointment.interface";

const AppointmentTable = () => {
  const { appointments, getAllAppointments, getByStatus } = useAppointmentStore();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    setLoading(true);
    try {
      if (statusFilter === "ALL") {
        await getAllAppointments({ page, size });
      } else {
        await getByStatus(statusFilter, { page, size });
      }
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [page, statusFilter]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
  };

  const formatDateTime = (dateTime: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTime).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  const handleAppointmentAction = (appointment: IAppointment, action: string) => {
    switch (action) {
      case "view":
        navigate(`/appointment/view/${appointment.id}`, { state: { appointment } });
        break;
      case "update":
        navigate(`/appointment/update/${appointment.id}`, { state: { appointment } });
        break;
      case "invoice":
        navigate(`/invoices/create`, { state: { appointment } });
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: "bg-yellow-50 text-yellow-700 border-yellow-200",
      PAID: "bg-blue-50 text-blue-700 border-blue-200",
      CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const totalPages = Math.ceil(appointments.length / size) || 1;

  const statusOptions = [
    { value: "ALL", label: "All Appointments" },
    { value: "OPEN", label: "OPEN" },
    { value: "PAID", label: "PAID" },
    { value: "CANCELLED", label: "CANCELLED" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <BackButton />
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Appointment Management</h1>
            <p className="text-slate-600 text-lg">
              View and manage all patient appointments and schedules
            </p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold border ${statusFilter === option.value
                ? "bg-teal-50 text-teal-700 border-teal-200 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="text-slate-600">Loading appointments...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-slate-50 to-blue-50/30">
                  <tr>
                    {[
                      "Patient",
                      "Doctor",
                      "Episode",
                      "Appointment Date & Time",
                      "Billing Mode",
                      "Package Charge",
                      "Appointment",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-100"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <FaRegEye className="w-12 h-12 mb-4" />
                          <p className="text-lg font-medium text-slate-700 mb-2">No appointments found</p>
                          <p className="text-sm text-slate-500">
                            {statusFilter !== "ALL"
                              ? `No ${statusFilter.toLowerCase()} appointments`
                              : "Get started by scheduling your first appointment"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                        {/* Patient */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">{appt.episode?.patient?.name}</p>
                          <p className="text-xs text-slate-500">{appt.episode?.patient?.contactNumber}</p>
                        </td>

                        {/* Doctor */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">{appt.episode.primaryDoctor?.name}</p>
                          <p className="text-xs text-slate-500">{appt.episode.primaryDoctor?.type || "General"}</p>
                        </td>

                        {/* Episode */}
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-800">{appt.episode?.title}</p>
                          <p className="text-xs text-slate-500">{appt.episode?.type}</p>
                        </td>

                        {/* Date & Time */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-800">{formatDateTime(appt.scheduledDateTime)}</p>
                        </td>

                        {/* Billing Mode */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-800">{appt.episode?.billingMode}</p>
                        </td>

                        {/* Package Charge */}
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-800">{appt.episode?.packageCharge}</p>
                        </td>

                        {/* Appointment Checkbox */}
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={appt.episode?.appointment} disabled />
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAppointmentAction(appt, "update")}
                              className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                            >
                              <MdUpdate className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appt, "invoice")}
                              className="p-2 text-green-400 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
                            >
                              <TbInvoice className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAppointmentAction(appt, "view")}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                            >
                              <FaRegEye className="w-4 h-4" />
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
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing {page * size + 1}-{Math.min((page + 1) * size, appointments.length)} of {appointments.length} appointments
                  </p>
                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: "10px",
                        margin: "0 2px",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#0d9488 !important",
                        color: "white",
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
  );
};

export default AppointmentTable;
