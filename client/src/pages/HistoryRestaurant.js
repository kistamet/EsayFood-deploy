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

  const chartInstance = useRef(null);

  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('line');
  const [billsData, setBillsData] = useState([]);
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const [chartLabels, setChartLabels] = useState();

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
  let dayLabels = []
  
  billsData.forEach((item) => {
    if (item.IDrestaurant === getIdrestaurant) {
      if (today === item.createdAt.toString().substring(0, 10)) {
        let timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
        let index = dayLabels.indexOf(timecheckbills);
        totalAmount += 1;
        if (index === -1) {
          dayLabels.push(timecheckbills);
          total.push(item.subTotal);
        } else {
          total[index] += item.subTotal;
        }
      }
    }
    console.log(item.timecheckbills.toString().substring(9, 14))
  });
  const sum = total.reduce((total, num) => {
    return total + num;
  }, 0);
  console.log(total)
  console.log(dayLabels)
  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  useEffect(() => {
    if (dayLabels.length === 0) {
      return;
    }

    const chartConfig = {
      type: chartType,
      data: {
        labels: chartLabels || dayLabels,
        datasets: [{
          label: 'Graph',
          data: total,
          backgroundColor: '#4CEAC4',
          borderColor: '#1BA483',
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
  }, [chartType, dayLabels, total]);
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

    switch (newAlignment) {
      case 'Day':
        setChartLabels(dayLabels);
        break;
      case 'Week':
        setChartLabels(WeekLabels);
        console.log("Week")
        break;
      case 'Month':
        setChartData([1])
        setChartLabels(YearLabels);
        console.log(chartLabels)
        break;
      case 'Year':
        setChartLabels(YearLabels);
        break;
      default:
        break;
    }
  }
  const [WeekLabels, setWeekLabels] = useState([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  const [DayLabels, setDayLabels] = useState([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]);
  const [YearLabels, setYearLabels] = useState([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]);
  return (
    <DefaultLayout>
      {/* <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={() => setChartType('bar')} variant={chartType === 'bar' ? 'contained' : 'outlined'}>Bar Chart</Button>
        <Button onClick={() => setChartType('doughnut')} variant={chartType === 'doughnut' ? 'contained' : 'outlined'}>Doughnut Chart</Button>
      </ButtonGroup> */}

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
            ฿ {isNaN(Number(sum) / Number(totalAmount)) ? "0" : (Number(sum) / Number(totalAmount)).toFixed(2)}
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
          onClick={(event) => {
            handleAlignmentChange(event, 'Day');
            setChartType('line');
          }}
          style={{
            backgroundColor: alignment === 'Day' ? '#EEA414' : '#D9D9D9',
            color: alignment === 'Day' ? '#000000' : '#000000',
          }}
        >
          วันนี้
        </Button>

        <Button
          value="Week"
          onClick={(event) => {
            handleAlignmentChange(event, 'Week');
            setChartType('bar');
          }}
          style={{
            backgroundColor: alignment === 'Week' ? '#EEA414' : '#D9D9D9',
            color: alignment === 'Week' ? '#000000' : '#000000',
          }}
        >
          สัปดาห์นี้
        </Button>
        <Button
          value="Month"
          onClick={(event) => {
            handleAlignmentChange(event, 'Month');
            setChartType('bar');
          }}
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