import React from "react";
import ReservationForm from "./ReservationForm";
import ReservationPopup from "./ReservationPopup";
import ConfirmationPopup from "./ConfirmationPopup";

function App() {
  const [showReservationPopup, setShowReservationPopup] = React.useState(false);

  const handleReservationClose = () => {
    setShowReservationPopup(false);
  };

  const handleReservationConfirmation = (reservationInfo) => {
    // Handle reservation confirmation, e.g., send to server
    console.log("Reservation confirmed:", reservationInfo);
    setShowReservationPopup(false);
  };

  return (
    <div className="App">
      <ReservationForm onBook={setShowReservationPopup} />
      {showReservationPopup && (
        <ReservationPopup
          onClose={handleReservationClose}
          onConfirm={handleReservationConfirmation}
        />
      )}
      {/* Additional components such as ConfirmationPopup can be added here */}
    </div>
  );
}

export default App;
