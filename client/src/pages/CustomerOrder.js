import React, { useEffect, useState } from "react";
import CustomersLayout from '../components/CustomersLayout';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { margin } from "@mui/system";

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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get("restaurantId");
        setRestaurantId(id);

    }, [location.search]);

    function goToCart() {
        const newLink = `/CustomerCartpage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
        navigate(newLink);
      }
      function goToHome() {
        const newLink = `/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
        navigate(newLink);
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