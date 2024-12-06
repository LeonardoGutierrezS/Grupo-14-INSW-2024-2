import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkHours, updateWorkHour} from '@services/user.service.js';
import Table from '@components/Table';
import '@styles/users.css';
import HoursPopup from '../components/HoursPopup';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
const WorkHours = () => {
    const { userId } = useParams(); // Obtiene el ID del mecánico desde la URL
    const [workHours, setWorkHours] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedWorkHour, setSelectedWorkHour] = useState(null);
    const handleEditClick = (workHour) => {
        setSelectedWorkHour(workHour);
        setIsEditPopupOpen(true);
    };
    
   // Función para obtener los turnos, deberia usarlo en un hook pero no se como hacerlo xd
   const fetchWorkHours = async () => {
    try {
        console.log('ID enviado al servicio:', userId);
        const response = await getWorkHours(userId);
        if (response.status === 'Success') {
            setWorkHours(response.data.workHours);
            setTotalHours(response.data.totalHours);
        } else {
            console.error('Error al obtener los turnos:', response.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Llamada inicial para obtener los turnos
useEffect(() => {
    fetchWorkHours();
}, [userId]);

    const columns = [
        { title: "Fecha de Trabajo", field: "work_date", width: 200 },
        { title: "Hora de Entrada", field: "check_in", width: 200 },
        { title: "Hora de Salida", field: "check_out", width: 200 },
        { title: "Horas Totales", field: "total_hours", width: 150 },
        { 
            title: "Acciones",
            field: "actions", 
            hozAlign: "center",
            formatter: function () {
                return "<button class='edit-btn'>Editar</button>";
            },
            cellClick: function (e, cell) {
                const rowData = cell.getRow().getData(); 
                handleEditClick(rowData); 
            },
        },
    ];

    return (
        <div className="main-container">
            <h1 className="title-table">Turnos del Mecánico</h1>
            
            <Table 
                data={workHours} 
                columns={columns} 
                initialSortName={'work_date'}
            />
            {isEditPopupOpen && (
                <HoursPopup
                    show={isEditPopupOpen}
                    setShow={setIsEditPopupOpen}
                    workHour={selectedWorkHour}
                    onSave={async (updatedData) => {
                        const response = await updateWorkHour(selectedWorkHour.id, updatedData);
                        if (response.status === "Success") {
                            showSuccessAlert('¡Actualizado!', 'El horario ha sido actualizado correctamente.');
                            setIsEditPopupOpen(false);
                            fetchWorkHours(); // Refresca la tabla automáticamente
                        } else {
                            showErrorAlert('Error', 'Ocurrió un problema al actualizar el horario.');
                            console.error('Error al actualizar el horario:', response);
                        }
                    }}
                />
            )}
        <h2>Total de horas trabajadas: {totalHours}</h2>
        </div>
    );
};

export default WorkHours;
