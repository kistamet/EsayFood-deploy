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
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Typography } from '@mui/material';
function HistoryRestaurant() {
  const dispatch = useDispatch()
  //Idrestaurant
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const chartInstance = useRef(null);

  const [dataTotal, setDataToatal] = useState(0)
  const [dataBill, setDataBill] = useState(0)

  const [alignment, setAlignment] = useState();
  const [chartData, setChartData] = useState([]);
  let total = [];
  let totalAmount = 0;
  let dayLabels = []

  //แสดง Day
  const [showDaylabel, setShowDashowDaylabel] = useState(false);

  //ปุ่มเลือก Week
  const [showWeekButtons, setShowWeekButtons] = useState(false);

  //ปุ่มเลือก Month
  const [showMonthButtons, setShowMonthButtons] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  //console.log(currentMonth)

  //ปุ่มเลือก Year
  const [showYearButtons, setShowYearButtons] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  //console.log(currentYear)

  //Type ของ Chart
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('line');

  //ข้อมูล Bill
  const [billsData, setBillsData] = useState([]);

  //ปี เดือน วัน ของตอนนี้
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  //ข้อมูลใน Chart
  const [chartLabels, setChartLabels] = useState(dayLabels);


  //console.log(billsData)


  billsData.forEach((item) => {
    if (item.IDrestaurant === getIdrestaurant) {
      if (dateString === item.daycheckbills.toString().substring(0, 10)) {
        //console.log(item.daycheckbills.toString().substring(5,7));
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
    //setChartData(total)
    //console.log(item.timecheckbills.toString().substring(9, 14))
  });
  const sum = total.reduce((total, num) => {
    return total + num;
  }, 0);

  // console.log(total)
  // console.log(chartData)
  const getAllBills = useCallback(() => {

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

  useEffect(() => {
    getAllBills();
  }, [getAllBills]);

  useEffect(() => {
    console.log("day is" + dayLabels.length)
    const chartConfig = {
      type: chartType,
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Sales',
          data: chartData,
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
  }, [chartType, dayLabels, chartData]);

  const handleAlignmentChange = (event, newAlignment) => {
    setAlignment(newAlignment);

    switch (newAlignment) {
      case 'Day':
        setChartLabels(dayLabels);
        setChartData(total);
        setDataToatal(sum);
        setDataBill(totalAmount);
        setShowDashowDaylabel(true)
        setShowMonthButtons(false);
        setShowYearButtons(false);
        setShowWeekButtons(false)
        break;
      case 'Week':
        setChartLabels(dayOfWeekLabels);
        setChartData(dayOfWeekTotals);
        setDataToatal(totalWeek);
        setDataBill(numberOfBillsWeek);
        setShowDashowDaylabel(false)
        setShowMonthButtons(false);
        setShowYearButtons(false);
        setShowWeekButtons(true)
        break;
      case 'Month':
        setChartLabels(dayOfMonthLabels);
        setChartData(dayOfMonthTotals);
        setDataToatal(totalMonth);
        setDataBill(numberOfBillsMonth);
        setShowDashowDaylabel(false)
        setShowMonthButtons(true);
        setShowYearButtons(false);
        setShowWeekButtons(false)
        break;
      case 'Year':
        setChartLabels(YearLabels);
        setDataBill(numberOfBillsYear);
        setChartData(yearData.map((month) => month.total));
        setDataToatal(totalYear);
        setShowDashowDaylabel(false)
        setShowMonthButtons(false);
        setShowYearButtons(true);
        setShowWeekButtons(false)
        break;
      default:
        break;
    }
  };
  const dayOfWeekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfMonthLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

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

  //การหายอดของแต่ละวันใน 1 สัปดาห์
  const [weekStartDate, setWeekStartDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()));
  const weekEndDate = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 6);

  if (today > weekEndDate) {
    weekStartDate.setDate(weekStartDate.getDate() + 7);
  }

  const groupedDataByDayOfWeek = billsData.reduce((acc, item) => {
    if (item.IDrestaurant === getIdrestaurant) {
      const itemDate = new Date(item.daycheckbills);
      if (itemDate >= weekStartDate && itemDate <= weekEndDate) {
        const dayOfWeek = itemDate.getDay();
        const timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
        const total = item.subTotal;
        if (!acc[dayOfWeek]) {
          acc[dayOfWeek] = { timecheckbills: [timecheckbills], total: [total] };
        } else {
          const index = acc[dayOfWeek].timecheckbills.indexOf(timecheckbills);
          if (index === -1) {
            acc[dayOfWeek].timecheckbills.push(timecheckbills);
            acc[dayOfWeek].total.push(total);
          } else {
            acc[dayOfWeek].total[index] += total;
          }
        }
      }
    }
    return acc;
  }, {});

  const dayOfWeekTotals = Array(7).fill(0);

  Object.keys(groupedDataByDayOfWeek).forEach((dayOfWeek) => {
    const index = parseInt(dayOfWeek);
    dayOfWeekTotals[index] = groupedDataByDayOfWeek[dayOfWeek].total.reduce((acc, t) => acc + t, 0);
  });

  //จำนวนบิลของสัปดาห์
  const numberOfBillsWeek = Object.keys(groupedDataByDayOfWeek).reduce((acc, dayOfWeek) => {
    acc += groupedDataByDayOfWeek[dayOfWeek].total.length;
    return acc;
  }, 0);

  //การหายอดของแต่ละวันใน 1 เดือน
  const filteredData = billsData.filter(item => {
    const itemDate = new Date(item.daycheckbills);
    return itemDate.getFullYear() === currentMonth.getFullYear() && itemDate.getMonth() === currentMonth.getMonth();
  });


  const groupedDataByDayOfMonth = filteredData.reduce((acc, item) => {
    if (item.IDrestaurant === getIdrestaurant && month === item.daycheckbills.toString().substring(5, 7)) {
      const dayOfMonth = new Date(item.daycheckbills).getDate();
      const timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
      const total = item.subTotal;

      if (!acc[dayOfMonth]) {
        acc[dayOfMonth] = { timecheckbills: [timecheckbills], total: [total] };
      } else {
        const index = acc[dayOfMonth].timecheckbills.indexOf(timecheckbills);
        if (index === -1) {
          acc[dayOfMonth].timecheckbills.push(timecheckbills);
          acc[dayOfMonth].total.push(total);
        } else {
          acc[dayOfMonth].total[index] += total;
        }
      }
    }

    return acc;
  }, {});

  const dayOfMonthTotals = Array(31).fill(0);

  Object.keys(groupedDataByDayOfMonth).forEach((dayOfMonth) => {
    const index = parseInt(dayOfMonth) - 1;
    dayOfMonthTotals[index] = groupedDataByDayOfMonth[dayOfMonth].total.reduce((acc, t) => acc + t, 0);
  });

  //จำนวนบิลของเดือน
  const numberOfBillsMonth = Object.keys(groupedDataByDayOfMonth).reduce((acc, dayOfMonth) => {
    acc += groupedDataByDayOfMonth[dayOfMonth].total.length;
    return acc;
  }, 0);

  console.log("Month" +numberOfBillsMonth)
  //console.log(numberOfBillsMonth)

  //การหายอดของแต่ละเดือนใน 1 ปี
  const yearData = YearLabels.map((month) => ({ label: month, total: 0 }));


  const groupedDataByMonth = billsData.reduce((acc, item) => {
    if (item.IDrestaurant === getIdrestaurant && String(year) === item.daycheckbills.toString().substring(0, 4)) {

      const monthIndex = new Date(item.daycheckbills).getMonth();
      const timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
      const total = item.subTotal;

      if (!acc[monthIndex]) {
        acc[monthIndex] = { timecheckbills: [timecheckbills], total: [total] };
      } else {
        const index = acc[monthIndex].timecheckbills.indexOf(timecheckbills);
        if (index === -1) {
          acc[monthIndex].timecheckbills.push(timecheckbills);
          acc[monthIndex].total.push(total);
        } else {
          acc[monthIndex].total[index] += total;
        }
      }
    }

    return acc;
  }, {});

  Object.keys(groupedDataByMonth).forEach((monthIndex) => {
    const index = parseInt(monthIndex);
    yearData[index].total = groupedDataByMonth[monthIndex].total.reduce((acc, t) => acc + t, 0);
  });

  const numberOfBillsYear= Object.keys(groupedDataByMonth).reduce((acc, monthIndex) => {
    acc += groupedDataByMonth[monthIndex].total.length;
    return acc;
  }, 0);
  console.log("Year" +numberOfBillsYear)
  
  const totalWeek = Object.values(dayOfWeekTotals).reduce((acc, val) => acc + val, 0);
  const totalMonth = Object.values(dayOfMonthTotals).reduce((acc, val) => acc + val, 0);
  const totalYear = yearData.reduce((acc, month) => acc + month.total, 0);

  // console.log(totalWeek); // 280
  // console.log(totalMonth); // 280
  // console.log(totalYear); // total amount for the entire year

  //console.log(currentMonth.toLocaleString('default', { month: 'long' }))


  // const handlePrevWeek = () => {
  //   const newWeekStartDate = new Date(weekStartDate);
  //   newWeekStartDate.setDate(newWeekStartDate.getDate() - 7);
  //   setWeekStartDate(newWeekStartDate);
  // };

  // const handleNextWeek = () => {
  //   const newWeekStartDate = new Date(weekStartDate);
  //   newWeekStartDate.setDate(newWeekStartDate.getDate() + 7);
  //   setWeekStartDate(newWeekStartDate);
  // };

  //Month
  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const filteredData = billsData.filter(item => {
      const itemMonth = new Date(item.daycheckbills).getMonth();
      const itemYear = new Date(item.daycheckbills).getFullYear();
      return itemMonth === newDate.getMonth() && itemYear === newDate.getFullYear();
    });
    const groupedDataByDayOfMonth = filteredData.reduce((acc, item) => {
      console.log(item)
      if (item.IDrestaurant === getIdrestaurant) {
        const dayOfMonth = new Date(item.daycheckbills).getDate();
        const timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
        const total = item.subTotal;

        if (!acc[dayOfMonth]) {
          acc[dayOfMonth] = { timecheckbills: [timecheckbills], total: [total] };
        } else {
          const index = acc[dayOfMonth].timecheckbills.indexOf(timecheckbills);
          if (index === -1) {
            acc[dayOfMonth].timecheckbills.push(timecheckbills);
            acc[dayOfMonth].total.push(total);
          } else {
            acc[dayOfMonth].total[index] += total;
          }
        }
      }

      return acc;
    }, {});

    const dayOfMonthTotals = Array(31).fill(0);

    Object.keys(groupedDataByDayOfMonth).forEach((dayOfMonth) => {
      const index = parseInt(dayOfMonth) - 1;
      dayOfMonthTotals[index] = groupedDataByDayOfMonth[dayOfMonth].total.reduce((acc, t) => acc + t, 0);
    });
    const numberOfBillsMonth = Object.keys(groupedDataByDayOfMonth).reduce((acc, dayOfMonth) => {
      acc += groupedDataByDayOfMonth[dayOfMonth].total.length;
      return acc;
    }, 0);
    const totalMonth = Object.values(dayOfMonthTotals).reduce((acc, val) => acc + val, 0);
    setDataToatal(totalMonth);
    setDataBill(numberOfBillsMonth);
    setCurrentMonth(newDate);
    setCurrentYear(newDate.getFullYear());
    setChartLabels(getLabelsForMonth(newDate));
    setChartData(dayOfMonthTotals);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const filteredData = billsData.filter(item => {
      const itemMonth = new Date(item.daycheckbills).getMonth();
      const itemYear = new Date(item.daycheckbills).getFullYear();
      return itemMonth === newDate.getMonth() && itemYear === newDate.getFullYear();
    });
    const groupedDataByDayOfMonth = filteredData.reduce((acc, item) => {
      if (item.IDrestaurant === getIdrestaurant) {
        const dayOfMonth = new Date(item.daycheckbills).getDate();
        const timecheckbills = parseFloat(item.timecheckbills).toFixed(2);
        const total = item.subTotal;

        if (!acc[dayOfMonth]) {
          acc[dayOfMonth] = { timecheckbills: [timecheckbills], total: [total] };
        } else {
          const index = acc[dayOfMonth].timecheckbills.indexOf(timecheckbills);
          if (index === -1) {
            acc[dayOfMonth].timecheckbills.push(timecheckbills);
            acc[dayOfMonth].total.push(total);
          } else {
            acc[dayOfMonth].total[index] += total;
          }
        }
      }

      return acc;
    }, {});

    const dayOfMonthTotals = Array(31).fill(0);

    Object.keys(groupedDataByDayOfMonth).forEach((dayOfMonth) => {
      const index = parseInt(dayOfMonth) - 1;
      dayOfMonthTotals[index] = groupedDataByDayOfMonth[dayOfMonth].total.reduce((acc, t) => acc + t, 0);
    });
    const numberOfBillsMonth = Object.keys(groupedDataByDayOfMonth).reduce((acc, dayOfMonth) => {
      acc += groupedDataByDayOfMonth[dayOfMonth].total.length;
      return acc;
    }, 0);
    const totalMonth = Object.values(dayOfMonthTotals).reduce((acc, val) => acc + val, 0);
    setDataToatal(totalMonth);
    setDataBill(numberOfBillsMonth);
    setCurrentMonth(newDate);
    setCurrentYear(newDate.getFullYear());
    setChartLabels(getLabelsForMonth(newDate));
    setChartData(dayOfMonthTotals);
  };

  const getLabelsForMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const numDays = new Date(year, month, 0).getDate();
    const labels = Array.from({ length: numDays }, (_, i) => (i + 1).toString());
    return labels;
  }

  //Year
  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);

    const yearData = YearLabels.map((month) => ({ label: month, total: 0 }));

    billsData.forEach((item) => {
      if (item.IDrestaurant === getIdrestaurant && String(currentYear - 1) === item.daycheckbills.toString().substring(0, 4)) {
        const monthIndex = new Date(item.daycheckbills).getMonth();
        const total = item.subTotal;
        yearData[monthIndex].total += total;
      }
    });
    const numberOfBillsYear= Object.keys(groupedDataByMonth).reduce((acc, monthIndex) => {
      acc += groupedDataByMonth[monthIndex].total.length;
      return acc;
    }, 0);
    const totalYear = yearData.reduce((acc, month) => acc + month.total, 0);
    setDataBill(numberOfBillsYear);
    setDataToatal(totalYear);
    setChartData(yearData.map((month) => month.total));
  };
  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
    const yearData = YearLabels.map((month) => ({ label: month, total: 0 }));
    billsData.forEach((item) => {
      if (item.IDrestaurant === getIdrestaurant && String(currentYear + 1) === item.daycheckbills.toString().substring(0, 4)) {
        const monthIndex = new Date(item.daycheckbills).getMonth();
        const total = item.subTotal;
        yearData[monthIndex].total += total;
      }
    });
    const numberOfBillsYear= Object.keys(groupedDataByMonth).reduce((acc, monthIndex) => {
      acc += groupedDataByMonth[monthIndex].total.length;
      return acc;
    }, 0);
    const totalYear = yearData.reduce((acc, month) => acc + month.total, 0);
    setDataBill(numberOfBillsYear);
    setDataToatal(totalYear);
    setChartData(yearData.map((month) => month.total));
  };
  const monthFormatter = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
  });
  
  const yearFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
  });
  return (
    <DefaultLayout>

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
          onClick={(event) => {
            handleAlignmentChange(event, 'Year');
            setChartType('bar');
          }}
          style={{
            backgroundColor: alignment === 'Year' ? '#EEA414' : '#D9D9D9',
            color: alignment === 'Year' ? '#000000' : '#000000',
          }}
        >
          ปีนี้
        </Button>

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
            ฿ {dataTotal}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            จำนวนบิล
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }} >
            ฿ {dataBill}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            เฉลี่ยต่อบิล
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }}>
            ฿ {isNaN(Number(dataTotal) / Number(dataBill)) ? "0" : (Number(dataTotal) / Number(dataBill)).toFixed(2)}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            เงินสด
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }} >
            ฿ {sum}
          </div>
        </Paper>
        <Paper sx={{ bgcolor: '#D9D9D9', textAlign: 'left', color: '#1DA01A', fontSize: '20px' }} >
          <div style={{ fontSize: '20px', marginLeft: '10px', fontWeight: 'bold' }} >
            โอน
          </div>
          <div style={{ fontSize: '35px', marginLeft: '10px', textAlign: 'left' }} >
            ฿ {sum}
          </div>
        </Paper>
      </Box>
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        {showDaylabel && (
            <>
              {/* <Button onClick={handlePrevWeek}>
                <ArrowBackIosIcon />
              </Button> */}
<Typography variant="h6">
{today.getDate()} {monthFormatter.format(today)} {yearFormatter.format(today)}
</Typography>
              {/* <Button onClick={handleNextWeek}>
                <ArrowForwardIosIcon />
              </Button> */}
            </>
          )}
          {showWeekButtons && (
            <>
              {/* <Button onClick={handlePrevWeek}>
                <ArrowBackIosIcon />
              </Button> */}
              <Typography variant="h6">
                {weekStartDate.toLocaleDateString('th-TH', {
                  month: 'long',
                  day: 'numeric',
                })} - {weekEndDate.toLocaleDateString('th-TH', {
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>
              {/* <Button onClick={handleNextWeek}>
                <ArrowForwardIosIcon />
              </Button> */}
            </>
          )}
          {showMonthButtons && (
            <>
              <Button onClick={handlePrevMonth}>
                <ArrowBackIosIcon />
              </Button>
              <Typography variant="h6">
                {currentMonth.toLocaleString('th-TH', {
                  month: 'long',
                })}{' '}{currentYear}
              </Typography>
              <Button onClick={handleNextMonth}>
                <ArrowForwardIosIcon />
              </Button>
            </>
          )}
          {showYearButtons && (
            <>
              <Button onClick={handlePrevYear}>
                <ArrowBackIosIcon />
              </Button>
              <Typography variant="h6">{currentYear}</Typography>
              <Button onClick={handleNextYear}>
                <ArrowForwardIosIcon />
              </Button>
            </>
          )}
        </div>
        <canvas ref={chartRef} />
      </div>

    </DefaultLayout>
  );
}

export default HistoryRestaurant;