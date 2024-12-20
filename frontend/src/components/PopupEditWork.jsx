import Form from './Form';
import '@styles/popupWork.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PopupEditWork({ show, setShow, data, action }) {
    
    const workData = data && data.length > 0 ? data[0] : {};

    
    const handleSubmit = (formData) => {
        action({ ...formData, id_reparacion: data[0]?.id_reparacion });

    };

    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className='close' onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <Form
                            title="Editar Trabajo"
                            fields={[
                                {
                                    label: 'Marca',
                                    name: 'marca',
                                    defaultValue: workData.marca || "",
                                    placeholder: 'Ingrese la marca',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                },
                                {
                                    label: 'Modelo',
                                    name: 'modelo',
                                    defaultValue: workData.modelo || '',
                                    placeholder: 'Ingrese el modelo',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                },
                                {
                                    label: 'Color',
                                    name: 'color',
                                    defaultValue: workData.color || '',
                                    placeholder: 'Ingrese el color',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    maxLength: 20,
                                },
                                {
                                    label: 'RUT Cliente',
                                    name: 'rut',
                                    defaultValue: workData.rut || '',
                                    placeholder: '12.345.678-9',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    pattern: /^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/,
                                    patternMessage: 'Debe ser xx.xxx.xxx-x o xxxxxxxx-x',
                                },
                                {
                                    label: 'Nombre Cliente',
                                    name: 'nombre',
                                    defaultValue: workData.nombre_cliente || '',
                                    placeholder: 'Ingrese el nombre completo',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                },
                                {
                                    label: 'Whatsapp Cliente',
                                    name: 'whatsapp',
                                    defaultValue: workData.whatsapp || '',
                                    placeholder: 'Ingrese el número de Whatsapp',
                                    fieldType: 'input',
                                    type: 'tel',
                                    required: true,
                                },
                                {
                                    label: 'Correo Cliente',
                                    name: 'correo',
                                    defaultValue: workData.correo || '',
                                    placeholder: 'example@email.com',
                                    fieldType: 'input',
                                    type: 'email',
                                    required: true,
                                },
                                {
                                    label: 'Tipo de Trabajo',
                                    name: 'tipo_trabajo',
                                    defaultValue: workData.tipo_trabajo || '',
                                    placeholder: 'Ingrese el tipo de trabajo',
                                    fieldType: 'input',
                                    type: 'text',
                                    required: true,
                                },
                                {
                                    label: 'Detalle de Trabajo',
                                    name: 'detalle_trabajo',
                                    defaultValue: workData.detalle_trabajo || '',
                                    placeholder: 'Describa el detalle del trabajo',
                                    fieldType: 'textarea',
                                    required: false,
                                },
                                {
                                    label: 'Observaciones de la Bicicleta',
                                    name: 'obs_bici',
                                    defaultValue: workData.obs_bici || '',
                                    placeholder: 'Ingrese observaciones',
                                    fieldType: 'textarea',
                                    required: false,
                                },
                                {
                                    label: 'Repuestos',
                                    name: 'repuestos',
                                    defaultValue: workData.repuestos || '',
                                    placeholder: 'Ingrese los repuestos utilizados',
                                    fieldType: 'textarea',
                                    required: false,
                                },
                                {
                                    label: 'Precio',
                                    name: 'precio',
                                    defaultValue: workData.precio || '',
                                    placeholder: 'Ingrese el precio',
                                    fieldType: 'input',
                                    type: 'number',
                                    required: true,
                                    min: 0,
                                },
                                {
                                    label: 'Fecha de ingreso',
                                    name: 'fecha_ingreso',
                                    defaultValue: workData.fechaIngreso || '',
                                    placeholder: 'Seleccione la fecha',
                                    fieldType: 'input',
                                    type: 'date',
                                    required: true,
                                },
                                {
                                    label: 'Fecha Estimada de Entrega',
                                    name: 'fecha_estimada_entrega',
                                    defaultValue: workData.fecha_estimada_entrega || '',
                                    placeholder: 'Seleccione la fecha',
                                    fieldType: 'input',
                                    type: 'date',
                                    required: true,
                                },
                            ]}
                            onSubmit={handleSubmit}
                            buttonText="Guardar Cambios"
                            backgroundColor={'#fff'}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
