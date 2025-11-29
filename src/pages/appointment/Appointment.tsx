import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Appointment Page</div>

      <button onClick={() => navigate("create")}>Create appointment</button>
      <button onClick={() => navigate("view-appointment")}>Appointments</button>
    </>
  );
};

export default Appointment;
