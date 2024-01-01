import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./reservationForm.css";

const ReservationForm = (props) => {
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const organizationCode = "zelenaygavan";

  const fetchData = async () => {
    try {
      const bearerToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTZlZjIzYzBiZTI3ZTRjZjAyNGRhZjIiLCJpYXQiOjE3MDE5NDQ2MTMsImV4cCI6MTcwMTk0ODIxM30.xXBZf5Ey1uA98xo8a2WH_2dkkQOD5L1W3r8-DdQ-bn8";

      const formattedArrivalDate = arrivalDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      const formattedDepartureDate = departureDate.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      // console.log("Data to be sent:", JSON.stringify(requestData, null, 2));

      const response = await fetch(
        `https://localhost:44377/api/v1/Order/getavailablehouses?OrganizationCode=${organizationCode}&DateIn=${formattedArrivalDate}&DateOut=${formattedDepartureDate}&CountPeople=${numberOfPeople}`,
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
          `Failed to fetch data. Status: ${response.status}, Response: ${errorText}`
        );
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();
      props.setHouses(data.data);
      props.setIsSearching(true);
    } catch (error) {
      console.error("Error fetching house data:", error.message);
    }
  };

  useEffect(() => {
    if (arrivalDate && departureDate) {
      fetchData();
    }
  }, [arrivalDate, departureDate, numberOfPeople]);

  const handleBookClick = () => {
    if (arrivalDate && departureDate && props.houses) {
      const numberOfPeople = document.getElementById("numberOfPeople").value;

      const filteredHouses = props.houses.filter((house) => {
        const bookedDates = house.bookedDates || [];
        const isAvailable =
          house.capacity >= numberOfPeople &&
          !bookedDates.some((range) => {
            const bookedStartDate = new Date(range.startDate);
            const bookedEndDate = new Date(range.endDate);
            return (
              arrivalDate >= bookedStartDate && departureDate <= bookedEndDate
            );
          });

        return isAvailable;
      });

      props.setIsSearching(true);
      props.setHouses(filteredHouses);

      if (filteredHouses.length === 0) {
        console.log("No houses available for the selected criteria.");
      }
    } else {
      console.error("Please select both arrival and departure dates.");
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
          <select
            id="numberOfPeople"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <button onClick={handleBookClick}>Поиск</button>
      </div>
    </div>
  );
};

export default ReservationForm;
