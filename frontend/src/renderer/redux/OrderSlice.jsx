// ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define an initial state for orders
const initialState = {
  orders: [],
  statusOrders: "idle", // or 'loading', 'succeeded', 'failed'
  errorOrders: null,
};

// Async thunk for fetching orders
const fetchOrdersAsync = createAsyncThunk("orders/fetchOrdersAsync", async () => {
  try {
    if (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === undefined) {
       return [];
    } else {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      return response.data;
    }

  } catch (error) {
    throw error.response?.data || "Error fetching orders data";
  }
});

// Async thunk for adding a new order
const addOrderAsync = createAsyncThunk("orders/addOrderAsync", async (orderData) => {
  try {
    if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === undefined){
        throw new Error("Unauthorized");
    }else{
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("http://localhost:8080/api/orders", orderData,{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      return response.data;
    }
    
  } catch (error) {
    throw error.response?.data || "Error adding a new order";
  }
});

// Async thunk for updating an order
const updateOrderAsync = createAsyncThunk("orders/updateOrderAsync", async (orderData) => {
  try {
    if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === undefined){
        throw new Error("Unauthorized");
    }else{
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(`http://localhost:8080/api/orders/${orderData.orderId}`, orderData,{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      return response.data;
    }

  } catch (error) {
    throw error.response?.data || "Error updating order";
  }
});

// Async thunk for deleting an order
const deleteOrderAsync = createAsyncThunk("orders/deleteOrderAsync", async (orderId) => {
  try {

    if(localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === undefined){
      throw new Error("Unauthorized");
    }else{
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/orders/${orderId}`,{
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        }
      });
      return orderId;
    }
 // Return the deleted order ID
  } catch (error) {
    throw error.response?.data || "Error deleting order";
  }
});

// Create a slice of the Redux store
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersAsync.pending, (state) => {
        state.statusOrders = "loading";
      })
      .addCase(fetchOrdersAsync.fulfilled, (state, action) => {
        state.statusOrders = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrdersAsync.rejected, (state, action) => {
        state.statusOrders = "failed";
        state.errorOrders = action.error.message;
      })

      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.statusOrders = "succeeded";
        state.orders.push(action.payload); // Add the new order to the state
      })
      .addCase(addOrderAsync.rejected, (state, action) => {
        state.statusOrders = "failed";
        state.errorOrders = action.error.message;
      })

      .addCase(updateOrderAsync.fulfilled, (state, action) => {
        state.statusOrders = "succeeded";
        // Update the existing order in the state with the new data
        state.orders = state.orders.map(order =>
          order.orderId === action.payload.orderId ? action.payload : order
        );
      })
      .addCase(updateOrderAsync.rejected, (state, action) => {
        state.statusOrders = "failed";
        state.errorOrders = action.error.message;
      })

      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.statusOrders = "succeeded";
        // Remove the deleted order from the state
        state.orders = state.orders.filter(order => order.orderId !== action.payload);
      })
      .addCase(deleteOrderAsync.rejected, (state, action) => {
        state.statusOrders = "failed";
        state.errorOrders = action.error.message;
      });
  },
});

// Export the async thunks
export { fetchOrdersAsync, addOrderAsync, updateOrderAsync, deleteOrderAsync };

// Export the reducer
export default orderSlice.reducer;
