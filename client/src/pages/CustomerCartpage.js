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
import "../resourses/CustomerCart.css";

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
  const getIDrestaurant = queryParams.get("restaurantId");
  //ข้อมูล order
  const [orderData, setOrderData] = useState([]);
  const now = new Date();
  const timenow = now.toLocaleTimeString();


  // const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  // const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const onFinish = () => {
    dispatch({ type: "showLoading" });

    cartItemsCustomer.forEach((item) => {
      console.log(item.additionalDetails)
      axios
        .post("/api/bills/bill-order", {
          table: tableID,
          time: timenow,
          order: item.name,
          status: "ส่งครัว",
          Idrestaurant: getIDrestaurant,
          price: Number(item.price),
          quantity: Number(item.quantity),
          details: item.additionalDetails
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
    getAllTable()
  }, []);
  useEffect(() => {
    checkLinkValidity();
  }, [table]);
  console.log(isLinkExpired)
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
        <Typography className="typography-container">
          <CancelIcon className="cancel-icon" />
          ไม่มีรายการอาหารในตะกร้า
          <Button
            onClick={goToHome}
            variant="contained"
            startIcon={<AssignmentIcon className="button-icon" />}
            className="buttonAddOrder-container"
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
      <Typography className="buttonOrderd">
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
      <Card className="card-container">
        {cartItemsCustomer.length > 0 && (
          <Button
            onClick={onFinish}
            variant="contained"
            className="sendOrder-button"
          >
            ส่ง{" "}
            {cartItemsCustomer.reduce(
              (total, item) => total + item.quantity,
              0
            )}{" "}
            รายการ
          </Button>
        )}
        {cartItemsCustomer.length === 0 && mergedItems.length > 0 && (
          <Button
            onClick={goToBills}
            variant="contained"
            className="pay-button"
          >
            ชำระเงิน 
          </Button>
        )}
      </Card>
    </CustomersLayout>
  );
}
export default CustomerCartpage;
