
import { myAxios } from "./helper";

export const placeOrderFromCart = async() => {

    try {
      const response = await myAxios.post("/orders");
      const data = response.data;  // Accessing the array of products
      return data;
  } catch (error) {
      console.error('Error placing order :', error);
      throw error;
  }
};

export const getAllOrdersForUser = async() => {

  try {
    const response = await myAxios.post("/orders/search", {});
    const data = response.data.data;
    return data;
} catch (error) {
    console.error('Error fetching orders :', error);
    throw error;
}
};


export const getAllOrdersForUserWithSearchRequest = async(orderId, startTime, endTime) => {
  if (orderId === ''){
    orderId = null;
  }
  let reqDto ={
    "orderId":orderId,
    "startTime":startTime,
    "endTime":endTime
  };

  try {
    const response = await myAxios.post("/orders/search", reqDto);
    const data = response.data.data;
    return data;
} catch (error) {
    console.error('Error fetching orders :', error);
    throw error;
}
};