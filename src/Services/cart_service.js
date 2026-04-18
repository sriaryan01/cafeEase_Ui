// App.js
import { myAxios } from "./helper";

export const handleAddToCart = async(productId, quantity) => {

    let items = getListOfItem(productId, quantity)
    try {
      const response = await myAxios.put("/cart", items);
      const data = response.data.data;  // Accessing the cart object
      
      // Validate cart object has required properties
      if (data && typeof data === 'object') {
        // Ensure items array exists
        if (!data.items) {
          data.items = [];
        }
        // Ensure totalAmount exists
        if (data.totalAmount === null || data.totalAmount === undefined) {
          data.totalAmount = 0;
        }
        // Ensure totalQuantity exists
        if (data.totalQuantity === null || data.totalQuantity === undefined) {
          data.totalQuantity = 0;
        }
        return data;
      }
      
      console.warn('Invalid cart response:', data);
      throw new Error('Invalid cart data received from server');
  } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
  }
  };

  const getListOfItem = (productId, quantity) => {
    return [
        {
            "productId": productId,
            "quantity": quantity
        }
    ];
};

export const fetchCart = async() =>{
    try {
        const response = await myAxios.get("/cart");
        const data = response.data.data;  // Accessing the cart object
        
        // Validate and ensure cart has required structure
        if (data && typeof data === 'object') {
          // Ensure items array exists
          if (!data.items) {
            data.items = [];
          }
          // Ensure totalAmount exists
          if (data.totalAmount === null || data.totalAmount === undefined) {
            data.totalAmount = 0;
          }
          // Ensure totalQuantity exists
          if (data.totalQuantity === null || data.totalQuantity === undefined) {
            data.totalQuantity = 0;
          }
          console.log('Cart fetched successfully:', data);
          return data;
        }
        
        // Return empty cart structure if no data
        console.warn('Empty cart response from server');
        return {
          items: [],
          totalAmount: 0,
          totalQuantity: 0
        };
    } catch (error) {
        console.error('Error fetching cart:', error);
        // Return empty cart structure on error
        return {
          items: [],
          totalAmount: 0,
          totalQuantity: 0
        };
    }
}
