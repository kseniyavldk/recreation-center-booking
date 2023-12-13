import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./reservationForm.css";

const ReservationForm = (props) => {
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);

  const handleBookClick = () => {
    if (props.onBook) {
      props.onBook(true);
    }
  };

  return (
    <div className="formInput">
      <h2>Форма бронирования</h2>
      <div className="date-category-group">
        <div className="inline-group">
          <label htmlFor="arrivalDate">Дата заезда:</label>
          <DatePicker
            id="arrivalDate"
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            className="custom-datepicker"
          />
        </div>
        <div className="inline-group">
          <label htmlFor="departureDate">Дата выезда:</label>
          <DatePicker
            id="departureDate"
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            className="custom-datepicker"
          />
        </div>
        <div className="inline-group">
          <label htmlFor="numberOfPeople">Количество человек</label>
          <select id="numberOfPeople">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button onClick={handleBookClick}>Поиск</button>
      </div>
    </div>
  );
};

export default ReservationForm;
