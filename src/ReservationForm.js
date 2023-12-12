import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReservationPopup from "./ReservationPopup";

const ReservationForm = () => {
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [roomCategory, setRoomCategory] = useState("luxury");
  const [additionalServices, setAdditionalServices] = useState([]);
  const [notes, setNotes] = useState("");
  const [showReservationPopup, setShowReservationPopup] = useState(false);

  const handleBookClick = () => {
    setShowReservationPopup(true);
  };

  return (
    <div>
      <h2>Reservation Form</h2>
      <div>
        <label>Arrival Date:</label>
        <DatePicker
          selected={arrivalDate}
          onChange={(date) => setArrivalDate(date)}
        />
      </div>
      <div>
        <label>Departure Date:</label>
        <DatePicker
          selected={departureDate}
          onChange={(date) => setDepartureDate(date)}
        />
      </div>
      <div>
        <label>Room Category:</label>
        <select
          value={roomCategory}
          onChange={(e) => setRoomCategory(e.target.value)}
        >
          <option value="luxury">Luxury</option>
          <option value="standard">Standard</option>
        </select>
      </div>
      {/* Display room picture based on roomCategory */}
      {/* Additional services dropdown */}
      {/* Notes input */}
      <button onClick={handleBookClick}>Book</button>

      {showReservationPopup && (
        <ReservationPopup
          arrivalDate={arrivalDate}
          departureDate={departureDate}
          roomCategory={roomCategory}
          additionalServices={additionalServices}
          notes={notes}
          onClose={() => setShowReservationPopup(false)}
        />
      )}
    </div>
  );
};

export default ReservationForm;
