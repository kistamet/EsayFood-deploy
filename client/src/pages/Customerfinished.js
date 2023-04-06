import React, { useEffect, useState } from "react";
import CustomersLayout from "../components/CustomersLayout";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import {
  LoadingOutlined
} from "@ant-design/icons";
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
function Customerfinished() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const [table, setTable] = useState([]);
  const { search } = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(search);
  const uniqueTableID = queryParams.get("uniqueTableID");
  const tableID = queryParams.get("tableID");
  const getIDrestaurant = queryParams.get("restaurantId");
  const location = useLocation();
  const getAllTable = (() => {
    console.log("123")
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
  });

  const checkLinkValidity = () => {
    console.log("456")
    const tableIds = [];
    table.forEach((item) => {
      if (item.IDrestaurant === getIDrestaurant) {
        const queryParams = new URLSearchParams(location.search);
        const uniqueTableID = queryParams.get("uniqueTableID");
        tableIds.push(item.uniqueTableID);
        if (tableIds.includes(uniqueTableID)) {
          setIsLinkExpired(false);
        } else {
          setIsLinkExpired(true);

        }
      }
    });
  }
  useEffect(() => {
    getAllTable();
  }, []);
  
  useEffect(() => {
    checkLinkValidity();
  }, [table]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("restaurantId");
    setRestaurantId(id);

  }, [location.search]);

  if (isLinkExpired) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <PlaylistAddCheckCircleIcon style={{ fontSize: "150px" ,color: "#0DFFD3" }} />
        </div>
        <div style={{ marginLeft: "20px" }}>
          <Card
            sx={{
              backgroundColor: "#0DFFD3",
              fontSize: "20px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <CardContent>
              <Typography sx={{ fontSize: "20px", textAlign: "center" }}>
                ทำการชำระเงินเสร็จสิ้น
              </Typography>
              <Typography sx={{ fontSize: "20px", textAlign: "center" }}>
                ขอบคุณที่ใช้บริการ
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <CustomersLayout>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <LoadingOutlined style={{ fontSize: "100px" }} />
      </div>
      <Card
        sx={{
          backgroundColor: "#EEA414",
          fontSize: "20px",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: "20px", textAlign: "center" }}>
            <HourglassEmptyIcon /> กรุณารอพนักงานสักครู่
          </Typography>
        </CardContent>
      </Card>
    </div>
    </CustomersLayout>
  );
};

export default Customerfinished;
