import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import DefaultLayout from '../components/DefaultLayout';
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
import axios from "axios";

function History() {
  const dispatch = useDispatch()
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [billsData, setBillsData] = useState([]);
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const [chartType, setChartType] = useState('line');
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  const getAllBills = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    console.log(today)
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-bills")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setBillsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  let total = [];
  let quantity = "";
  let totalAmount = 0;
  let dataOrdertable = [];
  let getTimetable = "";
  let temp = 0;
  let chartLabels2 = [];

  billsData.forEach((item) => {
    if (item.IDrestaurant === getIdrestaurant) {
      if(today === item.createdAt.toString().substring(0, 10)){
        let timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
        let index = chartLabels2.indexOf(timecheckbills);
        totalAmount += 1;
        if (index === -1) {
          chartLabels2.push(timecheckbills);
          total.push(item.subTotal);
        } else {
          total[index] += item.subTotal;
        }
      }
    }
  });

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  useEffect(() => {
    if (chartLabels2.length === 0) {
      return;
    }

    const chartConfig = {
      type: chartType,
      data: {
        labels: chartLabels2,
        datasets: [{
          label: 'Graph',
          data: total,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      }
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      }
    };

    if (chartInstance.current !== null) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, chartConfig);
    return () => {
        if (chartInstance.current !== null) {
            chartInstance.current.destroy();
        }
    }
}, [chartType, chartLabels2, total]); // add chartType, chartLabels2, and total as dependencies of this effect

const handleChartTypeChange = () => {
    setChartType(chartType === 'line' ? 'bar' : 'line');
}

return (
    <DefaultLayout>
        <canvas ref={chartRef}></canvas>
        <button onClick={handleChartTypeChange}>Toggle Chart Type</button>
    </DefaultLayout>
);
}

export default History;
