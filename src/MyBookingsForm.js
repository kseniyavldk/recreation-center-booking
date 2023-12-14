import React, { useState } from "react";
import "./myBookingsForm.css";

const MyBookingsForm = ({ onClose, onConfirm, onBookingHistoryOpen }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [validationError, setValidationError] = useState({
    phoneNumber: false,
  });
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);

  const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const validatePhoneNumber = (number) => {
    // Belarusian phone number regex
    const belarusianPhoneNumberRegex = /^[+]?375[\d]{9}$/;
    return belarusianPhoneNumberRegex.test(number);
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;

    setPhoneNumber(newPhoneNumber);
    setValidationError({
      phoneNumber:
        !newPhoneNumber.trim() || !validatePhoneNumber(newPhoneNumber),
    });

    if (showCodeInput) {
      const code = generateVerificationCode();
      setGeneratedCode(code);
    }
  };

  const handleOkClick = (e) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      setValidationError({
        phoneNumber: true,
      });
      return;
    }

    if (showCodeInput) {
      if (verificationCode.trim() === generatedCode.toString()) {
        const userData = {
          phoneNumber,
        };
        const reservationData = {
          ...userData,
        };
        console.log("Reservation Data:", reservationData);

        if (typeof onBookingHistoryOpen === "function") {
          onBookingHistoryOpen();
        }

        if (typeof onConfirm === "function") {
          onConfirm(reservationData);
        }
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
    <div className="my-bookings-form">
      <div className="form-container">
        <h2>Введите номер телефона</h2>
        <div
          className={`input-group ${
            validationError.phoneNumber ? "error" : ""
          }`}
        >
          <input
            type="text"
            placeholder="Номер телефона"
            value={phoneNumber}
            className="custom-datepicker"
            onChange={handlePhoneNumberChange}
          />
          {validationError.phoneNumber && (
            <p className="error-message">Неверный номер</p>
          )}
        </div>
        {showCodeInput && (
          <div className="validation-input-group">
            <input
              type="text"
              placeholder="Код проверки"
              className="custom-datepicker"
              value={verificationCode}
              onChange={(e) => {
                setVerificationCode(e.target.value);
                setVerificationError(false);
              }}
            />
            {verificationError && (
              <p className="error-message">Неправильный код проверки</p>
            )}
          </div>
        )}
        <div className="button-group">
          <button onClick={handleOkClick}>OK</button>
          <button onClick={onClose}>Отмена</button>
        </div>
        {showCodeInput && <p>Verification Code: {generatedCode}</p>}
      </div>
    </div>
  );
};

export default MyBookingsForm;
