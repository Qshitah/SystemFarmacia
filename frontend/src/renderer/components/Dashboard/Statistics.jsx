import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedicationsAsync } from '../../redux/MedicationSlice';
import { useNavigate } from 'react-router';

export default function Statistics() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0].substring(0, 7),
  );

  const { medications, statusMedications, errorMedications } = useSelector(
    (state) => state.medications,
  );

  const [expiredMedications, setExpiredMedications] = useState([]);

  const [checkInventory, setCheckInventory] = useState("");

  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (statusMedications === 'failed') {
      console.log(errorMedications);
    } else if (statusMedications !== 'succeeded') {
      dispatch(fetchMedicationsAsync());
    }

    const fetchTotal = async () => {
      const [year, month] = date.split('-');
      await axios
        .get('http://localhost:8080/api/orders/total'+`?month=${month}&year=${year}`)
        .then((response) => {
          setTotal(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchTotal();
  }, [date]);

  useEffect(() => {
    const fetchExpiredMedications = async () => {
      await axios
        .get('http://localhost:8080/api/medications/expired-medications')
        .then((response) => {
          setExpiredMedications(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchExpiredMedications();
  }, []);

  useEffect(() => {
    const fetchCheckInventory = async () => {
      await axios
        .get('http://localhost:8080/api/inventories/inventory-status')
        .then((response) => {
          setCheckInventory(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchCheckInventory();
  }, []);

  return (
    <div className="row" style={{ color: 'BLACK' }}>

<div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
        <div className="card card-mini dash-card card-1">
          <div
            className="card-body"
            style={{
              boxShadow:
                'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              borderRadius: '5px',
            }}
          >
            <div
              className="mdi mdi-security"
              style={{ fontSize: '60px', textAlign: 'center', color: checkInventory === "Bien" ? "green" : checkInventory === "" ? "black" : "red" }}
            ></div>
            <div style={{ textAlign: 'center' }}>
              <h2 className="mb-1" onClick={() => {
                navigate('/inventaire')
              }}  style={{ color: checkInventory === "Bien" ? "green" : checkInventory === "" ? "black" : "red", cursor: 'pointer' }}>
                {checkInventory}
              </h2>
              <p>Statut de l'inventaire</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
        <div className="card card-mini dash-card card-1">
          <div
            className="card-body"
            style={{
              boxShadow:
                'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              borderRadius: '5px',
            }}
          >
            <div
              className="mdi mdi-medical-bag"
              style={{ fontSize: '60px', textAlign: 'center' }}
            ></div>
            <div style={{ textAlign: 'center' }}>
              <h2 className="mb-1" style={{ color: 'black' }}>
                {medications.length}
              </h2>
              <p>Médicaments Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
        <div className="card card-mini dash-card card-1">
          <div
            className="card-body"
            style={{
              boxShadow:
                'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              borderRadius: '5px',
            }}
          >
            <div
              className="mdi mdi-cash-multiple"
              style={{ fontSize: '60px', textAlign: 'center' }}
            ></div>
            <div style={{ textAlign: 'center' }}>
              <h2 className="mb-1" style={{ color: 'black' }}>
                {total} Dh
              </h2>
              <div style={{   display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <p>Revenu:</p>

                <input
                  type="month"
                  style={{ width: '150px',  }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="col-xl-3 col-sm-6 p-b-15 lbl-card">
        <div className="card card-mini dash-card card-1">
          <div
            className="card-body"
            style={{
              boxShadow:
                'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
              borderRadius: '5px',
            }}
          >
            <div
              className="mdi mdi-alert"
              style={{ fontSize: '60px', textAlign: 'center', color: 'red' }}
            ></div>
            <div style={{ textAlign: 'center' }}>
              <h2 className="mb-1" style={{ color: 'black' }}>
                {expiredMedications.length}
              </h2>
              <p>Médicaments Expirés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
