
import Table from '@components/Table';
import useGetWorks from '@hooks/works/useGetWorks.jsx';
import Search from '@components/Search';
import Popup from '@components/PopupEditWork';
import DeleteIcon from '@assets/deleteIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import UpdateIconDisable from '@assets/updateIconDisabled.svg';
import DeleteIconDisable from '@assets/deleteIconDisabled.svg';
import { useCallback } from 'react';
import '@styles/works.css';
import useEditWork from '@hooks/works/useEditWorks.jsx';
import useDeleteWork from '@hooks/works/useDeleteWorks.jsx';
import { useNavigate } from 'react-router-dom';

const Works = () => {
  const { works, fetchWorks, setWorks } = useGetWorks();
  const [filterCliente, setFilterCliente] = useState('');

  const navigate = useNavigate();

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataWork,
    setDataWork
  } = useEditWork(setWorks);

  const { handleDelete } = useDeleteWork(fetchWorks, setDataWork);

  const handleClienteFilterChange = (e) => {
    setFilterCliente(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedWorks) => {
    setDataWork(selectedWorks);
  }, [setDataWork]);

  const columns = [
    { title: "ID", field: "id_reparacion", width: 55, responsive: 0 },
    { title: "Bicicleta", field: "bicicleta", width: 300, responsive: 0 },
    { title: "Cliente", field: "nombre_cliente", width: 300 , responsive: 2 },
    { title: "Tipo trabajo", field: "tipo_trabajo", width: 200, responsive: 2 },
    { title: "Fecha ingreso", field: "fechaIngreso", width: 150, responsive: 2 },

    {
      title: "Acciones",
      field: "actions",
      width: 120,
      formatter: () => '<button class="view-details-btn">Mostrar</button>',
      cellClick: (e, cell) => {
        const workId = cell.getRow().getData().id_reparacion; // Obtiene el ID del trabajo
        navigate(`/work-details/${workId}`);
      }
    }
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Trabajos</h1>
          <div className='filter-actions'>
            <Search value={filterCliente} onChange={handleClienteFilterChange} placeholder={'Filtrar por cliente'} />
            <button onClick={handleClickUpdate} disabled={dataWork.length === 0}>
              {dataWork.length === 0 ? (
                <img src={UpdateIconDisable} alt="edit-disabled" />
              ) : (
                <img src={UpdateIcon} alt="edit" />
              )}
            </button>
            <button className='delete-work-button' disabled={dataWork.length === 0} onClick={() => handleDelete(dataWork)}>
              {dataWork.length === 0 ? (
                <img src={DeleteIconDisable} alt="delete-disabled" />
              ) : (
                <img src={DeleteIcon} alt="delete" />
              )}
            </button>
          </div>
        </div>
        <Table
          data={works}
          columns={columns}
          filter={filterCliente}
          dataToFilter={'cliente'}
          initialSortName={'cliente'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataWork} action={handleUpdate} />
    </div>
  );
};

export default Works;