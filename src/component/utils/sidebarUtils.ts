import { TbDashboard } from "react-icons/tb";
import { MdOutlinePeople, MdOutlinePayments } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import { AiOutlineCalendar, AiOutlineStock } from "react-icons/ai";
import { FaNotesMedical } from "react-icons/fa";
import { RiServiceLine } from "react-icons/ri";
import { FiPackage } from "react-icons/fi";
import { IoReceiptSharp } from "react-icons/io5";
import { BsPrescription } from "react-icons/bs";

export const getSidebarItems = [
  { icon: TbDashboard, label: "Dashboard", url: "/", key: "dashboard" },
  { icon: MdOutlinePeople, label: "Staff", url: "staff", key: "staff" },
  { icon: HiOutlineUser, label: "Patient", url: "patient", key: "patient" },
  {
    icon: AiOutlineCalendar,
    label: "Appointment",
    url: "appointment",
    key: "appointment",
  },
  { icon: FaNotesMedical, label: "Episode", url: "episode", key: "episode" },
  { icon: RiServiceLine, label: "Services", url: "services", key: "services" },
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
  { icon: FiPackage, label: "Pharmacy", url: "pharmacy", key: "pharmacy" },
];
