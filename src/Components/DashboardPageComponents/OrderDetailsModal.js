import React, { useState } from 'react';
import "../../CSS/Modal.css"
import { GetDate } from './Orders';

const OrderDetailsModal = ({ order, onClose }) => {

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <div className='details-container'>
                    <h3 className='ProductName'>{order.orderId}</h3>
                    <div>Order Date - <p className='ProductPrice'>{GetDate(order.orderDateAndTime)}</p></div>
                    <div>Order Status - <p className='ProductPrice'>{order.orderStatus}</p></div>
                    
                </div>
                <div className='cart-items-container'>
                    {order.items.map(item => (
                        <OrderItems key={item.productId} item={item} />
                    ))}
                </div>
                <div className='details-container detail-footer'>
                    <div>Total Quantity - <p className='ProductPrice'>{order.totalQuantity}</p></div>
                    <div>Total Amount - <p className='ProductPrice overall'> INR  {order.totalAmount}</p></div>
                </div>
            </div>
        </div>
    );
};

const OrderItems = ({ item }) => {


    return (
        <div className='order-item-card'>
            <div className='left-side'>
                <h3 className='ProductName'>{item.productName}</h3>
                <div>Price Per Unit - <p className='ProductPrice'>INR {item.pricePerUnit}</p></div>
                <div>Quantity - <p className='ProductPrice'>{item.quantity}</p></div>
                <div>Overall Price - <p className='ProductPrice overall'>INR {item.price}</p></div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;