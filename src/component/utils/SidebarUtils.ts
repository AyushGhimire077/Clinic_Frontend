import { AiOutlineStock } from "react-icons/ai";
import { BsPrescription } from "react-icons/bs";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoReceiptSharp } from "react-icons/io5";
import { MdOutlinePayments, MdOutlinePeople } from "react-icons/md";
import { RiProductHuntLine } from "react-icons/ri";
import { TbDashboard } from "react-icons/tb";

export const baseSidebarItems = [
  { icon: TbDashboard, label: "Dashboard", url: "", key: "dashboard" },
  { icon: MdOutlinePeople, label: "Staff", url: "staff", key: "staff" },
  {
    icon: HiOutlineDocumentReport,
    label: "Patient",
    url: "patient",
    key: "patient",
  },
  {
    icon: RiProductHuntLine,
    label: "Appointment",
    url: "appointment",
    key: "appointment",
  },
  {
    icon: MdOutlinePayments,
    label: "Payments",
    url: "payments",
    key: "payments",
  },
  { icon: IoReceiptSharp, label: "Billing", url: "billing", key: "billing" },
  {
    icon: BsPrescription,
    label: "Prescriptions",
    url: "prescriptions",
    key: "prescriptions",
  },
  {
    icon: AiOutlineStock,
    label: "Inventory",
    url: "inventory",
    key: "inventory",
  },
];
