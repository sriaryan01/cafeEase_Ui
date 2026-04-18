import React, { useState, useEffect } from 'react';
import { fetchCart, handleAddToCart } from '../../Services/cart_service';
import { placeOrderFromCart } from '../../Services/order_service';
import useDebounce from '../../Services/helper';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BannerBackground from "../../Assets/home-banner-background.png";
import EmptyCart from "../../Assets/emptycart.svg";
import Spinner from './Spinner';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalQuantity: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCart = async () => {
      try {
        const fetchedCart = await fetchCart();
        
        // Validate fetched cart
        if (fetchedCart && typeof fetchedCart === 'object') {
          setCart(fetchedCart);
        } else {
          // Set default empty cart structure
          setCart({ items: [], totalAmount: 0, totalQuantity: 0 });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching cart:", error);
        setError(error);
        setLoading(false);
        // Set default empty cart structure on error
        setCart({ items: [], totalAmount: 0, totalQuantity: 0 });
      }
    };

    getCart();
  }, []);

  const handlePlaceOrder = async () =>{
    try {
      await placeOrderFromCart() 
      toast.success("Order Placed", {
        position: "bottom-left",
        autoClose: 500,
        closeOnClick: true,
        theme: "dark",
      })

      const fetchedCart = await fetchCart();
      if (fetchedCart && typeof fetchedCart === 'object') {
        setCart(fetchedCart);
      } else {
        setCart({ items: [], totalAmount: 0, totalQuantity: 0 });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  }

  if (loading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className='cart-container'>

      <div className="home-bannerImage-container bg-container">
        <img src={BannerBackground} alt="" className='backgoround-img'/>
      </div>

      <div className='inner-cart-container'>
        {
          IsCartEmpty(cart) ? (
            <>
              <div className="empty-cart-section">
                <div className="cart-img" style={{
                  backgroundImage: `url(${EmptyCart})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '70vh',
                  width: '100vw',
                }}>
                </div>
              </div>
              <div className='cart-summary-footer'>
                <div className='summary-left'>
                  <span className='summary-label'>Total Amount</span>
                  <span className='summary-total'>INR 0</span>
                </div>
                <button className='cart-place-order-btn disabled-btn' disabled >Place Order</button>
              </div>
            </>
          ) : (
            <>
              <div className='cart-header-section'>
                <h2 className='cart-main-title'>🛒 Your Shopping Cart</h2>
                <p className='cart-item-count'>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in cart</p>
              </div>
              <div className='cart-items-list'>
                {cart.items.map(item => (
                  <CartItems key={item.productId} item={item} setCart={setCart} />
                ))}
              </div>

              <div className='cart-summary-footer'>
                <div className='summary-content'>
                  <span className='dollar-icon'>$</span>
                  <div className='summary-text'>
                    <span className='summary-label'>Total Amount</span>
                    <span className='summary-total-new'>INR {cart.totalAmount}</span>
                  </div>
                </div>
                <button className='place-order-btn-new' onClick={handlePlaceOrder} disabled={IsCartEmpty(cart)}>
                  ✓ PLACE ORDER
                </button>
              </div>
            </>
          )
        }
      </div>

    </div>
  );
};

const IsCartEmpty = (cart) =>{
  // Check if cart is null, undefined, or has no items
  return !cart || !cart.items || cart.items.length === 0;
}  

const CartItems = ({ item, setCart }) => {
  var [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState(item?.quantity || 1);
  const debouncedQuantity = useDebounce(inputValue, 1000); // 1000ms = 1 second

  quantity = item?.quantity || 1;

  useEffect(() => {
    if (debouncedQuantity !== item?.quantity) {
      handleQuantityChange(debouncedQuantity);
    }
  }, [debouncedQuantity, item?.quantity]);

  const handleInputChange = (e) => {
    const value = e.target.value || 1;
    setInputValue(Number(value));
  };

  const handleQuantityChange = async (qty) => {
      try {
        qty = Number(qty) || 0;
        if (qty === 0){
          toast.info("Item removed!!!",{
            position: "bottom-left",
            autoClose: 500,
            closeOnClick: true,
            theme: "dark",
          });
        }
        const updatedCart = await handleAddToCart(item.productId, qty);
        
        // Validate cart before setting state
        if (updatedCart && typeof updatedCart === 'object' && updatedCart.items) {
          setCart(updatedCart);
        } else {
          console.error('Invalid cart response:', updatedCart);
          toast.error('Error updating cart. Please try again.');
        }
      } catch (error) {
        console.error('Error updating quantity:', error);
        toast.error('Failed to update cart item');
      }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      toast.info("Item removed!!!", {
        position: "bottom-left",
        autoClose: 500,
        closeOnClick: true,
        theme: "dark",
      });
      const updatedCart = await handleAddToCart(productId, 0);
      
      // Validate cart before setting state
      if (updatedCart && typeof updatedCart === 'object' && updatedCart.items) {
        setCart(updatedCart);
      } else {
        console.error('Invalid cart response:', updatedCart);
        toast.error('Error removing item. Please try again.');
      }
    } catch (error) {
      console.error("Error removing from cart", error);
      toast.error('Failed to remove item from cart');
    }
  };

  return (
    <div className='cart-item-card-new'>
      <div className='cart-item-left'>
        <span className='cart-item-icon-badge'>🛍️</span>
        <div className='cart-item-content'>
          <h4 className='cart-item-name-new'>{item.productName}</h4>
          <div className='cart-item-prices'>
            <span className='cart-unit-price'>INR {item.pricePerUnit} per unit</span>
            <span className='cart-total-price'>$ Total: INR {item.price}</span>
          </div>
        </div>
      </div>

      <div className='cart-item-controls'>
        <button 
          className='qty-btn qty-minus' 
          onClick={() => {
            const newQty = Math.max(0, Number(inputValue) - 1);
            setInputValue(newQty);
            handleQuantityChange(newQty);
          }}
        >
          −
        </button>
        <input 
          type="number" 
          className='qty-input-compact' 
          value={inputValue} 
          onChange={handleInputChange} 
          min="0"
        />
        <button 
          className='qty-btn qty-plus' 
          onClick={() => {
            const newQty = Number(inputValue) + 1;
            setInputValue(newQty);
            handleQuantityChange(newQty);
          }}
        >
          +
        </button>
        <button 
          className='remove-btn-new' 
          onClick={() => handleRemoveFromCart(item.productId)}
        >
          🗑️ REMOVE
        </button>
      </div>
    </div>
  );
};

export default Cart;