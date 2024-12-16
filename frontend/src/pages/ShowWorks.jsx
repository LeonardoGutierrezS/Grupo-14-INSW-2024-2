import { useEffect, useState } from 'react';
import { getAllIngresos } from '@services/ingresoBicicletas.service.js';
import Table from '@components/Table';
import Search from '@components/Search';
import '@styles/showWorks.css';

const ShowWorks = () => {
  const [ingresos, setIngresos] = useState([]);
  const [filterCliente, setFilterCliente] = useState('');

  useEffect(() => {
    async function fetchIngresos() {
      const ingresosData = await getAllIngresos();
      setIngresos(ingresosData);
    }
    fetchIngresos();
  }, []);

  const handleClienteFilterChange = (e) => {
    setFilterCliente(e.target.value);
  };

  const columns = [
    { title: "ID", field: "id_reparacion", width: 50 },
    { title: "Bicicleta", field: "bicicleta", width: 250 },
    { title: "Cliente", field: "cliente", width: 300 },
    { title: "Reparación", field: "tipo_trabajo", width: 650 },
  ];

  const formatData = ingresos.map((ingreso) => ({
    id_reparacion: ingreso.id_reparacion,
    bicicleta: `${ingreso.id_bici.marca} ${ingreso.id_bici.modelo}`,
    cliente: ingreso.id_cliente.nombre,
    tipo_trabajo: ingreso.tipo_trabajo,
  }));

  return (
    <div className="main-container">
      <div className="table-container">
        <div className="top-table">
          <h1 className="title-table">Lista de Trabajos</h1>
          <div className="filter-actions">
            <Search
              value={filterCliente}
              onChange={handleClienteFilterChange}
              placeholder={'Filtrar por cliente'}
            />
          </div>
        </div>
        <Table
          data={formatData}
          columns={columns}
          filter={filterCliente}
          dataToFilter={'cliente'}
          initialSortName={'cliente'}
        />
      </div>
    </div>
  );
};

export default ShowWorks;