import Table from '@components/Table';
import useUsers from '@hooks/users/useGetUsers.jsx';
import Search from '../components/Search';
import Popup from '../components/Popup';
import DeleteIcon from '../assets/deleteIcon.svg';
import UpdateIcon from '../assets/updateIcon.svg';
import UpdateIconDisable from '../assets/updateIconDisabled.svg';
import DeleteIconDisable from '../assets/deleteIconDisabled.svg';
import { useCallback, useState } from 'react';
import '@styles/users.css';
import useEditUser from '@hooks/users/useEditUser';
import useDeleteUser from '@hooks/users/useDeleteUser';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');

  const navigate = useNavigate();

  const {
    handleClickUpdate,
    handleUpdate,
    isPopupOpen,
    setIsPopupOpen,
    dataUser,
    setDataUser
  } = useEditUser(setUsers);

  const { handleDelete } = useDeleteUser(fetchUsers, setDataUser);

  const handleRutFilterChange = (e) => {
    setFilterRut(e.target.value);
  };

  const handleSelectionChange = useCallback((selectedUsers) => {
    setDataUser(selectedUsers);
  }, [setDataUser]);
  


  const columns = [
    { title: "Nombre", field: "nombreCompleto", width: 350, responsive: 0 },
    { title: "Correo electrónico", field: "email", width: 300, responsive: 3 },
    { title: "Rut", field: "rut", width: 120, responsive: 2 },
    { title: "Rol", field: "rol", width: 100, responsive: 2 },
    { title: "Creado", field: "createdAt", width: 110, responsive: 2 },
    { title: "Estado", field: "estado", width: 100, responsive: 2 },
    { 
      title: "Acciones", 
      field: "actions", 
      width: 100, 
      formatter: () => '<button class="view-work-hours-btn">Ver Turnos</button>',
      cellClick: (e, cell) => {
          const userId = cell.getRow().getData().id; // Obtiene el ID del usuario
          console.log('datos de la celda:', cell.getRow().getData());
          console.log('ID seleccionado:', userId); 
          navigate(`/work-hours/${userId}`);
      }
    }
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
          <h1 className='title-table'>Usuarios</h1>
          <button onClick={() => navigate('/add-mechanic')}>Agregar Mecánico</button>

            <div className='filter-actions'>
              <Search value={filterRut} onChange={handleRutFilterChange} placeholder={'Filtrar por rut'} />
              <button onClick={handleClickUpdate} disabled={dataUser.length === 0}>
                {dataUser.length === 0 ? (
                  <img src={UpdateIconDisable} alt="edit-disabled" />
                ) : (
                  <img src={UpdateIcon} alt="edit" />
                )}
              </button>
              <button className='delete-user-button' disabled={dataUser.length === 0} onClick={() => handleDelete(dataUser)}>
                {dataUser.length === 0 ? (
                  <img src={DeleteIconDisable} alt="delete-disabled" />
                ) : (
                  <img src={DeleteIcon} alt="delete" />
                )}
                
              </button>
            </div>
        </div>
        <Table
          data={users}
          columns={columns}
          filter={filterRut}
          dataToFilter={'rut'}
          initialSortName={'nombreCompleto'}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <Popup show={isPopupOpen} setShow={setIsPopupOpen} data={dataUser} action={handleUpdate} />
    </div>
  );
};

export default Users;