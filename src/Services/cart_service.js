// App.js
import { myAxios } from "./helper";

export const handleAddToCart = async(productId, quantity) => {

    let items = getListOfItem(productId, quantity)
    try {
      const response = await myAxios.put("/cart", items);
      const data = response.data.data;  // Accessing the array of products
      return data;
  } catch (error) {
      console.error('Error fetching product list:', error);
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
        const data = response.data.data;  // Accessing the cart
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
}
