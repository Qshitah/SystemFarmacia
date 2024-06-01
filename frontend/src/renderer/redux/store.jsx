import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MedicationSlice from "./MedicationSlice";
import SupplierSlice from "./SupplierSlice";
import OrderSlice from "./OrderSlice";
import SupplySlice from "./SupplySlice";


const reducer = combineReducers({
    medications: MedicationSlice,
    suppliers: SupplierSlice,
    orders:OrderSlice,
    supplies: SupplySlice
})

const store = configureStore({reducer})

export default store