// import React, { useEffect, useState } from "react";
// import { useAppointmentStore } from "../helper/store";
// import type { IAppointment } from "../helper/interface";
// import { Pagination } from "@mui/material";
// import Back from "../../../component/global/back/back";
// import { FaRegEye } from "react-icons/fa";
// import { TbInvoice } from "react-icons/tb";
// import { MdUpdate } from "react-icons/md";
// import {  useNavigate } from "react-router-dom";

// const AppointmentTable = () => {
//   const { appointments, getAllAppointments, getByStatus } =
//     useAppointmentStore();

//   const [page, setPage] = useState(0);
//   const [size] = useState(10);
//   const [statusFilter, setStatusFilter] = useState<string>("ALL");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
 
//   const loadAppointments = async () => {
//     setLoading(true);
//     try {
//       if (statusFilter === "ALL") {
//         await getAllAppointments({page, size });
//       } else {
//         await getByStatus(statusFilter, {page, size });
//       }
//     } catch (error) {
//       console.error("Failed to load appointments:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAppointments();
//   }, [page, statusFilter]);

//   const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
//     setPage(value - 1);
//   };

//   const formatDateTime = (dateTime: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateTime).toLocaleDateString(undefined, options);
//   };

//   const handleStatusChange = (newStatus: string) => {
//     setStatusFilter(newStatus);
//     setPage(0);
//   };

//   const handleAppointmentAction = (
//     appointment: IAppointment,
//     action: string
//   ) => {
//     console.log(appointment.id);
//     switch (action) {
//       case "view":
//         navigate(`/appointment/view/${appointment.id}`, {
//           state: { appointment },
//         });
//         break;
//       case "update":
//         navigate(`/update/${appointment.id}`, {
//           state: { appointment },
//         });
//         break;
//       case "invoice":
//         navigate(`invoices/create`, { state: { appointment } });
//         break;
//       default:
//         break;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     const colors = {
//       OPEN: "bg-yellow-50 text-yellow-700 border-yellow-200",
//       PAID: "bg-blue-50 text-blue-700 border-blue-200",
//       CANCELLED: "bg-red-50 text-red-700 border-red-200",
//     };
//     return (
//       colors[status as keyof typeof colors] ||
//       "bg-slate-50 text-slate-700 border-slate-200"
//     );
//   };

//   const totalPages = Math.ceil(appointments.length / size) || 1;

//   const statusOptions = [
//     { value: "ALL", label: "All Appointments" },
//     { value: "OPEN", label: "OPEN" },
//     { value: "PAID", label: "PAID" },
//     { value: "CANCELLED", label: "CANCELLED" },
//   ];

//   console.log(appointments);

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-6">
//         <Back />
//       </div>

//       {/* Header Section */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-800 mb-3">
//               Appointment Management
//             </h1>
//             <p className="text-slate-600 text-lg">
//               View and manage all patient appointments and schedules
//             </p>
//           </div>
//         </div>

//         {/* Status Filter */}
//         <div className="flex flex-wrap gap-2">
//           {statusOptions.map((option) => (
//             <button
//               key={option.value}
//               onClick={() => handleStatusChange(option.value)}
//               className={`px-4 py-2 rounded-xl transition-all duration-200 font-semibold border ${
//                 statusFilter === option.value
//                   ? "bg-teal-50 text-teal-700 border-teal-200 shadow-sm"
//                   : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
//               }`}
//             >
//               {option.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="flex flex-col items-center gap-4">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//               <p className="text-slate-600">Loading appointments...</p>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-linear-to-r from-slate-50 to-blue-50/30">
//                   <tr>
//                     {[
//                       "Patient",
//                       "Doctor",
//                       "Date & Time",
//                       "Services",
//                       "Status",
//                       "Invoice Type",
//                       "Actions",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-100"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {appointments.length === 0 ? (
//                     <tr>
//                       <td colSpan={6} className="px-6 py-16 text-center">
//                         <div className="flex flex-col items-center justify-center text-slate-500">
//                           <FaRegEye className="w-12 h-12 mb-4" />
//                           <p className="text-lg font-medium text-slate-700 mb-2">
//                             No appointments found
//                           </p>
//                           <p className="text-sm text-slate-500">
//                             {statusFilter !== "ALL"
//                               ? `No ${statusFilter.toLowerCase()} appointments`
//                               : "Get started by scheduling your first appointment"}
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : (
//                     appointments.map((appointment) => (
//                       <tr
//                         key={appointment.id}
//                         className="hover:bg-slate-50/50 transition-colors duration-150 group"
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-linear-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center">
//                               <span className="text-xs font-semibold text-white">
//                                 {appointment.patient.name
//                                   .split(" ")
//                                   .map((n : any) => n[0])
//                                   .join("")}
//                               </span>
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold text-slate-800">
//                                 {appointment.patient.name}
//                               </p>
//                               <p className="text-xs text-slate-500">
//                                 {appointment.patient.contactNumber}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 bg-blue-100 rounded-2xl flex items-center justify-center">
//                               <svg
//                                 className="w-4 h-4 text-blue-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                                 />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="text-sm font-semibold text-slate-800">
//                                 Dr. {appointment.doctor.name}
//                               </p>
//                               <p className="text-xs text-slate-500">
//                                 {appointment.doctor.type || "General"}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <p className="text-sm font-semibold text-slate-800">
//                             {formatDateTime(appointment.dateTime)}
//                           </p>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex   flex-wrap gap-1">
//                             {appointment.services
//                               .slice(0, 2)
//                               .map((s, index) => (
//                                 <span
//                                   key={index}
//                                   className="inline-block  font-bold capitalize px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full"
//                                 >
//                                   {s.name}
//                                   <p> {s.charge}</p>
//                                 </span>
//                               ))}
//                             {appointment.services.length > 2 && (
//                               <span className="inline-block px-2 mt-2 py-1 text-xs bg-slate-200 text-slate-600 rounded-full">
//                                 +{appointment.services.length - 2} more
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs
//                                font-medium border ${getStatusColor(
//                                  appointment.status
//                                )}`}
//                           >
//                             {appointment.status}
//                           </span>
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <p className="text-sm font-semibold text-slate-800">
//                             {appointment.invoiceType}
//                           </p>
//                         </td>

//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             {appointment.status === "OPEN" && (
//                               <button
//                                 onClick={() => {
//                                   handleAppointmentAction(
//                                     appointment,
//                                     "update"
//                                   );
//                                 }}
//                                 className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
//                               >
//                                 <MdUpdate className="w-4 h-4" />
//                               </button>
//                             )}

//                             <button
//                               onClick={() =>
//                                 handleAppointmentAction(appointment, "invoice")
//                               }
//                               className="p-2 text-green-400 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200"
//                             >
//                               <TbInvoice className="w-4 h-4" />
//                             </button>

//                             <button
//                               onClick={() =>
//                                 handleAppointmentAction(appointment, "view")
//                               }
//                               className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors duration-200"
//                             >
//                               <FaRegEye className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {appointments.length > 0 && (
//               <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
//                 <div className="flex items-center justify-between">
//                   <p className="text-sm text-slate-600">
//                     Showing {page * size + 1}-
//                     {Math.min((page + 1) * size, appointments.length)} of{" "}
//                     {appointments.length} appointments
//                   </p>
//                   <Pagination
//                     count={totalPages}
//                     page={page + 1}
//                     onChange={handlePageChange}
//                     color="primary"
//                     shape="rounded"
//                     sx={{
//                       "& .MuiPaginationItem-root": {
//                         borderRadius: "10px",
//                         margin: "0 2px",
//                       },
//                       "& .Mui-selected": {
//                         backgroundColor: "#0d9488 !important",
//                         color: "white",
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppointmentTable;
