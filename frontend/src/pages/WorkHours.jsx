import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaymentHistory, getUsersWithHours ,getWorkHours, updateWorkHour, approvePayment } from '@services/user.service.js';
import '@styles/users.css';
import HoursPopup from '../components/HoursPopup';
import PaymentPopup from '../components/PayPopup'; 
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import PayHistoryPopup from '../components/PayHistoryPopup'; 
import Table from '../components/Table';
import UsersWithHoursPopup from '../components/UsersToPayPopup';

const WorkHours = () => {
    const { userId } = useParams(); 
    const [workHours, setWorkHours] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false); 
    const [selectedWorkHour, setSelectedWorkHour] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
    const [isUsersPopupOpen, setIsUsersPopupOpen] = useState(false);
    const [usersWithHours, setUsersWithHours] = useState([]);


    const formatTime = (value) => {
        const date = new Date(value);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    const adjustTimeZone = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const userTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return userTime.toISOString().slice(0, 19); 
    };

    const handleEditClick = (workHour) => {
        const adjustedWorkHour = {
            ...workHour,
            check_in: adjustTimeZone(workHour.check_in),
            check_out: adjustTimeZone(workHour.check_out),
        };
        setSelectedWorkHour(adjustedWorkHour);
        setIsEditPopupOpen(true);
    };

    const fetchWorkHours = async () => {
        try {
            console.log('ID enviado al servicio:', userId);
            const response = await getWorkHours(userId);
            console.log('Respuesta del servicio:', response);
    
            if (response.status === 'Success') {
                const workHours = response.data.workHours || []; 
                console.log('Turnos antes del filtro:', workHours);
    
                
                const filteredWorkHours = workHours.filter(turno => {
                    const totalHours = parseFloat(turno.total_hours);
                    return !isNaN(totalHours) && totalHours > 0;
                });
    
                console.log('Turnos después del filtro:', filteredWorkHours);
                setWorkHours(filteredWorkHours);
    
                
                const totalFilteredHours = filteredWorkHours.reduce((acc, turno) => acc + parseFloat(turno.total_hours), 0);
                setTotalHours(totalFilteredHours);
            } else {
                console.error('Error al obtener los turnos:', response.message);
            }
        } catch (error) {
            console.error('Error al obtener los turnos:', error);
        }
    };
    
    

    const handleApprovePayment = async (paymentType) => {
        try {
            const response = await approvePayment(userId, paymentType);
            if (response.status === 'Success') {
                showSuccessAlert('¡Éxito!', 'El pago ha sido aprobado correctamente.');
                setIsPaymentPopupOpen(false);
                fetchWorkHours(); 
            } else {
                showErrorAlert('Error', response.message || 'Ocurrió un error al aprobar el pago.');
            }
        } catch (error) {
            console.error('Error al aprobar el pago:', error);
            showErrorAlert('Error', 'Ocurrió un error al aprobar el pago.');
        }
    };
    const handlePaymentHistoryClick = async () => {
        try {
            const response = await getPaymentHistory(userId);
            if (response.status === 'Success') {
                setPaymentHistory(response.data); 
                setIsHistoryPopupOpen(true); 
            } else {
                console.error('Error al obtener el historial de pagos:', response.message);
            }
        } catch (error) {
            console.error('Error al obtener el historial de pagos:', error);
        }
    };
    const fetchUsersWithHours = async () => {
        try {
            const response = await getUsersWithHours();
            if (response.status === 'Success') {
                setUsersWithHours(response.data); // Guarda los datos en el estado
            } else {
                console.error('Error al obtener usuarios con horas trabajadas:', response.message);
            }
        } catch (error) {
            console.error('Error al obtener usuarios con horas trabajadas:', error);
        }
    };
    

    useEffect(() => {
        fetchWorkHours();
    }, [userId]);

    const columns = [
        { title: "Fecha de Trabajo", field: "work_date", width: 200 },
        { 
            title: "Hora de Entrada", 
            field: "check_in", 
            width: 200,
            formatter: (cell) => formatTime(cell.getValue())
        },
            
        { title: "Hora de Salida", 
            field: "check_out", 
            width: 200,
            formatter: (cell) => formatTime(cell.getValue())
         },
        { title: "Horas Totales", field: "total_hours", width: 150 },
        { 
            title: "Modificar",
            field: "actions", 
            hozAlign: "center",
            width: 110,
            formatter: function () {
                return "<button class='button button-secondary'>Editar</button>";
            },
            cellClick: function (e, cell) {
                const rowData = cell.getRow().getData(); 
                handleEditClick(rowData); 
            },
        },
    ];

    return (
        <div className="main-container">
            <h1>Turnos del Mecánico</h1>
            
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
                            fetchWorkHours(); 
                        } else {
                            showErrorAlert('Error', 'Ocurrió un problema al actualizar el horario.');
                            console.error('Error al actualizar el horario:', response);
                        }
                    }}
                />
            )}
            {isPaymentPopupOpen && (
                <PaymentPopup
                    show={isPaymentPopupOpen}
                    setShow={setIsPaymentPopupOpen}
                    onSave={handleApprovePayment}
                />
            )}
            <h2>Total de horas trabajadas: {Number(totalHours).toFixed(2)}</h2>
            <div className="buttons-container">
            <button 
                className="button button-secondary"
                onClick={() => setIsPaymentPopupOpen(true)}
            >
                Aprobar Pago
            </button>
            <button 
                className="button button-secondary"
                onClick={() => {
                fetchUsersWithHours(); 
                setIsUsersPopupOpen(true); 
            }}
            >
                 + Disponibles a pago
            </button>

            <button 
                className="button button-secondary"
                onClick={handlePaymentHistoryClick}
            >
                Historial de Pagos
            </button>
            </div>
            
            {isHistoryPopupOpen && (
                <PayHistoryPopup 
                    show={isHistoryPopupOpen} 
                    setShow={setIsHistoryPopupOpen} 
                    paymentHistory={paymentHistory} 
                />
            )}
		    {isPaymentPopupOpen && (
                <PaymentPopup
                    show={isPaymentPopupOpen}
                    setShow={setIsPaymentPopupOpen}
                    onSave={handleApprovePayment}
                />
            )}
            {isUsersPopupOpen && (
                <UsersWithHoursPopup 
                    show={isUsersPopupOpen} 
                    setShow={setIsUsersPopupOpen} 
                    usersWithHours={usersWithHours} 
                />
            )}

        </div>
    );
};

export default WorkHours;
