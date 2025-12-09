// import type {
//   AppointmentStatus,
//   IResponse,
//   PaginationInfo,
// } from "../../../component/global/interface";
// import type { IEpisode } from "../../episode/helper/episode.interface";
// import type { IStaff } from "../../staff/componet/staff/helper/interface";

// export interface IAppointment {
//   id: string;
//   episode: IEpisode;
//   doctor: IStaff;
//   scheduledDateTime: string;
//   status: AppointmentStatus;
// }

// export interface IAppointmentRequest {
//   episodeId: string;
//   doctorId: string;
//   scheduledDateTime: string;
//   status: AppointmentStatus;
// }

// export interface AppointmentState {
//   appointments: IAppointment[];

//   create: (data: IAppointmentRequest) => Promise<IResponse>;

//   getAllAppointments: (pagination: PaginationInfo) => Promise<IResponse>;

//   getByStatus: (
//     stats: string,
//     pagination: PaginationInfo
//   ) => Promise<IResponse>;

//   update: (
//     id: string,
//     data: Partial<IAppointmentRequest>
//   ) => Promise<IResponse>;
// }
