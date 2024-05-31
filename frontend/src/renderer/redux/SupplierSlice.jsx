// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Define an initial state for users
const initialState = {
  Suppliers: [],
  statusSuppliers: "idle", // or 'loading', 'succeeded', 'failed'
  errorSuppliers: null,
};


const fetchSuppliersAsync = createAsyncThunk("Suppliers/fetchSuppliersAsync", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/suppliers");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching Suppliers data";
  }
});

const addSupplierAsync = createAsyncThunk("Suppliers/addSupplierAsync", async (formData) => {
  try {
    const response = await axios.post("http://localhost:8080/api/suppliers", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error adding Supplier";
  }
});

const updateSupplierAsync = createAsyncThunk("Suppliers/updateSupplierAsync", async (formData) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/suppliers/${formData.id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error updating Supplier";
  }
});

const deleteSupplierAsync = createAsyncThunk("Suppliers/deleteSupplierAsync", async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
    return id;
  } catch (error) {
    throw error.response?.data || "Error deleting Supplier";
  }
});


// Create a slice of the Redux store
const Supplierslice = createSlice({
  name: "Suppliers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliersAsync.pending, (state) => {
        state.statusSuppliers = "loading";
      })
      .addCase(fetchSuppliersAsync.fulfilled, (state, action) => {
        state.statusSuppliers = "succeeded";
        state.Suppliers = action.payload;
      })
      .addCase(fetchSuppliersAsync.rejected, (state, action) => {
        state.statusSuppliers = "failed";
        state.errorSuppliers = action.error.message;
      })

      .addCase(addSupplierAsync.pending, (state) => {
        state.statusSuppliers = "loading";
      })
      .addCase(addSupplierAsync.fulfilled, (state, action) => {
        state.statusSuppliers = "succeeded-adding";
        state.Suppliers = [...state.Suppliers, action.payload];
      })
      .addCase(addSupplierAsync.rejected, (state, action) => {
        state.statusSuppliers = "failed-adding";
        state.errorSuppliers = action.error.message;
      })

      .addCase(updateSupplierAsync.pending, (state) => {
        state.statusSuppliers = "loading";
      })
      .addCase(updateSupplierAsync.fulfilled, (state, action) => {
        state.statusSuppliers = "succeeded-updating";
        state.Suppliers = state.Suppliers.map((Supplier) => Supplier.id === action.payload.id ? action.payload : Supplier);
      })
      .addCase(updateSupplierAsync.rejected, (state, action) => {
        state.statusSuppliers = "failed-updating";
        state.errorSuppliers = action.error.message;
      })

      .addCase(deleteSupplierAsync.pending, (state) => {
        state.statusSuppliers = "loading";
      })
      .addCase(deleteSupplierAsync.fulfilled, (state, action) => {
        state.statusSuppliers = "succeeded-deleting";
        state.Suppliers = state.Suppliers.filter((Supplier) => Supplier.id !== action.payload);
      })
      .addCase(deleteSupplierAsync.rejected, (state, action) => {
        state.statusSuppliers = "failed-deleteting";
        state.errorSuppliers = action.error.message;
      })

  },
});

// Export the async thunk for fetching users
export {fetchSuppliersAsync, addSupplierAsync , updateSupplierAsync, deleteSupplierAsync};
// Export the reducer
export default Supplierslice.reducer;