// usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Define an initial state for users
const initialState = {
  medications: [],
  statusMedications: "idle", // or 'loading', 'succeeded', 'failed'
  errorMedications: null,
};


const fetchMedicationsAsync = createAsyncThunk("medications/fetchMedicationsAsync", async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/medications/details");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching medications data";
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
  },
});

// Export the async thunk for fetching users
export {fetchMedicationsAsync};
// Export the reducer
export default medicationSlice.reducer;