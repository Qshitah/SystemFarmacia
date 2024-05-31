import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MedicationSlice from "./MedicationSlice";
import SupplierSlice from "./SupplierSlice";


const reducer = combineReducers({
    medications: MedicationSlice,
    suppliers: SupplierSlice
})

const store = configureStore({reducer})

export default store