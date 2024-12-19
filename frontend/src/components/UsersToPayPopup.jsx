import '@styles/popupPayH.css';
import CloseIcon from '@assets/XIcon.svg';

export default function UsersWithHoursPopup({ show, setShow, usersWithHours }) {
    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <h2 className="popup-title">Personal con horas disponibles a pago: </h2>
                        <table className="popup-table">
                            <thead>
                                <tr>
                                    <th>Nombre Completo</th>
                                    <th>Rol</th>
                                    <th>Horas Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersWithHours.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.nombreCompleto}</td>
                                        <td>{user.rol}</td>
                                        <td>{user.totalHours}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
