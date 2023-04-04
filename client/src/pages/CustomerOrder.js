import React, { useEffect, useState } from "react";
import CustomersLayout from '../components/CustomersLayout';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { margin } from "@mui/system";
import { useCallback } from "react";
import axios from "axios";
function CustomerOrder() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [cartItemsCustomer, setCartItemsCustomer] = useState(
        useSelector((state) => state.rootReducer.cartItemsCustomer)
    );
    
    const [restaurantId, setRestaurantId] = useState(null);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const uniqueTableID = queryParams.get("uniqueTableID");
    const tableID = queryParams.get("tableID");
    const getrestaurantId = queryParams.get("restaurantId");
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("restaurantId");
        setRestaurantId(id);

    }, [location.search]);

    function goToCart() {
        const newLink = `/CustomerCartpage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${getrestaurantId}`;
        navigate(newLink);
      }
      function goToHome() {
        const newLink = `/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${getrestaurantId}`;
        navigate(newLink);
      }
      const [isLinkExpired, setIsLinkExpired] = useState(false);
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
      const checkLinkValidity = () => {
        const tableIds = [];
        table.forEach((item) => {
          if (item.IDrestaurant === getrestaurantId) {
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
        checkLinkValidity();
        getAllTable()
      }, [table, getrestaurantId, location.search]);
    
      if (isLinkExpired) {
        // setIsLoading(true); 
        return (
          <h1>
            <div>This link has expired.</div>
          </h1>
        );
      }
    return (
        <CustomersLayout>
            <div style={{ textAlign: "center" }}>
                <CheckCircleOutlineIcon sx={{ ml: 1, fontSize: 220, color: '#EEA414 ' }} />
                <Typography sx={{ fontSize: "40px", justifyContent: "start !important" }}>
                    สั่งอาหารสำเร็จ
                </Typography>
                <Typography sx={{ fontSize: "18px", justifyContent: "start !important" }}>
                    ขอเวลาสักครู่ เรากำลังเตรียมอาหารสำหรับคุณ
                </Typography>
                <br />
                <Button
                    onClick={goToHome}
                    variant="contained"
                    style={{
                        width: '250px',
                        height: '60px',
                        color: "#EEA414",
                        fontSize:"20px",
                        borderRadius: '30px 30px 30px 30px',
                        backgroundColor: "#FFFF",
                        border: "3px solid #EEA414",
                        marginTop: '40px' // add margin to the bottom
                    }}
                >
                    สั่งอาหารเพิ่ม
                </Button>
                <div>
                    <Button
                        onClick={goToCart}
                        variant="contained"
                        style={{
                            width: '250px',
                            height: '60px',
                            color: "#EEA414",
                            fontSize:"20px",
                            borderRadius: '30px 30px 30px 30px',
                            backgroundColor: "#FFFF",
                            border: "3px solid #EEA414",
                            marginTop: '30px' // add margin to the top
                        }}
                    >
                        รายการอาหารที่สั่ง
                    </Button>
                </div>
            </div>
        </CustomersLayout>
    )
}

export default CustomerOrder