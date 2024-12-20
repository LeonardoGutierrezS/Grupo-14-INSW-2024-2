import { useCallback } from "react";
import axios from "axios";

const useGetWorkDetails = () => {
  const fetchWorkDetails = useCallback(async (workId) => {
    try {
      const response = await axios.get(`/api/works/${workId}`); // Verifica que esta URL sea correcta
      console.log("Datos recibidos desde el backend:", response.data); // Agrega este log para depurar
      return response.data;
    } catch (error) {
      console.error("Error al obtener los detalles del trabajo:", error);
      throw error;
    }
  }, []);

  return { fetchWorkDetails };
};

export default useGetWorkDetails;
