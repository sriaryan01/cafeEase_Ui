import React, { useState } from 'react';
import "../../CSS/Modal.css"
import { GetDate } from './Orders';

const OrderDetailsModal = ({ order, onClose }) => {
    const [expandedItem, setExpandedItem] = useState(null);

    const toggleItemExpand = (productId) => {
        setExpandedItem(expandedItem === productId ? null : productId);
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content-enhanced" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Order Details</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="order-summary-section">
                    <div className="summary-item">
                        <span className="summary-icon">🛍️</span>
                        <div>
                            <label>Order ID</label>
                            <p className="summary-value">#{order.orderId}</p>
                        </div>
                    </div>
                    <div className="summary-item">
                        <span className="summary-icon">📅</span>
                        <div>
                            <label>Order Date</label>
                            <p className="summary-value">{GetDate(order.orderDateAndTime)}</p>
                        </div>
                    </div>
                    <div className="summary-item">
                        <span className="summary-icon">✅</span>
                        <div>
                            <label>Status</label>
                            <p className="summary-value status-badge">{order.orderStatus}</p>
                        </div>
                    </div>
                </div>

                <div className="items-section">
                    <h3 className="section-title">Order Items</h3>
                    <div className="items-list">
                        {order.items.map(item => (
                            <OrderItems 
                                key={item.productId} 
                                item={item} 
                                isExpanded={expandedItem === item.productId}
                                onToggleExpand={() => toggleItemExpand(item.productId)}
                            />
                        ))}
                    </div>
                </div>

                <div className="order-total-section">
                    <div className="total-item">
                        <span className="total-label">Total Quantity</span>
                        <span className="total-value">{order.totalQuantity} items</span>
                    </div>
                    <div className="total-item highlight">
                        <span className="total-label">Total Amount</span>
                        <span className="total-value-amount">INR {order.totalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderItems = ({ item, isExpanded, onToggleExpand }) => {
    return (
        <div className={`order-item-card-enhanced ${isExpanded ? 'expanded' : ''}`}>
            <div className='item-header' onClick={onToggleExpand}>
                <div className='item-header-left'>
                    <span className='item-icon'>☕</span>
                    <div className='item-name-section'>
                        <h4 className='item-name'>{item.productName}</h4>
                        <span className='item-qty-badge'>{item.quantity}x</span>
                    </div>
                </div>
                <div className='item-header-right'>
                    <span className='item-price-highlight'>INR {item.price}</span>
                    <span className='expand-icon'>{isExpanded ? '▼' : '▶'}</span>
                </div>
            </div>
            
            {isExpanded && (
                <div className='item-details'>
                    <div className='detail-row'>
                        <span className='detail-label'>Price Per Unit</span>
                        <span className='detail-value'>INR {item.pricePerUnit}</span>
                    </div>
                    <div className='detail-row'>
                        <span className='detail-label'>Quantity</span>
                        <span className='detail-value'>{item.quantity} units</span>
                    </div>
                    <div className='detail-row total-row'>
                        <span className='detail-label'>Item Total</span>
                        <span className='detail-value-total'>INR {item.price}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsModal;