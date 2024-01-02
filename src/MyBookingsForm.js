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

  const fetchValidationCode = async () => {
    try {
      const organizationCode = "zelenaygavan";
      const bearerToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTZlZjIzYzBiZTI3ZTRjZjAyNGRhZjIiLCJpYXQiOjE3MDE5NDQ2MTMsImV4cCI6MTcwMTk0ODIxM30.xXBZf5Ey1uA98xo8a2WH_2dkkQOD5L1W3r8-DdQ-bn8";

      const response = await fetch(
        `https://localhost:44377/api/v1/Manage/Auth?OrganizationCode=${organizationCode}&PhoneNumber=${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Failed to fetch validation code. Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(
          `Failed to fetch validation code. Status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.failed) {
        alert(data.message);
        return;
      }

      setGeneratedCode("Код подтверждения отправлен");
    } catch (error) {
      console.error("Error fetching validation code:", error.message);
    }

    setShowCodeInput(true);
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
      fetchValidationCode();
    }
  };

  const handleOkClick = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      setValidationError({
        phoneNumber: true,
      });
      return;
    }

    if (showCodeInput) {
      if (verificationCode.trim() === "") {
        setVerificationError(true);
        return;
      }

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
      try {
        await fetchValidationCode();
      } catch (error) {
        console.error("Error handling API request:", error.message);
      }
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
            {showCodeInput && <p className="error-message">{generatedCode}</p>}
          </div>
        )}
        <div className="button-group">
          <button onClick={handleOkClick}>OK</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsForm;
