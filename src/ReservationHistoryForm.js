import React, { useState } from "react";
import "./reservationHistoryForm.css";

function ReservationHistoryForm({ onClose, availableOrderData }) {
  console.log("Available Order Data:", availableOrderData);

  const orders = availableOrderData?.data || [];
  const ordersPerPage = 5; // Set the number of orders to display per page
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber, event) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (orderId) => {
    console.log(`Delete order with ID ${orderId}`);
  };

  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const displayedOrders = orders.slice(startIndex, endIndex);

  return (
    <form>
      <div className="BookingDetails">
        <h3>Мои бронирования</h3>
        <button onClick={onClose}>Главная</button>
      </div>
      {orders.length > 0 ? (
        <div>
          <h4>Мои бронирования:</h4>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата заезда</th>
                <th>Дата выезда</th>
                <th>Номер дома</th>
                <th>Статус заказа</th>
                <th>Стоимость</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.dateInString}</td>
                  <td>{order.dateOutString}</td>
                  <td>{order.houseName}</td>
                  <td>{order.statusString}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(order.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={(event) => handlePageChange(index + 1, event)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Данные о бронировании отсутствуют</p>
      )}
    </form>
  );
}

export default ReservationHistoryForm;
