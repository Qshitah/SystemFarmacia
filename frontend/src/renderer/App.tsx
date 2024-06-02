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
              <Route path="medications" element={<MedicationsList />} key="medications" />
              <Route path="medications/add" element={<AddMedication />} key="add-medication" />
              <Route path="medications/edit/:id" element={<EditMedication />} key="edit-medication" />
              <Route path='inventory' element={<Inventory />} key="inventory" />
              <Route path='suppliers' element={<Suppliers />} key="suppliers" />
              <Route path='suppliers/add' element={<AddSupplies />} key="addSupplies" />
              <Route path='supplies' element={<Supplies />} key="supplies" />
            </Route>
          </Routes>
        </Router>
      )}
    </React.Fragment>
  );
}


