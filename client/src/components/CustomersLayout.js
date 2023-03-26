import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, Badge, Box, } from "@mui/material";
import { TableChartOutlined, ArrowBack, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IconButton } from '@mui/material';
import "../resourses/CustomersLayout.css";
import { Modal } from "@mui/material";
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
import axios from "axios";
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import Avatar from '@mui/material/Avatar';
import { green, pink } from '@mui/material/colors';

const CustomersLayout = (props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const queryParams = new URLSearchParams(search);
  const tableID = queryParams.get("tableID");
  const uniqueTableID = queryParams.get("uniqueTableID");
  const [restaurantId, setRestaurantId] = useState(null);
  const location = useLocation();

  const dispatch = useDispatch()
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const [openModal, setOpenModal] = useState(false);

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const { count } = useSelector((state) => state.rootReducer);

  const [table, setTable] = useState([]);

  const getAllTable = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/tables/get-all-table")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setTable(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
    dispatch({ type: "hideLoading" });
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("restaurantId");
    setRestaurantId(id);
  }, [location.search]);

  useEffect(() => {
    getAllTable();
  }, []);
  const Notifunction = (type) => {
    if (type === 'callstaff') {
      const callStaffTables = table.filter(item => item.table === tableID && item.IDrestaurant === getIdrestaurant);
      if (callStaffTables.length > 0) {
        dispatch({ type: 'INCREMENT_COUNT' });
        localStorage.setItem('count', count + 1);
        callStaffTables.forEach(item => {
          axios
            .post("/api/tables/update-table", { tableId: item._id, status: "callstaff" })
            .then(() => { })
            .catch(() => { });
        });
      }
      getAllTable();
    } else if (type === 'checkbills') {
      const callStaffTables = table.filter(item => item.table === tableID && item.IDrestaurant === getIdrestaurant);
      if (callStaffTables.length > 0) {
        dispatch({ type: 'INCREMENT_COUNT' });
        localStorage.setItem('count', count + 1);
        callStaffTables.forEach(item => {
          axios
            .post("/api/tables/update-table", { tableId: item._id, status: "checkbills" })
            .then(() => { })
            .catch(() => { });
        });
      }
      getAllTable();
    }
  };

  const handleBackClick = () => {
    dispatch({ type: "showLoading" });
    if (location.pathname === "/CustomerCartpage") {
      const newLink = `/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
      navigate(newLink);
    } else if (location.pathname === "/CustomerBills") {
      const newLink = `/CustomerCartpage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
      navigate(newLink);
    } else if (location.pathname === "/CustomerOrder") {
      const newLink = `/CustomerCartpage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
      navigate(newLink);
    } else {
      window.history.back();
    }
  }


  let title;
  if (location.pathname === "/CustomerBills") {
    title = "ชำระเงิน";
  } else if (location.pathname === "/CustomerCartpage") {
    title = "ตะกร้าสินค้า";
  }
  return (

    <Grid container spacing={5}>
      <Grid item sx={{width: "100%",}}>
        <Grid
          container
          sx={{
            padding: "20px",
            backgroundColor: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Grid item>
            <Button
              className="back-btn"
              variant="contained"
              startIcon={<ArrowBack sx={{ fontSize: 10 }} />}
              onClick={handleBackClick}
            >
            </Button>
          </Grid>

          <Grid item xs="auto">
            <Typography variant="h6" className="title">
              {title}
            </Typography>
          </Grid>

          <Grid item xs="auto" className="tableicon">
            <TableRestaurantIcon />
          </Grid>

          <Grid item xs="auto" className="table-id">
            <Typography variant="h6">{tableID}</Typography>
          </Grid>

          <Grid item sx={{ position: "relative" }}>
            <Avatar sx={{ bgcolor: pink[500], marginLeft: "20px" }}>
              <Badge onClick={handleOpenModal}>
                <Badge >
                  <Notifications sx={{ fontSize: "30px !important", color: "white !important" }} />
                </Badge>
              </Badge>
            </Avatar>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  padding: "20px",
                  outline: "none",
                  boxShadow: "0px 3px 20px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  textAlign: "center",
                  minWidth: "250px"
                }}
              >
                <Typography variant="h6" gutterBottom>
                  เลือกรายการที่ต้องการ
                </Typography >
                <Button onClick={() => Notifunction('callstaff')} className="callstaff-btn">เรียกพนักงาน</Button>
                <Button onClick={() => Notifunction('checkbills')} className="checkbills-btn">ชำระเงิน</Button>
              </Box>
            </Modal>

          </Grid>
        </Grid>
      </Grid>
      <Grid item flexGrow={1}>
        <Grid

          sx={{ padding: "20px", backgroundColor: "#fff", minHeight: "80vh" }}
        >
          {props.children}
        </Grid>
      </Grid>
    </Grid>
  );

};

export default CustomersLayout;
