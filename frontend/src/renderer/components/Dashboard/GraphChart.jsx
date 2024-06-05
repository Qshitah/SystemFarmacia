import axios from 'axios';
import Chart from 'chart.js/auto';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function GraphChart() {

    const [chartData, setChartData] = useState([]);

    function formatDate(dateString) {
        // Parse the date string into a Date object
        const date = new Date(dateString);
      
        // Get the month and year
        const month = date.getMonth() + 1; // getMonth() returns 0-based month, so add 1
        const year = date.getFullYear();
      
        // Format the month to always be two digits
        const formattedMonth = month < 10 ? `0${month}` : month;
      
        // Return the formatted string
        return `${formattedMonth}-${year}`;
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders/total-month');
                setChartData(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartData.length === 0) return;

        const ctx = chartRef.current.getContext('2d');

        // Transform the fetched data to match the chart format
        const labels = chartData.map(item => formatDate(item.monthYear));
        const dataValues = chartData.map(item => item.totalAmount);

        const data = {
            labels: labels,
            datasets: [{
                label: 'Ventes',
                data: dataValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        // Destroy existing chart instance if it exists
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Create new chart instance
        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Cleanup on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData]);
    return (
        <div className="col-xl-12 col-md-12 p-b-15">
            <div id="user-acquisition" className="card card-default" style={{ boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px', borderRadius: '10px' }}>
                <div className="card-header">
                    <h2>Rapport de ventes</h2>
                </div>
                <div className="card-body" >
                    <div className="tab-content pt-4" id="salesReport">
                        <div className="tab-pane fade show active" id="source-medium" role="tabpanel">
                            <div className="mb-6" style={{ maxHeight: "247px", maxWidth: "100%", width: "100%" }}>
                                <canvas ref={chartRef}  className='' style={{ maxHeight: "247px", maxWidth: "100%", width: "100%" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
