import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import DefaultLayout from '../components/DefaultLayout';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
import axios from "axios";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
function HistoryRestaurant() {
  const dispatch = useDispatch()
  //Idrestaurant
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('bar');
  const [billsData, setBillsData] = useState([]);

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

  //console.log(billsData)

  let total = [];
  let quantity = "";
  let totalAmount = 0;
  let dataOrdertable = [];
  let getTimetable = "";
  let temp = 0;
  billsData.forEach((item) => {
    if (item.IDrestaurant === getIdrestaurant) {
      total.push(item.subTotal)
      totalAmount += 1
      //console.log(totalAmount)
      //quantity = Number(quantity) + 1
      //dataTimetable.push(item.time.substring(0, 5))
      //dataTimetable.sort()
      //getTimetable = dataTimetable[0]
      //temp = temp + (item.price * item.quantity)
      //dataOrdertable.push(item)
      //console.log(totalAmount)

    }
  })
  const sum = total.reduce((total, num) => {
    return total + num;
  }, 0);
 // console.log(sum)
 // console.log(totalAmount)
  useEffect(() => {
    getAllBills()
    if (chartRef && chartRef.current) {
      const myChartRef = chartRef.current.getContext('2d');
      console.log(chartRef.current)
      console.log(chartRef)
      const chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: 'Sales',
            data: total,
            backgroundColor: '#4CEAC4',
            borderColor: '#1BA483',
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: chartType === 'bar' ? ' Bar Chart' : ' Doughnut Chart',
          },
        },
      };

      const chart = new Chart(myChartRef, {
        type: chartType,
        data: chartData,
        options: chartOptions,
      });

      return () => {
        chart.destroy();
      };
    }
  }, [chartType]);
  const [alignment, setAlignment] = useState('Day');
  const [chartData, setChartData] = useState([65, 59, 80, 81, 56, 55, 40]);
  const updateChartLabels = (labels) => {
    setChartLabels(labels);
    const newChartData = [...chartData];
    newChartData.length = labels.length;
    setChartData(newChartData);
  };
  const handleAlignmentChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    };
  const [chartLabels, setChartLabels] = useState([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
  ]);

  return (
    <DefaultLayout>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => setChartType('bar')} variant={chartType === 'bar' ? 'contained' : 'outlined'}>Bar Chart</Button>
        <Button onClick={() => setChartType('doughnut')} variant={chartType === 'doughnut' ? 'contained' : 'outlined'}>Doughnut Chart</Button>
      </ButtonGroup>
      
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 200,
            height: 80,
          },
        }}
      >
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            ยอดรวม
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }} >
          ฿ {sum}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            จำนวนบิล
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }} >
          ฿ {totalAmount}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            เฉลี่ยต่อบิล
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }}>
          ฿ {isNaN(Number(sum) / Number(totalAmount)) ? "0" : Number(sum) / Number(totalAmount)}
          </div>
        </Paper>
      </Box>
      <div>
        <canvas ref={chartRef} />
      </div>
      <ButtonGroup
      color="primary"
      aria-label="text alignment"
      variant="contained"
      size="large"
    >
      <Button
        value="Day"
        onClick={(event) => handleAlignmentChange(event, 'Day')}
        style={{
          backgroundColor: alignment === 'Day' ? '#EEA414' : '#D9D9D9',
          color: alignment === 'Day' ? '#000000' : '#000000',
        }}
      >
        วันนี้
      </Button>
      <Button
        value="Week"
        onClick={(event) => handleAlignmentChange(event, 'Week')}
        style={{
          backgroundColor: alignment === 'Week' ? '#EEA414' : '#D9D9D9',
          color: alignment === 'Week' ? '#000000' : '#000000',
        }}
      >
        สัปดาห์นี้
      </Button>
      <Button
        value="Month"
        onClick={(event) => handleAlignmentChange(event, 'Month')}
        style={{
          backgroundColor: alignment === 'Month' ? '#EEA414' : '#D9D9D9',
          color: alignment === 'Month' ? '#000000' : '#000000',
        }}
      >
        เดือนนี้
      </Button>
      <Button
        value="Year"
        onClick={(event) => handleAlignmentChange(event, 'Year')}
        style={{
          backgroundColor: alignment === 'Year' ? '#EEA414' : '#D9D9D9',
          color: alignment === 'Year' ? '#000000' : '#000000',
        }}
      >
        ปีนี้
      </Button>
    </ButtonGroup>
    </DefaultLayout>
  );
}

export default HistoryRestaurant;