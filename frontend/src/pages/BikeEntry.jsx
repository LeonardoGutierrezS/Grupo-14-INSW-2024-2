import { createIngresoBicicleta } from '@services/ingresoBicicletas.service.js';
import Form from '@components/Form';
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';

const BikeEntry = () => {

  const onSubmit = async (data) => {
    try {
      const response = await createIngresoBicicleta(
        {
          marca: data.marca,
          modelo: data.modelo,
          color: data.color,
        },
        {
          rut: data.rut,
          nombre: data.nombre,
          whatsapp: data.whatsapp,
          correo: data.correo,
        },
        {
          tipo_trabajo: data.tipo_trabajo,
          detalle_trabajo: data.detalle_trabajo,
          obs_bici: data.obs_bici,
          repuestos: data.repuestos,
          precio: data.precio,
          fecha_estimada_entrega: data.fecha_estimada_entrega,
        }
      );

      if (response.status === 'Success') {
        showSuccessAlert('¡Registrado!', 'El ingreso se registró correctamente.');
        document.querySelector('form').reset();
      } else {
        showErrorAlert('Error', response.details || 'Ocurrió un error al registrar el ingreso.');
      }
    } catch (error) {
      console.error('Error al registrar el ingreso:', error);
      showErrorAlert('Error', 'Ocurrió un error al registrar el ingreso.',error);
    }
  };

  const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/);

  return (
    <main className="container">
      <Form
        title="Registrar Ingreso de Bicicleta"
        fields={[
          // Sección Bicicleta
          
          {
            label: 'Marca',
            name: 'marca',
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
            placeholder: 'Ingrese el color',
            fieldType: 'input',
            type: 'text',
            required: true,
            maxLength: 20,
          },
          // Sección Cliente
          {
            label: 'RUT',
            name: 'rut',
            placeholder: '12.345.678-9',
            fieldType: 'input',
            type: 'text',
            required: true,
            pattern: patternRut,
            patternMessage: 'Debe ser xx.xxx.xxx-x o xxxxxxxx-x',
          },
          {
            label: 'Nombre',
            name: 'nombre',
            placeholder: 'Ingrese el nombre completo',
            fieldType: 'input',
            type: 'text',
            required: true,
            minLength: 3,
            maxLength: 50,
          },
          {
            label: 'Whatsapp',
            name: 'whatsapp',
            placeholder: 'Ingrese el número de Whatsapp',
            fieldType: 'input',
            type: 'tel',
            required: true,
          },
          {
            label: 'Correo Electrónico',
            name: 'correo',
            placeholder: 'example@email.com',
            fieldType: 'input',
            type: 'email',
            required: true,
            validate: {
              emailDomain: (value) =>
                /\S+@\S+\.\S+/.test(value) || 'Debe ingresar un correo válido',
            },
          },
          // Sección Reparación
          {
            label: 'Tipo de Trabajo',
            name: 'tipo_trabajo',
            placeholder: 'Ingrese el tipo de trabajo',
            fieldType: 'input',
            type: 'text',
            required: true,
          },
          {
            label: 'Detalle de Trabajo',
            name: 'detalle_trabajo',
            placeholder: 'Describa el detalle del trabajo',
            fieldType: 'textarea',
            required: false,
          },
          {
            label: 'Observaciones de la Bicicleta',
            name: 'obs_bici',
            placeholder: 'Ingrese observaciones',
            fieldType: 'textarea',
            required: false,
          },
          {
            label: 'Repuestos',
            name: 'repuestos',
            placeholder: 'Ingrese los repuestos utilizados',
            fieldType: 'textarea',
            required: false,
          },
          {
            label: 'Precio',
            name: 'precio',
            placeholder: 'Ingrese el precio',
            fieldType: 'input',
            type: 'number',
            required: true,
            min: 0,
          },
          {
            label: 'Fecha Estimada de Entrega',
            name: 'fecha_estimada_entrega',
            placeholder: 'Seleccione la fecha',
            fieldType: 'input',
            type: 'date',
            required: true,
          },
        ]}
        onSubmit={onSubmit}
        footerContent={
          <div className="button-container">
            <button type="submit" className="create-button">
              Registrar Ingreso
            </button>
          </div>
        }
      />
    </main>
  );
};

export default BikeEntry;