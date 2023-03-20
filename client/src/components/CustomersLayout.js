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

const CustomersLayout = (props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const queryParams = new URLSearchParams(search);
  const tableID = queryParams.get("tableID");
  const dispatch = useDispatch()
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const [openModal, setOpenModal] = useState(false);
  const [callstaffCount, setCallstaffCount] = useState(0);
  const [checkbillsCount, setCheckbillsCount] = useState(0);

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
    getAllTable()
  }, []);

  const Notifunction = (type) => {
    if (type === 'callstaff') {
      const callStaffTables = table.filter(item => item.table === tableID && item.IDrestaurant === getIdrestaurant );
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


  return (
    <Grid container direction="column" minHeight="100vh">
      <Grid item>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            padding: "20px",
            backgroundColor: "#fff",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Grid item>
            <Button
              sx={{ backgroundColor: "#EEA414 !important" }}
              variant="contained"
              startIcon={<ArrowBack sx={{ fontSize: 20 }} />}
              onClick={() => navigate("/CustomersHomepage")}
            >
              Back
            </Button>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center", marginLeft: "150px" }}>
            <Grid container direction="row" alignItems="center">
              <TableChartOutlined />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  marginLeft: "10px",
                }}
              >
                {tableID}
              </Typography>
            </Grid>
          </Grid>
          <Grid item sx={{ position: "relative" }}>
            <IconButton onClick={handleOpenModal}>
              <Badge>
                <Notifications sx={{ fontSize: 30 }} />
              </Badge>
            </IconButton>
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
                <Typography variant="h5" gutterBottom>
                  เลือกรายการที่ต้องการ
                </Typography>
                <Button onClick={() => Notifunction('callstaff')} variant="contained" sx={{ backgroundColor: "#2196f3", color: "#fff", margin: "10px" }}>เรียกพนักงาน</Button>
                <Button onClick={() => Notifunction('checkbills')} variant="contained" sx={{ backgroundColor: "#f44336", color: "#fff", margin: "10px" }}>เช็คบิล</Button>
              </Box>
            </Modal>

          </Grid>
        </Grid>
      </Grid>
      <Grid item flexGrow={1}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ padding: "20px", backgroundColor: "#fff", minHeight: "80vh" }}
        >
          {props.children}
        </Grid>
      </Grid>
    </Grid>

  );

};

export default CustomersLayout;
