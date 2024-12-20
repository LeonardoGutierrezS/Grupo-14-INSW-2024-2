import { useNavigate } from 'react-router-dom';
import { createMechanic } from '@services/user.service.js';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const AddMechanic = () => {
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1); 
    };


    const onSubmit = async (data) => {
        try {
            const response = await createMechanic(data);
            if (response.status === 'Success') {
                showSuccessAlert('¡Creado!', 'El mecánico se ha agregado correctamente.');
                navigate('/users'); 
            } else {
                showErrorAlert('Error', response.details || 'Ocurrió un error al crear el mecánico.');
            }
        } catch (error) {
            console.error('Error al crear el mecánico:', error);
            showErrorAlert('Error', 'Ocurrió un error al crear el mecánico.');
        }
    };

    const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

    return (
        
        <main className="container">
            <Form
                title="Agregar nuevo mecánico"
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
                            Crear mecánico
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

export default AddMechanic;


