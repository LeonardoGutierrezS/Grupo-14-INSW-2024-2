import { useEffect, useState } from 'react';
import { getWorkHoursEmployee } from '@services/user.service.js';
import Table from '@components/TableTwo.jsx';
import '@styles/forTable.css'; 

const MyShifts = () => {
    const [workHours, setWorkHours] = useState([]);
    const [totalHours, setTotalHours] = useState(0);

    // Función para obtener los turnos
    const fetchWorkHours = async () => {
        try {
            const response = await getWorkHoursEmployee();
            if (response.status === 'Success') {
                
                const filteredWorkHours = response.data.workHours.filter(turno => parseFloat(turno.total_hours) > 0);
                setWorkHours(filteredWorkHours);
                setTotalHours(response.data.totalHours);
            } else {
                console.error('Error al obtener los turnos:', response.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    
    useEffect(() => {
        fetchWorkHours();
    }, []);

    const columns = [
        { title: "Fecha de Trabajo", field: "work_date", width: 200 },
        { title: "Hora de Entrada", field: "check_in", width: 200 },
        { title: "Hora de Salida", field: "check_out", width: 200 },
        { title: "Horas Totales", field: "total_hours", width: 250 },
    ];

    return (
        <div className="main-container">
            <h1 className="title-table">Mis Turnos</h1>
            <Table
                
                data={workHours} 
                columns={columns} 
                initialSortName={'work_date'}
                
            />
            <h2>Horas disponibles a pago: {totalHours}</h2>
        </div>
    );
};

export default MyShifts;
