import React, { useEffect, useState } from 'react';
import { getAllOrdersForUser, getAllOrdersForUserWithSearchRequest } from '../../Services/order_service';
import BannerBackground from "../../Assets/home-banner-background.png";
import NoOrdersImg from "../../Assets/noOrders.webp";
import MyCalendar from "../DashboardPageComponents/Calendar";
import CalendarIcon from "../../Assets/calendar-icon.png"
import Spinner from './Spinner';
import { viewBill } from '../../Services/bill_service';
import BillModal from './BillModal';
import OrderDetailsModal from './OrderDetailsModal';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendars, setShowCalendars] = useState(false);

  const handleDateChange = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  const toggleCalendars = () => {
    setShowCalendars(prev => !prev);
  };


  const searchOrdersAndHideCalendar = async () => {
    const searchText = document.getElementById('search').value;
    console.log(searchText);

    let orders;
    try {
      orders = await getAllOrdersForUserWithSearchRequest(searchText, selectedStartDate, selectedEndDate);
      setOrders(orders)
    } catch {
      setOrders([])
    }
    if (showCalendars) {
      toggleCalendars();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchOrdersAndHideCalendar();
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const orders = await getAllOrdersForUser();
        console.log("Orders fetched successfully")
        setOrders(orders);
        setLoading(false);

      } catch (error) {
        setError(error);
        setLoading(false);
        console.log("Error while fetching orders");
      }
    };

    getOrders();
  }, []);

  if (loading) {
    return <div><Spinner /></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className='cart-container'>

      <div className="home-bannerImage-container bg-container">
        <img src={BannerBackground} alt="" className='backgoround-img' />
      </div>


      <div className='inner-cart-container'>
        <div className="search-container">
          <input type="text" inputMode="numeric" id="search" placeholder="Search orders by OrderId..." onKeyDown={handleKeyDown} />
          <button className='calendar-icon-container' onClick={toggleCalendars}>
            <img src={CalendarIcon} className='calendar-icon' alt="Calendar Icon" />
          </button>
          <button className='card-tag subtle search-btn' onClick={searchOrdersAndHideCalendar}>Search</button>
        </div>
        <div className='calendar-container'>
          <MyCalendar
            showCalendars={showCalendars}
            toggleCalendars={toggleCalendars}
            onDateChange={handleDateChange}
          />
        </div>
        {
          AreOrdersPresent(orders) ? (
            <>
              <div className="orders-img" style={{
                backgroundImage: `url(${NoOrdersImg})`,
                backgroundSize: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '800px',
                width: '70vw',
              }}>
              </div>
            </>
          ) : (
            <>
              <div>

                {orders.map(order => (
                  <Order key={order.orderId} order={order} />
                ))}
              </div>

            </>
          )
        }
      </div>
    </div>
  );
};

const AreOrdersPresent = (orders) => {
  return orders == null || orders.length === 0;
}

const Order = ({ order }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  const handleBillOpening = async (orderId) => {
    try {
      const blob = await viewBill(orderId);
      setPdfBlob(blob);
      setShowBillModal(true);
    } catch (error) {
      console.error('Error fetching and displaying the PDF', error);
    }
  };

  const handleDetailsOpening = async () => {
    try {
      setShowOrderDetailsModal(true);
    } catch (error) {
      console.error('Error displaying order detail', error);
    }
  };

  const handleCloseModal = () => {
    setShowBillModal(false);
    setShowOrderDetailsModal(false);
    setPdfBlob(null);
  };

  return (
    <div>
      <div className='Cart-Card'>
        <div className='left-side'>
          <h3 className='ProductName'>{order.orderId}</h3>
          <div>Order Date - <p className='ProductPrice'>{GetDate(order.orderDateAndTime)}</p></div>
          <div>Order Status - <p className='ProductPrice'>{order.orderStatus}</p></div>
          <div>Total Quantity - <p className='ProductPrice'>{order.totalQuantity}</p></div>
          <div>Total Amount - <p className='ProductPrice overall'> INR  {order.totalAmount}</p></div>
        </div>
        <div className='right-side'>

          <button className='card-tag subtle view-order-btn' onClick={() => handleDetailsOpening()} >View Order Detail</button>
          <button className='card-tag subtle' onClick={() => handleBillOpening(order.orderId)}>Download bill</button>

        </div>
      </div>
      {showBillModal && (
        <BillModal pdfBlob={pdfBlob} onClose={handleCloseModal} />
      )}
      {showOrderDetailsModal && (
        <OrderDetailsModal order={order} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export const GetDate = (dateTime) => {
  const dateObject = new Date(dateTime);

  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);

  const date = `${year}-${month}-${day}`;
  // console.log(date);
  return date;

}

export default Orders;