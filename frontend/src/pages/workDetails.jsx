import { useParams } from 'react-router-dom';
import useGetWorkDetails from '@hooks/works/useGetWorkDetails.jsx'; // Hook para obtener los detalles
import { useEffect, useState } from 'react';
import '@styles/workDetails.css'; // Estilo para la página

const WorkDetails = () => {
  const { workId } = useParams(); // Obtén el ID del trabajo desde la URL
  const { fetchWorkDetails } = useGetWorkDetails(); // Hook para cargar los datos
  const [work, setWork] = useState(null); // Estado para guardar los datos del trabajo

  useEffect(() => {
    const loadWorkDetails = async () => {
      const workData = await fetchWorkDetails(workId); // Llama al API o estado global
      setWork(workData);
    };

    loadWorkDetails();
  }, [workId, fetchWorkDetails]);

  if (!work) {
    return <div>Cargando detalles del trabajo...</div>; // Loader mientras se cargan los datos
  }

  return (
    <div className="work-details-container">
      <h1>Detalles del Trabajo</h1>
      <div className="work-details">
        <p><strong>ID Reparación:</strong> {work.id_reparacion}</p>
        <p><strong>Bicicleta:</strong> {work.bicicleta}</p>
        <p><strong>Cliente:</strong> {work.nombre}</p>
        <p><strong>Tipo de Trabajo:</strong> {work.tipo_trabajo}</p>
        <p><strong>Estado:</strong> {work.estado}</p>
        <p><strong>Fecha de Ingreso:</strong> {work.fechaIngreso}</p>
        <p><strong>Observaciones:</strong> {work.obs_bici || 'Ninguna'}</p>
        <p><strong>Repuestos:</strong> {work.repuestos || 'Ninguno'}</p>
        <p><strong>Precio:</strong> ${work.precio}</p>
        <p><strong>Fecha de Entrega Estimada:</strong> {work.fecha_est_entrega || 'No especificada'}</p>
      </div>
    </div>
  );
};

export default WorkDetails;
