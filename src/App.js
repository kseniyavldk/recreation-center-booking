import React, { useState, useEffect } from "react";
import ReservationForm from "./ReservationForm";
import "./App.css";
import ReservationPopup from "./ReservationPopup";
import MyBookingsForm from "./MyBookingsForm";
import ReservationHistoryForm from "./ReservationHistoryForm";

function App() {
  const [houses, setHouses] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  const [showMyBookingsForm, setShowMyBookingsForm] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedHouseDataList, setSelectedHouseDataList] = useState([]);
  const [selectedHouseIndex, setSelectedHouseIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [selectedHouseInfo, setSelectedHouseInfo] = useState({
    id: 0,
    name: "",
    capacity: 0,
    totalPrice: 0,
    price: 0,
  });

  const calculateAmount = (selectedHouse) => {
    if (selectedHouse && selectedHouse.type && selectedHouse.price) {
      return {
        name: selectedHouse.type,
        price: selectedHouse.price,
      };
    } else {
      return {
        name: "",
        price: 0,
      };
    }
  };

  const handleHouseSelection = (house, index) => {
    setSelectedHouse(house);
    const { name, price } = calculateAmount(house);

    console.log(house);
  };

  const handleReservation = async (e) => {
    e.preventDefault();

    try {
      const filteredHouses = houses.filter((house) => {
        const bookedDates = house.bookedDates || [];

        const isAvailable = !bookedDates.some((range) => {
          const bookedStartDate = new Date(range.startDate);
          const bookedEndDate = new Date(range.endDate);
          const selectedArrivalDate = new Date(arrivalDate);
          const selectedDepartureDate = new Date(departureDate);

          return (
            (selectedArrivalDate >= bookedStartDate &&
              selectedArrivalDate <= bookedEndDate) ||
            (selectedDepartureDate >= bookedStartDate &&
              selectedDepartureDate <= bookedEndDate) ||
            (selectedArrivalDate <= bookedStartDate &&
              selectedDepartureDate >= bookedEndDate)
          );
        });

        return isAvailable;
      });
      setHouses(filteredHouses);
      if (filteredHouses.length > 0) {
        handleHouseSelection(selectedHouse, 0);
      }
      setIsSearching(true);
    } catch (error) {
      console.error("Error fetching house data:", error);
    }
  };

  const handleBookClick = async (
    isBooked,
    arrivalDate,
    departureDate,
    selectedHouse,
    index
  ) => {
    console.log("Arrival Date:", arrivalDate);
    console.log("Departure Date:", departureDate);
    if (!arrivalDate || !departureDate) {
      console.error("Please select both arrival and departure dates.");
      return;
    }

    if (isBooked && selectedHouse) {
      const { name, price } = calculateAmount(selectedHouse);
      console.log("Calculated Amount:", { name, price });
      console.log("Arrival Date:", arrivalDate);
      console.log("Departure Date:", departureDate);

      try {
        const bearerToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlcmFkbWluIiwianRpIjoiNzUyZDQ1NWQtYzNhOS00NzMzLWI2NjgtZjExZmUwNDk2M2IxIiwiZW1haWwiOiJzdXBlcmFkbWluQGdtYWlsLmNvbSIsInVpZCI6IjZjYzEzNmE0LTk3NGUtNDViZi05NmExLWM5YmRkMjM4Mzc2YiIsImZpcnN0X25hbWUiOiJNdWtlc2giLCJsYXN0X25hbWUiOiJNdXJ1Z2FuIiwiZnVsbF9uYW1lIjoiTXVrZXNoIE11cnVnYW4iLCJpcCI6IjAuMC4wLjEiLCJyb2xlcyI6WyJBZG1pbiIsIk1vZGVyYXRvciIsIlN1cGVyQWRtaW4iLCJCYXNpYyJdLCJuYmYiOjE3MDI5MDA2ODUsImV4dCI6MTcwNTQ5MjY4NSwiaXNzIjoiQXNwTmV0Q29yZUhlcm8uQm9pbGVycGxhdGUuQXBpIiwiYXVkIjoiQXNwTmV0Q29yZUhlcm8uQm9pbGVycGxhdGUuQXBpLlVzZXIifQ.JUDpKFgFI8cDbJXcsQqSxNMEYjXZayaSMkyYneOsw80";

        const response = await fetch(
          `https://localhost:44377/api/v1/Order/getavailablehouse/${selectedHouse.id}?DateIn=${arrivalDate}&DateOut=${departureDate}`,
          {
            method: "GET",
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

        if (data.failed) {
          alert(data.message);
          return;
        }

        console.log(data);

        setSelectedHouseInfo({
          id: data.id,
          name: data.type,
          capacity: data.capacity,
          price: data.price,
          totalPrice: data.totalPrice,
        });

        setSelectedHouseIndex(index);
        setShowReservationPopup(true);
      } catch (error) {
        console.error("Error fetching available houses:", error.message);
      }
    } else {
      console.error("Invalid selectedHouse object:", selectedHouse);
    }
  };

  const handleMyBookingsClick = () => {
    setShowMyBookingsForm(true);
  };

  const handleBookingHistoryOpen = () => {
    setShowBookingHistory(true);
  };

  return (
    <div className="App">
      <button className="my-booking" onClick={handleMyBookingsClick}>
        Мои бронирования
      </button>

      {showBookingHistory ? (
        <div>
          <ReservationHistoryForm />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleReservation(e);
          }}
        >
          <ReservationForm
            setHouses={setHouses}
            setArrivalDate={setArrivalDate}
            setDepartureDate={setDepartureDate}
            onBook={handleBookClick}
            calculateAmount={calculateAmount}
            setIsSearching={setIsSearching}
            houses={houses}
          />

          {isSearching && (
            <div className="HouseTiles">
              {houses.map((house, index) => (
                <div key={house.id} className="HouseTile">
                  <img
                    src={`data:image/jpeg;base64,${house.image}`}
                    alt={house.organizationName || "House Image"}
                  />
                  <div className="HouseDetails">
                    <h3>{house.type}</h3>
                    <p>Стоимость: {house.price} BYN</p>
                    <p>Вместимость: {house.capacity} человека</p>
                    <p>{house.description}</p>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        handleBookClick(
                          true,
                          arrivalDate,
                          departureDate,
                          house,
                          index
                        )
                      }
                      className="BookButton"
                      disabled={!house}
                    >
                      Забронировать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showReservationPopup && selectedHouseIndex !== null && (
            <div className="PopupOverlay">
              <div className="Popup">
                <ReservationPopup
                  arrivalDate={arrivalDate}
                  departureDate={departureDate}
                  selectedHouseInfo={selectedHouseInfo}
                  onClose={() => setShowReservationPopup(false)}
                />
              </div>
            </div>
          )}

          {showMyBookingsForm && (
            <div className="MyBookingsFormOverlay">
              <div className="MyBookingsForm">
                <MyBookingsForm
                  onClose={() => setShowMyBookingsForm(false)}
                  onBookingHistoryOpen={handleBookingHistoryOpen}
                  onSelectHouse={handleHouseSelection}
                />
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default App;
