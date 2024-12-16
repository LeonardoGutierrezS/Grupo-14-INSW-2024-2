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
import { showSuccessAlert, showErrorAlert } from '@helpers/sweetAlert.js';
import { updateUserStatus } from '@services/user.service.js';
import StatusPopup from '../components/StatusPopup';
import '@styles/usersButtons.css';

const Users = () => {
  const { users, fetchUsers, setUsers } = useUsers();
  const [filterRut, setFilterRut] = useState('');
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

const handleEditStatusClick = (user) => {
    setSelectedUser(user);
    setIsStatusPopupOpen(true);
};

const handleSaveStatus = async (userId, status) => {
  console.log('Datos enviados al servicio:', { userId, status }); // Verifica los datos aquí
  try {
      const response = await updateUserStatus(userId, status); // selectedStatus es un string ("activo" o "inactivo")
      if (response.status === "Success") {
          showSuccessAlert('¡Actualizado!', 'El estado del usuario se actualizó correctamente.');
          setIsStatusPopupOpen(false);
          fetchUsers(); // Refresca la tabla
      } else {
          showErrorAlert('Error', response.message || 'Ocurrió un error al actualizar el estado.');
      }
  } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      showErrorAlert('Error', 'Ocurrió un error al actualizar el estado.');
  }
};



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
    {
      title: "Estado",
      field: "estado",
      width: 135,
      formatter: (cell) => {
        const user = cell.getData();
        return `
          ${user.estado}
          <button class="button button-secondary">Editar</button>
        `;
      },
      cellClick: function (e, cell) {
        const rowData = cell.getRow().getData(); 
        handleEditStatusClick(rowData); 
      },
    },
    {
      title: "Turnos",
      field: "actions",
      width: 120,
      formatter: () => '<button class="button button-secondary">Ver Turnos</button>',
      cellClick: (e, cell) => {
        const userId = cell.getRow().getData().id; 
        navigate(`/work-hours/${userId}`);
      }
    },
  ];

  return (
    <div className='main-container'>
      <div className='table-container'>
        <div className='top-table'>
        <h1 style={{ color: "white" }}>Todo el personal</h1>
          <button className="button button-primary" onClick={() => navigate('/add-mechanic')}>
            Agregar Mecánico
          </button>
          <button className="button button-primary" onClick={() => navigate('/add-seller')}>
            Agregar Vendedor
          </button>
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
      {isStatusPopupOpen && (
      <StatusPopup
        show={isStatusPopupOpen}
        setShow={setIsStatusPopupOpen}
        user={selectedUser}
        onSave={(newStatus) => handleSaveStatus(selectedUser.id, newStatus)}
    />
    )}

    </div>
    
  );
};

export default Users;