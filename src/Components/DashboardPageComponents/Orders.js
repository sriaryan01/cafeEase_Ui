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
        <div className="orders-search-wrapper">
          <div className="orders-search-bar-container">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                inputMode="numeric" 
                id="search" 
                className="orders-search-input"
                placeholder="Search orders by Order ID..." 
                onKeyDown={handleKeyDown} 
              />
            </div>
            <button className='orders-date-btn' onClick={toggleCalendars}>
              📅 DATE RANGE
            </button>
            <button className='orders-search-btn' onClick={searchOrdersAndHideCalendar}>
              🔎 SEARCH
            </button>
          </div>
        </div>
        <div className={`calendar-container ${showCalendars ? 'show' : ''}`}>
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
              <div className='orders-list-container'>

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
    <div className='order-card-wrapper'>
      <div className='order-card-container'>
        <div className='order-card-header'>
          <div className='order-card-title-section'>
            <div className='order-badge-icon'>🛍️</div>
            <div>
              <h2 className='order-id'>Order #{order.orderId}</h2>
              <span className='order-status-badge'>{order.orderStatus}</span>
            </div>
          </div>
        </div>

        <div className='order-card-content'>
          <div className='order-info-grid'>
            <div className='order-info-item'>
              <span className='order-info-icon'>📅</span>
              <div>
                <label className='order-info-label'>Order Date</label>
                <p className='order-info-value'>{GetDate(order.orderDateAndTime)}</p>
              </div>
            </div>
            <div className='order-info-item'>
              <span className='order-info-icon'>📦</span>
              <div>
                <label className='order-info-label'>Total Quantity</label>
                <p className='order-info-value'>{order.totalQuantity} items</p>
              </div>
            </div>
            <div className='order-info-item'>
              <span className='order-info-icon'>💰</span>
              <div>
                <label className='order-info-label'>Total Amount</label>
                <p className='order-info-value'>INR {order.totalAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='order-card-actions'>
          <button className='order-action-btn view-details-btn' onClick={() => handleDetailsOpening()}>
            👁️ VIEW DETAILS
          </button>
          <button className='order-action-btn download-bill-btn' onClick={() => handleBillOpening(order.orderId)}>
            ⬇️ DOWNLOAD BILL
          </button>
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