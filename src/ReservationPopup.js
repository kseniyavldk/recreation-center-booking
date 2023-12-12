import React, { useState } from "react";
import "./reservationPopup.css";

const ReservationPopup = ({
  arrivalDate,
  departureDate,
  selectedHouse,
  onClose,
  onConfirm,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [verificationError, setVerificationError] = useState(false);

  const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const handleOkClick = () => {
    if (showCodeInput) {
      if (verificationCode.trim() === generatedCode.toString()) {
        onConfirm({
          arrivalDate,
          departureDate,
          selectedHouse,
          firstName,
          lastName,
          phoneNumber,
        });
        onClose();
      } else {
        setVerificationError(true);
      }
    } else {
      const code = generateVerificationCode();
      setGeneratedCode(code);
      setShowCodeInput(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reservation-popup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="formInput">
          <h2>Детали бронирования</h2>
          <p>Информация о доме:</p>
          <p>Название: {selectedHouse.name}</p>
          <p>Цена: {selectedHouse.price}</p>
          <div className="inline-group">
            <label>Имя:</label>
            <input
              type="text"
              value={firstName}
              className="custom-datepicker"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="inline-group">
            <label>Фамилия:</label>
            <input
              type="text"
              value={lastName}
              className="custom-datepicker"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="inline-group">
            <label>Номер телефона:</label>
            <input
              type="text"
              value={phoneNumber}
              className="custom-datepicker"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          {showCodeInput && (
            <div className="inline-group">
              <label>Verification Code:</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setVerificationError(false);
                }}
              />
              {verificationError && (
                <p style={{ color: "red" }}>Incorrect verification code</p>
              )}
            </div>
          )}
          <div>
            <button onClick={handleOkClick}>OK</button>
          </div>
          {showCodeInput && <p>Verification Code: {generatedCode}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReservationPopup;
