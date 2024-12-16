
import '@styles/popupPayH.css';
import CloseIcon from '@assets/XIcon.svg';

export default function PayHistoryPopup({ show, setShow, paymentHistory }) {
    return (
        <div>
            {show && (
                <div className="bg">
                    <div className="popup">
                        <button className="close" onClick={() => setShow(false)}>
                            <img src={CloseIcon} alt="Cerrar" />
                        </button>
                        <h2 className="popup-title">Historial de Pagos</h2>
                        <table className="popup-table">
                            <thead>
                                <tr>
                                    <th>Fecha de Aprobación</th>
                                    <th>Total de Horas</th>
                                    <th>Tipo de Pago</th>
                                    <th>Aprobado Por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((payment, index) => (
                                    <tr key={index}>
                                        <td>{new Date(payment.approvedAt).toLocaleString()}</td>
                                        <td>{payment.paidHours}</td>
                                        <td>{payment.paymentType}</td>
                                        <td>{payment.approvedBy.nombreCompleto}</td>
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
