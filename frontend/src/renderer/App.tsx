import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import React from "react";
import ReactLoading from 'react-loading';
import { useEffect } from "react";
import { useState } from "react";
import Home from "./components/Home";
import MedicationsList from "./components/Medications/MedicationsList";
import AddMedication from './components/Medications/AddMedication';
import EditMedication from './components/Medications/EditMedication';
import Inventory from './components/Inventory/Inventory';
import Suppliers from './components/Suppliers/Suppliers';
import AddSupplies from './components/Suppliers/AddSupplies';
import Supplies from './components/Suppliers/Supplies';
import AllOrder from './components/Orders/AllOrders';
import AddOrder from './components/Orders/AddOrder';
import OrderDetail from './components/Orders/OrderDetail';
import Dashboard from './components/Dashboard/Dashboard';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ReactLoading type={"spinningBubbles"} color={"black"} height={50} width={50} />
        </div>
      ) : (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} key="home">
              <Route index element={<Dashboard />} key="home" />
              <Route path="medicaments" element={<MedicationsList />} key="medicaments" />
              <Route path="medicaments/add" element={<AddMedication />} key="add-medicament" />
              <Route path="medicaments/edit/:id" element={<EditMedication />} key="edit-medicament" />
              <Route path='inventaire' element={<Inventory />} key="inventaire" />
              <Route path='fournisseurs' element={<Suppliers />} key="fournisseurs" />
              <Route path='fournisseurs/add' element={<AddSupplies />} key="addfournisseurs" />
              <Route path='fournisseurs/fournitures' element={<Supplies />} key="fournitures" />
              <Route path='commandes' element={<AllOrder />} key="commandes" />
              <Route path='commandes/add' element={<AddOrder />} key="commandes/add" />
              <Route path='commandes/:id' element={<OrderDetail />} key="commandes/id" />
            </Route>
          </Routes>
        </Router>
      )}
    </React.Fragment>
  );
}


