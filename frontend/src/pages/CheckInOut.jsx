import { useEffect, useState } from "react";
import { checkIn, checkOut, getActiveShift } from "@services/work.service";
import { showSuccessAlert, showErrorAlert } from "@helpers/sweetAlert";
import '@styles/checkInOut.css';
import '@styles/usersButtons.css';

const ShiftManagement = () => {
  const [activeShift, setActiveShift] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Formatea el tiempo en formato HH:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Inicia el cronómetro
  const startTimer = (checkInTime) => {
    const checkInDate = new Date(checkInTime);
    const timerId = setInterval(() => {
      const now = new Date();
      const elapsedTimeInSeconds = Math.floor((now - checkInDate) / 1000);
      setElapsedTime(elapsedTimeInSeconds);
    }, 1000);
    setIntervalId(timerId);
  };

  // Detiene el cronómetro
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  // Verifica si hay un turno activo al cargar la página
  useEffect(() => {
    const fetchActiveShift = async () => {
      try {
        const shift = await getActiveShift();
        if (shift) {
          setActiveShift(shift);
          startTimer(shift.check_in);
        }
      } catch (error) {
        console.error("Error al obtener el turno activo:", error);
      }
    };

    fetchActiveShift();

    return () => stopTimer(); // Detiene el cronómetro al desmontar
  }, []);

  // Maneja el Check-In
  const handleCheckIn = async () => {
    try {
      const response = await checkIn();
      if (response.status === "Success") {
        showSuccessAlert("¡Check-In Exitoso!", response.message);
        setActiveShift(response.data); // Guarda el turno activo
        startTimer(response.data.check_in); // Inicia el cronómetro
      } else {
        showErrorAlert("Error", response.message);
      }
    } catch (error) {
      console.error("Error al realizar el Check-In:", error);
      showErrorAlert("Error", "Ocurrió un problema al realizar el Check-In.");
    }
  };

  
  const handleCheckOut = async () => {
    try {
      const response = await checkOut();
      if (response.status === "Success") {
        showSuccessAlert("¡Check-Out Exitoso!", response.message);
        setActiveShift(null); 
        stopTimer(); 
        setElapsedTime(0); 
      } else {
        showErrorAlert("Error", response.message);
      }
    } catch (error) {
      console.error("Error al realizar el Check-Out:", error);
      showErrorAlert("Error", "Ocurrió un problema al realizar el Check-Out.");
    }
  };

  return (
    <div className="shift-management-container">
      <h1>Turno de hoy</h1>
      {activeShift ? (
        <div>
          <p>
            <strong>Turno iniciado:</strong>{" "}
            {new Date(activeShift.check_in).toLocaleString()}
          </p>
          <p>
            <strong>Tiempo transcurrido:</strong> {formatTime(elapsedTime)}
          </p>
          <button 
          className="button button-secondary"
          onClick={handleCheckOut}
          >
            Finalizar Turno
            </button>
        </div>
      ) : (
        <button
        className="button button-secondary"
        onClick={handleCheckIn}
        >
          Iniciar Turno
        </button>
      )}
    </div>
  );
};

export default ShiftManagement;
