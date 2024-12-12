import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkHours } from '@services/user.service.js';
import Table from '@components/Table';
import '@styles/users.css';

const WorkHours = () => {
    const { userId } = useParams(); // Obtiene el ID del mecánico desde la URL
    const [workHours, setWorkHours] = useState([]);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        console.log('ID enviado al servicio:', userId); 
        const fetchWorkHours = async () => {
            try {
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
        fetchWorkHours();
    }, [userId]);

    const columns = [
        { title: "Fecha de Trabajo", field: "work_date", width: 200 },
        { title: "Hora de Entrada", field: "check_in", width: 200 },
        { title: "Hora de Salida", field: "check_out", width: 200 },
        { title: "Horas Totales", field: "total_hours", width: 150 }
    ];

    return (
        <div className="main-container">
            <h1 className="title-table">Turnos del Mecánico</h1>
            <h2>Total de horas trabajadas: {totalHours}</h2>
            <Table 
                data={workHours} 
                columns={columns} 
                initialSortName={'work_date'}
            />
        </div>
    );
};

export default WorkHours;
