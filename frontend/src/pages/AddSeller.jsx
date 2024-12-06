import { useNavigate } from 'react-router-dom';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import { createSeller } from '../services/user.service';

const AddSeller = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1); // Retrocede a la página anterior
    };


    const onSubmit = async (data) => {
        try {
            const response = await createSeller(data);
            if (response.status === 'Success') {
                showSuccessAlert('¡Creado!', 'El vendedor se ha agregado correctamente.');
                navigate('/users'); // Vuelve a la lista de usuarios después de la creación
            } else {
                showErrorAlert('Error', response.details || 'Ocurrió un error al crear el vendedor.');
            }
        } catch (error) {
            console.error('Error al crear el vendedor:', error);
            showErrorAlert('Error', 'Ocurrió un error al crear el vendedor.');
        }
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

    return (
        
        <main className="container">
            <Form
                title="Agregar nuevo vendedor"
                fields={[
                    {
                        label: "Nombre completo",
                        name: "nombreCompleto",
                        placeholder: "Juan Pérez López",
                        fieldType: 'input',
                        type: "text",
                        required: true,
                        minLength: 15,
                        maxLength: 50,
                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                        patternMessage: "Debe contener solo letras y espacios",
                    },
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: 'input',
                        type: "email",
                        required: true,
                        minLength: 15,
                        maxLength: 35,
                        validate: {
                            emailDomain: (value) => value.endsWith('@gmail.cl') || 'El correo debe terminar en @gmail.cl'
                        },
                    },
                    {
                        label: "Rut",
                        name: "rut",
                        placeholder: "23.770.330-1",
                        fieldType: 'input',
                        type: "text",
                        required: true,
                        minLength: 9,
                        maxLength: 12,
                        pattern: patternRut,
                        patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
                    },
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: 'input',
                        type: "password",
                        required: true,
                        minLength: 8,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                    },
                ]}
                
                
                onSubmit={onSubmit}
                footerContent={
                    <div className="button-container">
                        <button type="submit" className="create-button">
                            Crear vendedor
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

export default AddSeller;


