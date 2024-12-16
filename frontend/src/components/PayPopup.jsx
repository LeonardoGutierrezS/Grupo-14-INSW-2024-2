import Form from './Form';
import '@styles/popup.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PaymentPopup({ show, setShow, onSave }) {
    const handleSubmit = (formData) => {
        const { paymentType } = formData; 
        onSave(paymentType); 
    };

    return (
        show && (
            <div className="bg">
                <div className="popup">
                    <button className="close" onClick={() => setShow(false)}>
                        <img src={CloseIcon} alt="Cerrar" />
                    </button>
                    <Form
                        title="Aprobar pago"
                        fields={[
                            {
                                label: "Tipo de Pago",
                                name: "paymentType",
                                fieldType: 'select',
                                options: [
                                    { value: 'diario', label: 'Diario' },
                                    { value: 'semanal', label: 'Semanal' },
                                    { value: 'mensual', label: 'Mensual' },
                                ],
                                required: true,
                            },
                        ]}
                        onSubmit={handleSubmit}
                        buttonText="Aprobar"
                    />
                </div>
            </div>
        )
    );
}
