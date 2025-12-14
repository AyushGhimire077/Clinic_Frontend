// vist.interface.ts
import type { VisitStatus } from "../../../component/constant/enums";
import type { IResponse } from "../../../component/constant/global.interface";
import type { IEpisode } from "../../episode/helper/episode.interface";
import type { IPatient } from "../../patient/helper/patient.interface";
import type { IServices } from "../../services/services.helper/services.interface";
import type { IStaff } from "../../staff/staff.helper/staff.interface";

export interface IVisit {
  id: string;
  status: VisitStatus;
  patient: IPatient;
  episode: IEpisode;
  note: string;
  doctor: IStaff;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;

  prescribedMedicines: string[];
  services: IServices[];
}

export interface IVisitCreate {
  episodeId: string;
  patientId: string;
  doctorId: string;
  status?: VisitStatus;

  serviceIds?: number[];
  note?: string;
  prescribedMedicines?: string[];
}

export interface IVisitState {
  visitList: IVisit[];
  loading: boolean;
  filter: VisitStatus | "";
  setFilter: (status: VisitStatus | "") => void;

  startDate?: string | null;
  endDate?: string | null;
  setEndDate: (date: string) => void;
  setStartDate: (date: string) => void;

  updateVisit: (id: string, data: IVisitCreate) => Promise<IResponse>;
  startVisit: (id: string) => Promise<IResponse>;
  completeVisit: (id: string) => Promise<IResponse>;
  cancelVisit: (id: string) => Promise<IResponse>;
  getVisitById: (id: string) => Promise<IResponse>;
  countByStatus: (status: string) => Promise<IResponse>;
  getVisitsByStatus: (
    status: VisitStatus,
    page?: number,
    size?: number
  ) => Promise<IResponse>;
}
