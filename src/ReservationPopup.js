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

  const handleApiRequest = async () => {
    console.log("Inside handleApiRequest", arrivalDate, departureDate);

    /* if (!arrivalDate || !departureDate) {
      console.error("Invalid arrivalDate or departureDate");
      return;
    } */

    try {
      const apiUrl = "https://localhost:44377/api/v1/Order/Create";

      if (
        showCodeInput &&
        verificationCode.trim() !== generatedCode.toString()
      ) {
        setVerificationError(true);
        return;
      }

      console.log(selectedHouseInfo);

      const requestData = {
        houseId: selectedHouseInfo.id,
        dateIn: arrivalDate,
        dateOut: departureDate,
        countPeople: selectedHouseInfo.capacity,
        firstName,
        lastName,
        phoneNumber,
      };

      console.log("Data to be sent:", JSON.stringify(requestData, null, 2));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to create order. Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`Failed to create order. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Order created successfully:", data);

      if (typeof onConfirm === "function") {
        onConfirm(data);
      }
      onClose();
    } catch (error) {
      console.error("Error creating order:", error.message);
    }

    console.log("Inside handleApiRequest");
  };

  const validatePhoneNumber = (number) => {
    // Belarusian phone number regex
    const belarusianPhoneNumberRegex = /^[+]?375[\d]{9}$/;
    return belarusianPhoneNumberRegex.test(number);
  };

  const handleOkClick = async () => {
    console.log("OK Button Clicked");
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

    if (showCodeInput && verificationCode.trim() === "") {
      setVerificationError(true);
      return;
    }

    try {
      await handleApiRequest(); // Call the handleApiRequest function
      // Additional logic or state updates can be added here if needed
      onClose();
    } catch (error) {
      console.error("Error handling API request:", error.message);
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
        </div>
      </div>
    </div>
  );
};

export default ReservationPopup;
