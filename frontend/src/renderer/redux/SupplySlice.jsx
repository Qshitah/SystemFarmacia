// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Define an initial state for users
const initialState = {
  supplies: [],
  statusSupplies: "idle", // or 'loading', 'succeeded', 'failed'
  errorSupplies: null,
};


const fetchSuppliesAsync = createAsyncThunk("supplies/fetchSuppliesAsync", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/supplies");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching Supplies data";
  }
});

const addSuppliesAsync = createAsyncThunk("supplies/addSuppliesAsync", async (formData) => {
  try {
    const response = await axios.post("http://localhost:8080/api/supplies", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error adding Supplies";
  }
});

const addMultipleSuppliesAsync = createAsyncThunk("supplies/addMultipleSuppliesAsync", async (formData) => {
    try {
      const response = await axios.post("http://localhost:8080/api/supplies/multiple", formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || "Error adding Supplies";
    }
  });

const updateSuppliesAsync = createAsyncThunk("supplies/updateSuppliesAsync", async (formData) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/supplies/${formData.id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error updating Supplies";
  }
});

const deleteSuppliesAsync = createAsyncThunk("supplies/deleteSuppliesAsync", async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/supplies/${id}`);
    return id;
  } catch (error) {
    throw error.response?.data || "Error deleting Supplies";
  }
});


// Create a slice of the Redux store
const Supplieslice = createSlice({
  name: "Supplies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliesAsync.pending, (state) => {
        state.statusSupplies = "loading";
      })
      .addCase(fetchSuppliesAsync.fulfilled, (state, action) => {
        state.statusSupplies = "succeeded";
        state.supplies = action.payload;
      })
      .addCase(fetchSuppliesAsync.rejected, (state, action) => {
        state.statusSupplies = "failed";
        state.errorSupplies = action.error.message;
      })

      .addCase(addMultipleSuppliesAsync.pending, (state) => {
        state.statusSupplies = "loading";
      })
      .addCase(addMultipleSuppliesAsync.fulfilled, (state, action) => {
        state.statusSupplies = "succeeded";
        state.supplies = [...state.supplies, ...action.payload];
      })
      .addCase(addMultipleSuppliesAsync.rejected, (state, action) => {
        state.statusSupplies = "failed";
        state.errorSupplies = action.error.message;
      })

      .addCase(addSuppliesAsync.pending, (state) => {
        state.statusSupplies = "loading";
      })
      .addCase(addSuppliesAsync.fulfilled, (state, action) => {
        state.statusSupplies = "succeeded-adding";
        state.supplies = [...state.supplies, action.payload];
      })
      .addCase(addSuppliesAsync.rejected, (state, action) => {
        state.statusSupplies = "failed-adding";
        state.errorSupplies = action.error.message;
      })

      .addCase(updateSuppliesAsync.pending, (state) => {
        state.statusSupplies = "loading";
      })
      .addCase(updateSuppliesAsync.fulfilled, (state, action) => {
        state.statusSupplies = "succeeded-updating";
        state.supplies = state.supplies.map((Supplies) => Supplies.id === action.payload.id ? action.payload : Supplies);
      })
      .addCase(updateSuppliesAsync.rejected, (state, action) => {
        state.statusSupplies = "failed-updating";
        state.errorSupplies = action.error.message;
      })

      .addCase(deleteSuppliesAsync.pending, (state) => {
        state.statusSupplies = "loading";
      })
      .addCase(deleteSuppliesAsync.fulfilled, (state, action) => {
        state.statusSupplies = "succeeded-deleting";
        state.supplies = state.supplies.filter((Supplies) => Supplies.id !== action.payload);
      })
      .addCase(deleteSuppliesAsync.rejected, (state, action) => {
        state.statusSupplies = "failed-deleteting";
        state.errorSupplies = action.error.message;
      })

  },
});

// Export the async thunk for fetching users
export {fetchSuppliesAsync, addSuppliesAsync , addMultipleSuppliesAsync,updateSuppliesAsync, deleteSuppliesAsync};
// Export the reducer
export default Supplieslice.reducer;