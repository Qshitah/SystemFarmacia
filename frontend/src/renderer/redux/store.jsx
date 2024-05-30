import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MedicationSlice from "./MedicationSlice";


const reducer = combineReducers({
    medications: MedicationSlice
})

const store = configureStore({reducer})

export default store