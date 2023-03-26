import React, { useEffect, useState } from "react";
import CustomersLayout from "../components/CustomersLayout";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";

function CustomerBills() {
    const dispatch = useDispatch();
    //ข้อมูล order
    const [orderData, setOrderData] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const location = useLocation();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const tableID = queryParams.get("tableID");
    const cartItemsCustomer = useSelector(
        (state) => state.rootReducer.cartItemsCustomer
    );
    const getAllorder = useCallback(() => {
        dispatch({ type: "showLoading" });
        axios
            .get("/api/bills/get-all-order")
            .then((response) => {
                dispatch({ type: "hideLoading" });
                setOrderData(response.data);
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
        getAllorder();
    }, [location.search]);

    const mergedItems = orderData.reduce((acc, item) => {
        if (item.table === tableID && item.IDrestaurant === restaurantId) {
            const existingItem = acc.find((i) => i.order === item.order);
            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.price += item.price * item.quantity;
            } else {
                acc.push({
                    order: item.order,
                    quantity: item.quantity,
                    price: item.price * item.quantity,
                });
            }
        }
        return acc;
    }, []);
    const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
    const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
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
    function CheckBills() {
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
    }

    return (
        <CustomersLayout>
            <Typography sx={{ fontSize: "20px", justifyContent: "start !important" }}>
                กรุณาตรวจสอบรายการอาหาร
            </Typography>
            <Typography sx={{ fontSize: "20px", justifyContent: "start !important" }}>
                รายการทั้งหมด (x
                {mergedItems.reduce((total, item) => total + item.quantity, 0)})
            </Typography>
            <Card
                sx={{
                    boxShadow: "none",
                    border: "1px solid #ddd",
                    width: "100%",
                    justifyContent: "start !important",
                }}
            >
                {mergedItems.map((item, index) => (
                    <CardContent
                        key={index}
                        sx={{
                            display: "flex ",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px",
                        }}
                    >
                        <Typography sx={{ fontSize: "16px" }}>x{item.quantity}</Typography>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "18px",
                                flex: "1",
                                marginLeft: "10px !important",
                            }}
                        >
                            {item.order}
                        </Typography>
                        <Typography sx={{ color: "#888", fontSize: "16px" }}>
                            ฿
                            {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </Typography>
                    </CardContent>
                ))}
                <Divider color="primary" />
                <CardContent
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                    }}
                >
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                        Total
                    </Typography>
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
                        ฿
                        {orderData
                            .reduce(
                                (total, item) =>
                                    item.table === tableID && item.IDrestaurant === restaurantId
                                        ? total + item.price * item.quantity
                                        : total,
                                0
                            )
                            .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </Typography>
                </CardContent>
            </Card>
            <Card
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "fixed",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "400px",
                    height: "120px",
                    backgroundColor: "#f8f8f8",
                    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.3)",
                    borderRadius: "16px 16px 0px 0px",
                    padding: "16px",
                }}
            >
                <Typography
                    sx={{
                        width: "320px",
                        height: "120px",
                    }}
                ></Typography>
                <Button
                    onClick={CheckBills}
                    variant="contained"
                    // startIcon={<AssignmentIcon />}
                    style={{
                        position: "fixed",
                        bottom: "50px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "260px",
                        height: "50px",
                        backgroundColor: "#CF4D8B",
                    }}
                >
                    เรียกพนักงานเพื่อชำระเงิน
                </Button>
            </Card>
        </CustomersLayout>
    );
}
export default CustomerBills;
