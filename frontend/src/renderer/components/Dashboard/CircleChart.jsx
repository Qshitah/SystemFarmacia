import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useState } from 'react';
export default function CircleChart() {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [data, setDataNew] = useState([]);

    useEffect(() => {
      const token = localStorage.getItem("accessToken");
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:8080/api/ordersMahal/status_counts', {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              }
            });
            setDataNew([response.data.kridi, response.data.cash, response.data.returned, response.data.amana, response.data.aarbon]);
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();
      }, []);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
  
      // Dummy data for example
      const chartData = {
        labels: ['KRIDI', 'CASH', 'RETURNED', 'AMANA', 'AARBON'],
        datasets: [{
          label: 'Order',
          data: data,
          backgroundColor: [
            '#4c84ff', // CASH
            '#80e1c1', // KRIDI
            '#ff7b7b', // AARBON
            '#8061ef', // AMANA
            '#ffa128'  // RETURNED
          ],
          borderColor: [
            '#4c84ff',
            '#80e1c1',
            '#ff7b7b',
            '#8061ef',
            '#ffa128'
          ],
          borderWidth: 1
        }]
      };
  
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      // Create new chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: chartData
      });
  
      // Cleanup on component unmount
      return () => {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
      };
    }, [data]);

  return (
    <div className="col-xl-4 col-md-12 p-b-15">
    <div className="card card-default" style={{boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',borderRadius:'10px'}}>
        <div className="card-header justify-content-center">
            <h2>Aperçu des commandes</h2>
        </div>
        <div className="card-body" >
        <canvas  ref={chartRef} />
        </div>
       
    </div>
</div>
  )
}
