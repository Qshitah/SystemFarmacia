// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Define an initial state for users
const initialState = {
  medications: [],
  inventory : [],
  statusMedications: "idle", // or 'loading', 'succeeded', 'failed'
  errorMedications: null,
};


const fetchMedicationsAsync = createAsyncThunk("medications/fetchMedicationsAsync", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/medications");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching medications data";
  }
});

const fetchMedicationsInventoryAsync = createAsyncThunk("medications/fetchMedicationsInventoryAsync", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/medications/details");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching medications Inventory data";
  }
});

const addMedicationAsync = createAsyncThunk("medications/addMedicationAsync", async (formData) => {
  try {
    const response = await axios.post("http://localhost:8080/api/medications", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error adding medication";
  }
});

const updateMedicationAsync = createAsyncThunk("medications/updateMedicationAsync", async (formData) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/medications/${formData.id}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error updating medication";
  }
});

const deleteMedicationAsync = createAsyncThunk("medications/deleteMedicationAsync", async (id) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/medications/${id}`);
    return id;
  } catch (error) {
    throw error.response?.data || "Error deleting medication";
  }
});


// Create a slice of the Redux store
const medicationSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicationsAsync.pending, (state) => {
        state.statusMedications = "loading";
      })
      .addCase(fetchMedicationsAsync.fulfilled, (state, action) => {
        state.statusMedications = "succeeded";
        state.medications = action.payload;
      })
      .addCase(fetchMedicationsAsync.rejected, (state, action) => {
        state.statusMedications = "failed";
        state.errorMedications = action.error.message;
      })

      .addCase(addMedicationAsync.pending, (state) => {
        state.statusMedications = "loading";
      })
      .addCase(addMedicationAsync.fulfilled, (state, action) => {
        state.statusMedications = "succeeded-adding";
        state.medications = [...state.medications, action.payload];
      })
      .addCase(addMedicationAsync.rejected, (state, action) => {
        state.statusMedications = "failed-adding";
        state.errorMedications = action.error.message;
      })

      .addCase(updateMedicationAsync.pending, (state) => {
        state.statusMedications = "loading";
      })
      .addCase(updateMedicationAsync.fulfilled, (state, action) => {
        state.statusMedications = "succeeded-updating";
        state.medications = state.medications.map((medication) => medication.id === action.payload.id ? action.payload : medication);
      })
      .addCase(updateMedicationAsync.rejected, (state, action) => {
        state.statusMedications = "failed-updating";
        state.errorMedications = action.error.message;
      })

      .addCase(deleteMedicationAsync.pending, (state) => {
        state.statusMedications = "loading";
      })
      .addCase(deleteMedicationAsync.fulfilled, (state, action) => {
        state.statusMedications = "succeeded-deleting";
        state.medications = state.medications.filter((medication) => medication.id !== action.payload);
      })
      .addCase(deleteMedicationAsync.rejected, (state, action) => {
        state.statusMedications = "failed-deleteting";
        state.errorMedications = action.error.message;
      })

      .addCase(fetchMedicationsInventoryAsync.pending, (state) => {
        state.statusMedications = "loading-inventory";
      })
      .addCase(fetchMedicationsInventoryAsync.fulfilled, (state, action) => {
        state.statusMedications = "succeeded-inventory";
        state.inventory = action.payload;
      })
      .addCase(fetchMedicationsInventoryAsync.rejected, (state, action) => {
        state.statusMedications = "failed-inventory";
        state.errorMedications = action.error.message;
      });
  },
});

// Export the async thunk for fetching users
export {fetchMedicationsAsync, addMedicationAsync , updateMedicationAsync, deleteMedicationAsync, fetchMedicationsInventoryAsync};
// Export the reducer
export default medicationSlice.reducer;