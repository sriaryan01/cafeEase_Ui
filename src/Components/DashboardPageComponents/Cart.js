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
              <div className="cart-img" style={{
                backgroundImage: `url(${EmptyCart})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '70vh',
                width: '100vw',
              }}>
              </div>
              <div className='total-container'>
                <div className='left-side'>
                  <div className='PricePerUnit'>Total Amount - <p className='ProductPrice'>INR 0</p></div>
                </div>
                <div className='right-side'>
                  <button className='card-tag place-ordr-btn subtle' onClick={handlePlaceOrder} disabled >Place Order</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='cart-heading'>
              <h2>Your Cart</h2>
              </div>
              <div className='cart-items-container'>
              {cart.items.map(item => (
                <CartItems key={item.productId} item={item} setCart={setCart} />
              ))}
              </div>

              <div className='total-container'>
                <div className='left-side'>
                  <div className='PricePerUnit'>Total Amount - <p className='ProductPrice'>INR {cart.totalAmount}</p></div>
                </div>
                <div className='right-side'>
                  <button className='card-tag place-ordr-btn subtle' onClick={handlePlaceOrder} disabled={IsCartEmpty(cart)} >Place Order</button>
                </div>
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
    <div className='Cart-Card'>
      <div className='left-side'>
        <h3 className='ProductName'>{item.productName}</h3>
        <div>Price Per Unit - <p className='ProductPrice'>INR {item.pricePerUnit}</p></div>
        <div>Overall Price - <p className='ProductPrice overall'>INR {item.price}</p></div>
      </div>
      <div className='addCartOptions right-side'>
        <input type="number" id="quantity" className='ProductQuantity item-quantity' name="quantity" placeholder='Quantity' min="0" value={inputValue} onChange={handleInputChange} />
        <button className='remove-item-btn subtle' onClick={() => handleRemoveFromCart(item.productId)}>Remove from Cart</button>
      </div>
    </div>
  );
};

export default Cart;