import React, { useState } from 'react';
import { createIngresoBicicleta } from '@services/ingresoBicicletas.service.js';
import '@styles/form.css';

const BikeEntry = () => {
  const [bicicletaData, setBicicletaData] = useState({
    marca: '',
    modelo: '',
    color: '',
  });

  const [clienteData, setClienteData] = useState({
    rut: '',
    nombre: '',
    whatsapp: '',
    correo: '',
  });

  const [reparacionData, setReparacionData] = useState({
    tipo_trabajo: '',
    detalle_trabajo: '',
    obs_bici: '',
    repuestos: '',
    precio: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviar los datos al backend en el formato esperado
      const response = await createIngresoBicicleta(bicicletaData, clienteData, reparacionData);
      alert('Ingreso registrado con éxito');
      console.log('Respuesta del backend:', response);

      // Limpiar los datos del formulario
      setBicicletaData({ marca: '', modelo: '', color: '' });
      setClienteData({ rut: '', nombre: '', whatsapp: '', correo: '' });
      setReparacionData({
        tipo_trabajo: '',
        detalle_trabajo: '',
        obs_bici: '',
        repuestos: '',
        precio: '',
      });
    } catch (error) {
      alert('Error al registrar el ingreso');
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Ingresar Bicicleta</h1>

        {/* Sección Bicicleta */}
        <div>
          <h2>Bicicleta</h2>
          <label>
            Marca:
            <input
              type="text"
              name="marca"
              value={bicicletaData.marca}
              onChange={(e) => setBicicletaData({ ...bicicletaData, marca: e.target.value })}
              placeholder="Ingrese la marca"
            />
          </label>
          <label>
            Modelo:
            <input
              type="text"
              name="modelo"
              value={bicicletaData.modelo}
              onChange={(e) => setBicicletaData({ ...bicicletaData, modelo: e.target.value })}
              placeholder="Ingrese el modelo"
            />
          </label>
          <label>
            Color:
            <input
              type="text"
              name="color"
              value={bicicletaData.color}
              onChange={(e) => setBicicletaData({ ...bicicletaData, color: e.target.value })}
              placeholder="Ingrese el color"
            />
          </label>
        </div>

        {/* Sección Cliente */}
        <div>
          <h2>Cliente</h2>
          <label>
            Rut:
            <input
              type="text"
              name="rut"
              value={clienteData.rut}
              onChange={(e) => setClienteData({ ...clienteData, rut: e.target.value })}
              placeholder="Ingrese el RUT"
            />
          </label>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={clienteData.nombre}
              onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
              placeholder="Ingrese el nombre completo"
            />
          </label>
          <label>
            Whatsapp:
            <input
              type="tel"
              name="whatsapp"
              value={clienteData.whatsapp}
              onChange={(e) => setClienteData({ ...clienteData, whatsapp: e.target.value })}
              placeholder="Ingrese el número de Whatsapp"
            />
          </label>
          <label>
            Correo Electrónico:
            <input
              type="email"
              name="correo"
              value={clienteData.correo}
              onChange={(e) => setClienteData({ ...clienteData, correo: e.target.value })}
              placeholder="Ingrese el correo electrónico"
            />
          </label>
        </div>

        {/* Sección Reparación */}
        <div>
          <h2>Reparación</h2>
          <label>
            Tipo de Trabajo:
            <input
              type="text"
              name="tipo_trabajo"
              value={reparacionData.tipo_trabajo}
              onChange={(e) => setReparacionData({ ...reparacionData, tipo_trabajo: e.target.value })}
              placeholder="Ingrese el tipo de trabajo"
            />
          </label>
          <label>
            Detalle de Trabajo:
            <textarea
              name="detalle_trabajo"
              value={reparacionData.detalle_trabajo}
              onChange={(e) =>
                setReparacionData({ ...reparacionData, detalle_trabajo: e.target.value })
              }
              placeholder="Describa el detalle del trabajo"
            ></textarea>
          </label>
          <label>
            Observaciones de la bicicleta:
            <textarea
              name="obs_bici"
              value={reparacionData.obs_bici}
              onChange={(e) =>
                setReparacionData({ ...reparacionData, obs_bici: e.target.value })
              }
              placeholder="Ingrese las observaciones"
            ></textarea>
          </label>
          <label>
            Repuestos a utilizar:
            <textarea
              name="repuestos"
              value={reparacionData.repuestos}
              onChange={(e) => setReparacionData({ ...reparacionData, repuestos: e.target.value })}
              placeholder="Ingrese los repuestos a utilizar"
            ></textarea>
          </label>
          <label>
            Precio de la reparación:
            <input
              type="number"
              name="precio"
              value={reparacionData.precio}
              onChange={(e) => setReparacionData({ ...reparacionData, precio: e.target.value })}
              placeholder="Ingrese el precio"
            />
          </label>
        </div>

        {/* Botón de envío */}
        <button type="submit">Registrar Bicicleta</button>
      </form>
    </div>
  );
};

export default BikeEntry;
