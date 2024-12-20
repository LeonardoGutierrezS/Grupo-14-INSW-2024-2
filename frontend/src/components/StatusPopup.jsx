import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function StatusPopup({ show, setShow, user, onSave }) {
    const handleSubmit = (formData) => {
        const { status } = formData; 
        console.log('Estado extraído del formulario:', status);
        onSave(status); 
    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title="Editar estado"
                            fields={[
                                {
                                    label: "Nombre completo",
                                    name: "nombreCompleto",
                                    defaultValue: user.nombreCompleto || "",
                                    fieldType: 'input',
                                    type: "text",
                                    disabled: true, 
                                },
                                {
                                    label: "Correo electrónico",
                                    name: "email",
                                    defaultValue: user.email || "",
                                    fieldType: 'input',
                                    type: "email",
                                    disabled: true, 
                                },
                                {
                                    label: "Rut",
                                    name: "rut",
                                    defaultValue: user.rut || "",
                                    fieldType: 'input',
                                    type: "text",
                                    disabled: true, 
                                },
                                {
                                    label: "Estado",
                                    name: "status",
                                    fieldType: 'select',
                                    options: [
                                        { value: 'activo', label: 'Activo' },
                                        { value: 'inactivo', label: 'Inactivo' },
                                    ],
                                    defaultValue: user.estado || "activo", 
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Guardar cambios"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
