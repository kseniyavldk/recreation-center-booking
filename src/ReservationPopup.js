import React, { useState } from "react";

const ReservationPopup = ({
  arrivalDate,
  departureDate,
  roomCategory,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState("");
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
      // Check verification code (trim leading/trailing spaces)
      if (verificationCode.trim() === generatedCode.toString()) {
        onConfirm({
          arrivalDate,
          departureDate,
          roomCategory,
          name,
          phoneNumber,
        });
        onClose();
      } else {
        setVerificationError(true);
      }
    } else {
      // Generate and display verification code
      const code = generateVerificationCode();
      setGeneratedCode(code);
      setShowCodeInput(true);
    }
  };

  return (
    <div>
      <h2>Reservation Details</h2>
      {/* Display reservation details here... */}
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      {showCodeInput && (
        <div>
          <label>Verification Code:</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              setVerificationCode(e.target.value);
              setVerificationError(false); // Clear error when user types
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
  );
};

export default ReservationPopup;
