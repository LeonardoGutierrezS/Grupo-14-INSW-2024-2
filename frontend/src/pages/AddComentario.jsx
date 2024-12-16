import { useNavigate, useParams } from 'react-router-dom';
import { crearComentario } from '@services/comentario.service.js';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const AddComentario = () => {
  const navigate = useNavigate();
  const { id_tarea } = useParams();

  // Manejar el botón de volver
  const handleBack = () => {
    navigate(`/comentarios/${id_tarea}`); 
  };

  // Manejar el envío del formulario
  const onSubmit = async (data) => {
    try {
      const response = await crearComentario({ comentario: data.comentario, id_tarea });

      if (response.status === 'success') {
        showSuccessAlert('¡Comentario Creado!', 'El comentario se ha agregado correctamente.');
        navigate(`/tareas`); 
      } else {
        showErrorAlert('Error', 'Ocurrió un error al crear el comentario.');
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
