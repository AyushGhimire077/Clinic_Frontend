import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePatientStore } from "../helper/patient.store";

const PatientPopup = () => {
  const navigate = useNavigate();
  const { recentlyAddedPaitnet, clearRecentlyAddedPatient } = usePatientStore();

  useEffect(() => {
    if (!recentlyAddedPaitnet) return;

    const timer = setTimeout(() => clearRecentlyAddedPatient(), 8000);
    return () => clearTimeout(timer);
  }, [recentlyAddedPaitnet]);

  if (!recentlyAddedPaitnet) return null;

  return (
    <div
      onClick={() =>
        navigate(`/episode/add?patientId=${recentlyAddedPaitnet.id}`)
      }
      className="
        fixed top-6 right-6 
        bg-success border border-border
        text-success 
        px-5 py-4 rounded-xl 
        shadow-soft
        cursor-pointer 
        animate-slide-up
        w-[300px]
      "
    >
      <h1 className="font-semibold  **:">
        Create episode for <b>{recentlyAddedPaitnet.name}</b>
      </h1>
      <p className="text-sm text-muted mt-1">Tap to continue</p>
    </div>
  );
};

export default PatientPopup;
