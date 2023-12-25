import React, { useState } from "react";
import "./reservationPopup.css";

const ReservationPopup = ({
  arrivalDate,
  departureDate,
  selectedHouseInfo,
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
  const [validationError, setValidationError] = useState({
    firstName: false,
    lastName: false,
    phoneNumber: false,
  });
  const houseName = selectedHouseInfo.name || "No House Selected";
  const housePrice = selectedHouseInfo.price || "No Price Available";

  const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const validatePhoneNumber = (number) => {
    // Belarusian phone number regex
    const belarusianPhoneNumberRegex = /^[+]?375[\d]{9}$/;
    return belarusianPhoneNumberRegex.test(number);
  };

  const handleOkClick = () => {
    // Validate first name, last name, and phone number
    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim()) {
      setValidationError({
        firstName: !firstName.trim(),
        lastName: !lastName.trim(),
        phoneNumber: !phoneNumber.trim(),
      });
      return;
    }

    // Validate Belarusian phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setValidationError({
        firstName: false,
        lastName: false,
        phoneNumber: true,
      });
      return;
    }

    if (showCodeInput) {
      if (verificationCode.trim() === generatedCode.toString()) {
        // Log the user's information and selected house data to the console
        const userData = {
          firstName,
          lastName,
          phoneNumber,
        };
        const reservationData = {
          arrivalDate,
          departureDate,
          selectedHouseInfo,
          ...userData,
        };
        console.log("Reservation Data:", reservationData);

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
    <div className="modal-overlay">
      <div className="reservation-popup">
        <div className="formInput">
          <h2>Детали бронирования</h2>
          <p>Информация о доме:</p>
          <p>Название: {houseName}</p>
          <p>Цена: {housePrice}</p>
          <div
            className={`validation-input-group ${
              validationError.firstName ? "error" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Имя"
              value={firstName}
              className="custom-datepicker"
              onChange={(e) => {
                setFirstName(e.target.value);
                setValidationError({ ...validationError, firstName: false });
              }}
            />
            {validationError.firstName && (
              <p className="error-message">Имя обязательно</p>
            )}
          </div>
          <div
            className={`validation-input-group ${
              validationError.lastName ? "error" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Фамилия"
              value={lastName}
              className="custom-datepicker"
              onChange={(e) => {
                setLastName(e.target.value);
                setValidationError({ ...validationError, lastName: false });
              }}
            />
            {validationError.lastName && (
              <p className="error-message">Фамилия обязательна</p>
            )}
          </div>
          <div
            className={`validation-input-group ${
              validationError.phoneNumber ? "error" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Номер телефона"
              value={phoneNumber}
              className="custom-datepicker"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setValidationError({ ...validationError, phoneNumber: false });
              }}
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
          <div>
            <button onClick={handleOkClick}>OK</button>
            <button onClick={onClose}>Отмена</button>
          </div>
          {showCodeInput && <p>Verification Code: {generatedCode}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReservationPopup;
