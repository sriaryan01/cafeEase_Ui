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
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCart = async () => {
      try {
        const cart = await fetchCart();
        console.log("Cart fetched successfully")
        setCart(cart);
        setLoading(false);

      } catch (error) {
        setError(error);
        setLoading(false);
        console.log("Error while fetching cart");
      }
    };

    getCart();
  }, []);

  const handlePlaceOrder = async () =>{

    await placeOrderFromCart() 
    toast.success("Order Placed", {
      position: "bottom-left",
      autoClose: 500,
      closeOnClick: true,
      theme: "dark",
    })

    const cart = await fetchCart();
    setCart(cart);

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
  // console.log(items.length)
  return cart == null || cart.items == null || cart.items.length === 0
}  

const CartItems = ({ item, setCart }) => {
  var [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState(item.quantity);
  const debouncedQuantity = useDebounce(inputValue, 1000); // 2000ms = 2 seconds

  quantity = item.quantity;

  useEffect(() => {
    if (debouncedQuantity !== item.quantity) {
      handleQuantityChange(debouncedQuantity);
    }
  }, [debouncedQuantity]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleQuantityChange = async (qty) => {

      // toast.success("Quantity updated...", {
      //   theme: "dark"
      // });
      if (qty==0){
        toast.info("Item removed!!!",{
          position: "bottom-left",
          autoClose: 500,
          closeOnClick: true,
          theme: "dark",
        });
      }
      var cart = await handleAddToCart(item.productId, qty);
      console.log(cart)
      setCart(cart)
    // }
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
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing from cart", error);
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