import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { crearTarea } from '@services/tareas.service.js';
import { getMechanics } from '@services/user.service.js';
import { getBicicletas } from '@services/ingresoBicicletas.service.js';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const CrearTarea = () => {
  const navigate = useNavigate();
  const [mecanicos, setMecanicos] = useState([]);
  const [bicicletas, setBicicletas] = useState([]); // Nuevo estado para bicicletas

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar mecánicos
        const mecanicosData = await getMechanics();
        console.log("Mecánicos cargados:", mecanicosData);
        setMecanicos(mecanicosData);

        // Cargar bicicletas
        const bicicletasData = await getBicicletas();
        console.log("Bicicletas cargadas:", bicicletasData);
        setBicicletas(bicicletasData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        showErrorAlert('Error', 'No se pudieron cargar los datos.');
      }
    };

    cargarDatos();
  }, []);

  const handleBack = () => {
    navigate('/tareas');
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        detalle: data.detalle,
        prioridad: data.prioridad,
        id: data.id, // ID del mecánico seleccionado
        id_bici: data.id_bici, // ID de la bicicleta seleccionada
      };

      console.log("Datos enviados al backend:", payload);

      const response = await crearTarea(payload);
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
              label: mecanico.nombreCompleto,
            })),
            required: true,
          },
          {
            label: 'Bicicleta', // Nuevo campo para bicicletas
            name: 'id_bici',
            fieldType: 'select',
            options: bicicletas, // Opciones cargadas desde el estado
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
