import Form from '@components/Form'; 
import CloseIcon from '@assets/XIcon.svg'; 
import '@styles/popup.css'; 

const HoursPopup = ({ show, setShow, workHour, onSave }) => {
    const onSubmit = (data) => {
        onSave(data);
    };

    return (
        show && (
            <div className="bg">
                <div className="popup">
                    <button className="close" onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <Form
                        title="Editar Horario de Trabajo"
                        fields={[
                            {
                                label: "Hora de Entrada",
                                name: "check_in",
                                placeholder: "YYYY-MM-DDTHH:mm:ssZ",
                                fieldType: 'input',
                                type: "text",
                                defaultValue: workHour.check_in,
                                required: true,
                            },
                            {
                                label: "Hora de Salida",
                                name: "check_out",
                                placeholder: "YYYY-MM-DDTHH:mm:ssZ",
                                fieldType: 'input',
                                type: "text",
                                defaultValue: workHour.check_out,
                                required: true,
                            },
                        ]}
                        buttonText="Guardar Cambios"
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        )
    );
};

export default HoursPopup;
