import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MedicationSlice from "./MedicationSlice";
import SupplierSlice from "./SupplierSlice";
import OrderSlice from "./OrderSlice";


const reducer = combineReducers({
    medications: MedicationSlice,
    suppliers: SupplierSlice,
    orders:OrderSlice
})

const store = configureStore({reducer})

export default store