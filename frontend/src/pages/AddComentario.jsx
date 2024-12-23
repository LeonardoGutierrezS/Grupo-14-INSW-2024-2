import { useNavigate } from 'react-router-dom';
import { crearComentario } from '@services/comentario.service.js';
import { obtenerTodasTareas } from '@services/tareas.service.js';
import { useEffect, useState } from 'react';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const AddComentario = () => {
  const navigate = useNavigate();
  const [tareas, setTareas] = useState([]); 
  const [tareaSeleccionada, setTareaSeleccionada] = useState(''); 

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const data = await obtenerTodasTareas();
        console.log("Tareas cargadas:", data); 
        setTareas(data || []);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
        showErrorAlert('Error', 'No se pudieron cargar las tareas.');
      }
    };

    cargarTareas();
  }, []);

  const handleBack = () => {
    navigate('/tareas'); 
  };

  const onSubmit = async (data) => {
    if (!tareaSeleccionada) {
      showErrorAlert('Error', 'Por favor, selecciona una tarea antes de continuar.');
      return;
    }

    try {
      const comentarioData = {
        comentario: data.comentario,
        id_tarea: tareaSeleccionada,
      };

      const response = await crearComentario(tareaSeleccionada,  comentarioData);
      
      if (response) {
        showSuccessAlert('¡Comentario Creado!', 'El comentario se ha agregado correctamente.');
        navigate('/comentario'); 
      } else {
        throw new Error(response.message || 'Ocurrió un error al crear el comentario.');
      }
    } catch (error) {
      console.error('Error al crear el comentario:', error);
      showErrorAlert('Error', 'Ocurrió un error al crear el comentario.');
    }
  };

  return (
    <main className="container">
      <Form
        title="Añadir Comentario"
        fields={[
          {
            label: 'Tarea',
            name: 'id_tarea',
            fieldType: 'select',
            options: tareas.map((tarea) => ({
              value: tarea.id_tarea,
              label: `${tarea.detalle}`,
            })),
            onChange: (e) => {
              setTareaSeleccionada(Number(e.target.value));
            },
            required: true,
          },
          {
            label: 'Comentario',
            name: 'comentario',
            placeholder: 'Escribe tu comentario aquí...',
            fieldType: 'textarea',
            rows: 3,
            required: true,
          },
        ]}
        onSubmit={onSubmit}
        footerContent={
          <div className="button-container">
            <button type="submit" className="create-button">
              Guardar Comentario
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

export default AddComentario;
