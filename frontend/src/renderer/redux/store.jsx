import { combineReducers, configureStore } from "@reduxjs/toolkit";
import MedicationSlice from "./MedicationSlice";
import SupplierSlice from "./SupplierSlice";
import SupplySlice from "./SupplySlice";


const reducer = combineReducers({
    medications: MedicationSlice,
    suppliers: SupplierSlice,
    supplies: SupplySlice
})

const store = configureStore({reducer})

export default store