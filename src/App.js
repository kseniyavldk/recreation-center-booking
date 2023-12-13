import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import "./App.css";
import ReservationPopup from "./ReservationPopup";

function App() {
  const [houses, setHouses] = useState([]);
  const [arrivalDate, setArrivalDate] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [showReservationPopup, setShowReservationPopup] = useState(false);

  const handleReservation = (e) => {
    e.preventDefault();

    const allHouses = [
      {
        id: 1,
        name: "Beautiful Villa",
        price: "$200/сутки",
        description:
          "Выдающийся дизайн, непревзойденное качество и первоклассное обслуживание воплощают в себе исключительный опыт роскоши. Просторные помещения наполнены изысканным искусством, выдающейся мебелью и передовыми технологиями, создавая уникальную атмосферу комфорта.",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 2,
        name: "Cozy Cottage",
        price: "$100/сутки",
        description:
          "Выдающийся дизайн, непревзойденное качество и первоклассное обслуживание воплощают в себе исключительный опыт роскоши. Просторные помещения наполнены изысканным искусством, выдающейся мебелью и передовыми технологиями, создавая уникальную атмосферу комфорта.",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 3,
        name: "Luxury Apartment",
        price: "$300/сутки",
        description:
          "Выдающийся дизайн, непревзойденное качество и первоклассное обслуживание воплощают в себе исключительный опыт роскоши. Просторные помещения наполнены изысканным искусством, выдающейся мебелью и передовыми технологиями, создавая уникальную атмосферу комфорта.",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 4,
        name: "Luxury Apartment",
        price: "$300/сутки",
        description:
          "Выдающийся дизайн, непревзойденное качество и первоклассное обслуживание воплощают в себе исключительный опыт роскоши. Просторные помещения наполнены изысканным искусством, выдающейся мебелью и передовыми технологиями, создавая уникальную атмосферу комфорта.",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
      {
        id: 5,
        name: "Luxury Apartment",
        price: "$300/сутки",
        description:
          "Выдающийся дизайн, непревзойденное качество и первоклассное обслуживание воплощают в себе исключительный опыт роскоши. Просторные помещения наполнены изысканным искусством, выдающейся мебелью и передовыми технологиями, создавая уникальную атмосферу комфорта.",
        image:
          "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      },
    ];

    const filteredHouses = allHouses.filter((house) => {
      const bookedDates = house.bookedDates || [];

      const isAvailable = !bookedDates.some((range) => {
        const bookedStartDate = new Date(range.startDate);
        const bookedEndDate = new Date(range.endDate);

        return (
          (arrivalDate >= bookedStartDate && arrivalDate <= bookedEndDate) ||
          (departureDate >= bookedStartDate &&
            departureDate <= bookedEndDate) ||
          (arrivalDate <= bookedStartDate && departureDate >= bookedEndDate)
        );
      });

      return isAvailable;
    });

    setHouses(filteredHouses);
  };

  const handleBookClick = (house) => {
    setSelectedHouse(house);
    setShowReservationPopup(true);
  };

  return (
    <div className="App">
      <form onSubmit={handleReservation}>
        <ReservationForm
          name="reservationForm"
          setArrivalDate={setArrivalDate}
          setDepartureDate={setDepartureDate}
        />

        <div className="HouseTiles">
          {houses.map((house) => (
            <div key={house.id} className="HouseTile">
              <img src={house.image} alt={house.name} />
              <div className="HouseDetails">
                <h3>{house.name}</h3>
                <p>{house.price}</p>
                <p>{house.description}</p>
              </div>
              <div>
                <button
                  onClick={() => handleBookClick(house)}
                  className="BookButton"
                >
                  Забронировать
                </button>
              </div>
            </div>
          ))}
        </div>

        {showReservationPopup && (
          <div className="PopupOverlay">
            <div className="Popup">
              <ReservationPopup
                arrivalDate={arrivalDate}
                departureDate={departureDate}
                selectedHouse={selectedHouse}
                onClose={() => setShowReservationPopup(false)}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default App;
