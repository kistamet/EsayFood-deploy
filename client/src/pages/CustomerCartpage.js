import React, { useEffect, useState } from "react";
import CustomersLayout from "../components/CustomersLayout";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentsIcon from "@mui/icons-material/Payments";
import axios from "axios";
import { message } from "antd";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCallback } from "react";
import Chip from "@mui/material/Chip";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

function CustomerCartpage() {
  const [cartItemsCustomer, setCartItemsCustomer] = useState(
    useSelector((state) => state.rootReducer.cartItemsCustomer)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [restaurantId, setRestaurantId] = useState(null);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const uniqueTableID = queryParams.get("uniqueTableID");
  const tableID = queryParams.get("tableID");
  //ข้อมูล order
  const [orderData, setOrderData] = useState([]);
  const now = new Date();
  const timenow = now.toLocaleTimeString();

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const onFinish = () => {
    dispatch({ type: "showLoading" });
    cartItemsCustomer.forEach((item) => {
      console.log(item);
      axios
        .post("/api/bills/bill-order", {
          table: tableID,
          time: timenow,
          order: item.name,
          status: "ส่งครัว",
          Idrestaurant: Idrestaurant,
          price: Number(item.price),
          quantity: Number(item.quantity),
        })
        .then(() => { })
        .catch(() => {
          message.error("Something went wrong");
        });
    });
    dispatch({ type: "hideLoading" });
    //message.success("Bill charged Successfully");
    dispatch({ type: "resetCartItemsCustomer" });
    // navigate(`/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`)
    goToOrder();
  };
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

  function goToBills() {
    const newLink = `/CustomerBills?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
    navigate(newLink);
  }

  function goToOrder() {
    const newLink = `/CustomerOrder?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
    navigate(newLink);
  }
  function goToHome() {
    const newLink = `/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
    navigate(newLink);
  }
  function handleDeleteCartItem(index) {
    const updatedCartItems = cartItemsCustomer.filter((item, i) => i !== index);
    localStorage.setItem('cartItemsCustomer', JSON.stringify(updatedCartItems));
    setCartItemsCustomer(updatedCartItems);
    dispatch({ type: "handleDeleteCartItem", payload: { index: index } });
  }
  const mergedItems = orderData.reduce((acc, item) => {
    if (item.table === tableID && item.IDrestaurant === restaurantId) {
      const existingItem = acc.find((i) => i.order === item.order && i.status === item.status);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.price += item.price * item.quantity;
      } else {
        acc.push({
          order: item.order,
          quantity: item.quantity,
          price: item.price * item.quantity,
          status: item.status,
        });
      }
    }
    return acc;
  }, []);


  return (
    <CustomersLayout>
      {cartItemsCustomer.length > 0 ? (
        <Typography
          sx={{
            fontSize: "20px",
            justifyContent: "start !important",
            display: "flex",
            alignItems: "center",
          }}
        >
          รายการอาหารในตะกร้า (x
          {cartItemsCustomer.reduce((total, item) => total + item.quantity, 0)})
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: "20px",
            justifyContent: "start !important",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CancelIcon sx={{ ml: 1, fontSize: 100, color: "#EEA414" }} />
          ไม่มีรายการอาหารในตะกร้า
          <Button
            onClick={goToHome}
            variant="contained"
            startIcon={<AssignmentIcon />}
            style={{
              width: "150px",
              height: "40px",
              backgroundColor: "#EEA414",
              borderRadius: "20px",
            }}
          >
            สั่งอาหารเพิ่ม
          </Button>
        </Typography>
      )}

      {cartItemsCustomer.map((item, index) => (
        item.additionalDetails ? (
          <Card
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "start",
              padding: "8px",
              width: "100%",
              height: "80px",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography sx={{ fontSize: "18px" }}>
                x{item.quantity} {item.name}
                {item.additionalDetails && (
                  <Typography sx={{ color: "#888", fontSize: "16px" }}>
                    {item.additionalDetails}
                  </Typography>
                )}
              </Typography>
              <Typography sx={{ color: "#888", fontSize: "16px" }}>
                {item.quantity > 1
                  ? ` ฿${(item.quantity * item.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `฿${item.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            <IconButton onClick={() => handleDeleteCartItem(index)}>
  <DeleteIcon style={{ color: "#CF4D4D" }} />
</IconButton>
              </Typography>
            </div>
          </Card>
        ) : (
          <Card
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px",
              width: "100%",
              height: "80px",
              marginTop: "10px",
              flexBasis: "25%", // Set a fixed width for each card
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
              {item.name}
            </Typography>
            <Typography
              sx={{ color: "#888", fontSize: "16px", marginLeft: "10px" }}
            >
              {item.quantity > 1
                ? ` ฿${(item.quantity * item.price).toFixed(2)}`
                : `฿${item.price.toFixed(2)}`}
            </Typography>
            <IconButton onClick={() => handleDeleteCartItem(index)}>
  <DeleteIcon style={{ color: "#CF4D4D" }} />
</IconButton>
          </Card>
        )
      ))}
      <br></br>
      <Divider color="primary" />
      <Typography sx={{ fontSize: "20px", justifyContent: "start !important" }}>
        รายการอาหารที่สั่งไปแล้ว
      </Typography>
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
          <div>
            <Typography sx={{ fontSize: "18px", marginRight: "10px" }}>
              x{item.quantity} {item.order}
            </Typography>
            <Typography sx={{ color: "#888", fontSize: "16px" }}>
              ฿
              {item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Typography>
          </div>
          <div
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              flex: "1",
              marginLeft: "10px !important",
            }}
          >
            <Chip
              label={item.status}
              size="medium"
              color={
                item.status === "เสร็จแล้ว"
                  ? "success"
                  : item.status === "กำลังทำ"
                    ? "warning"
                    : item.status === "ยกเลิก"
                      ? "error"
                      : "default"
              }
            />
          </div>
        </CardContent>
      ))}
      <Typography
        sx={{
          width: "320px",
          height: "120px",
        }}
      ></Typography>
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
        {cartItemsCustomer.length > 0 && (
          <Button
            onClick={onFinish}
            variant="contained"
            startIcon={<AssignmentIcon />}
            sx={{
              width: "100% !important",
              height: "40px !important",
              marginBottom: "16px !important",
              color: "white !important",
              backgroundColor: "#4D91CF !important",
              "&:hover": {
                backgroundColor: "#3472a0 !importants",
              },
            }}
          >
            ส่ง{" "}
            {cartItemsCustomer.reduce(
              (total, item) => total + item.quantity,
              0
            )}{" "}
            รายการ
          </Button>
        )}
        {cartItemsCustomer.length === 0 && (
          <Button
            onClick={goToBills}
            variant="contained"
            startIcon={<AssignmentIcon />}
            sx={{
              width: "100%",
              height: "40px",
              backgroundColor: "#CF4D8B",
              "&:hover": {
                backgroundColor: "#a73a6e",
              },
            }}
          >
            ชำระเงิน
          </Button>
        )}
      </Card>
    </CustomersLayout>
  );
}
export default CustomerCartpage;
