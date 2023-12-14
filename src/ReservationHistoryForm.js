import React from "react";
import "./reservationHistoryForm.css";

function ReservationHistoryForm(onClose) {
  return (
    <form>
      <div className="BookingDetails">
        <h3>Мои бронирования</h3>
        <button onClick={onClose}>Главная</button>
      </div>
      <div>
        <button className="delete-button">Удалить</button>
      </div>
    </form>
  );
}

export default ReservationHistoryForm;
