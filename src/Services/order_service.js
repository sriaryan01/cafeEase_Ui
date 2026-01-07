import { myAxios } from "./helper";

export const placeOrderFromCart = async() => {
    try {
      const response = await myAxios.post("/orders");
      const data = response.data;
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

// Admin: Get all orders with search (supports customer filters and orderId/time)
export const getAllOrdersForAdmin = async (searchRequest) => {
  try {
    const response = await myAxios.post("/orders/search", searchRequest || {});
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error('Error fetching orders for admin:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await myAxios.post(`/orders/cancel/${orderId}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

// Create order by admin
export const createOrderByAdmin = async (emailId, items) => {
  try {
    const response = await myAxios.post(`/orders/admin?emailId=${emailId}`, items);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error creating order by admin:', error);
    throw error;
  }
};