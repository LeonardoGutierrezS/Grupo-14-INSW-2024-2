import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { crearTarea } from '@services/tareas.service.js';
import { getMechanics } from '@services/user.service.js'; 
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const CrearTarea = () => {
  const navigate = useNavigate();
  const [mecanicos, setMecanicos] = useState([]); 

  useEffect(() => {
    const cargarMecanicos = async () => {
      try {
        const data = await getMechanics(); 
        console.log("Mecánicos cargados:", data);
        setMecanicos(data); 
      } catch (error) {
        console.error('Error al obtener mecánicos:', error);
        showErrorAlert('Error', 'No se pudieron cargar los mecánicos.');
      }
    };

    cargarMecanicos();
  }, []);

  const handleBack = () => {
    navigate('/tareas');
  };

  const onSubmit = async (data) => {
    try {
      const response = await crearTarea(data);
      if (response) {
        showSuccessAlert('¡Creada!', 'La tarea se ha agregado correctamente.');
        navigate('/tareas');
      } else {
        showErrorAlert('Error', 'Ocurrió un error al crear la tarea.');
      }
    } catch (error) {
      console.error('Error al crear la tarea:', error);
      showErrorAlert('Error', 'Ocurrió un error al crear la tarea.');
    }
  };

  return (
    <main className="container">
      <Form
        title="Crear Nueva Tarea"
        fields={[
          {
            label: 'Detalle',
            name: 'detalle',
            placeholder: 'Descripción de la tarea',
            fieldType: 'input',
            type: 'text',
            required: true,
          },
          {
            label: 'Prioridad',
            name: 'prioridad',
            fieldType: 'select',
            options: [
              { value: 'baja', label: 'Baja' },
              { value: 'media', label: 'Media' },
              { value: 'alta', label: 'Alta' },
            ],
            required: true,
          },
          {
            label: 'Mecánico',
            name: 'id', 
            fieldType: 'select',
            options: mecanicos.map((mecanico) => ({
              value: mecanico.id,  
              label: mecanico.nombreCompleto 
            })),
            required: true,
          },
        ]}
        onSubmit={onSubmit}
        footerContent={
          <div className="button-container">
            <button type="submit" className="create-button">
              Crear Tarea
            </button>
            <button type="button" onClick={handleBack} className="back-button">
              Volver
            </button>
          </div>
        }
      />
    </main>
  );
};

export default CrearTarea;