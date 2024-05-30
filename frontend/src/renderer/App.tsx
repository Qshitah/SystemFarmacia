import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import React from "react";
import ReactLoading from 'react-loading';
import { useEffect } from "react";
import { useState } from "react";
import Home from "./components/Home";
import MedicationsList from "./components/Medications/MedicationsList";
import AddMedication from './components/Medications/AddMedication';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [admin,setAdmin] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });
  return (
    <React.Fragment>
    {loading ? (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ReactLoading type={"spinningBubbles"} color={"black"} height={50} width={50} />
      </div>
    ) : (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} children={
          [<Route path="medications" element={<MedicationsList />} />,
          <Route path="medications/add" element={<AddMedication />} />]
          
        } />
      </Routes>
    </Router>
    )}
  </React.Fragment>
   
  );
}
