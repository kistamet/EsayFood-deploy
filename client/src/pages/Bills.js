import React, { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  EyeOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal, Divider } from "antd";
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, Typography } from "@mui/material";
function Bills() {
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibilty] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null)
  const componentRef = useRef();
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const getNamerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const getAddress = JSON.parse(localStorage.getItem("pop-address"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const dispatch = useDispatch();

  const [selectedTable, setSelectedTable] = useState(null)

  const [orderData, setOrderData] = useState([]);
  console.log(getAddress)
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
}, []);
  const columns = [
    {
      title: "ชื่อลูกค้า / โต๊ะ",
      dataIndex: "table",
      render: (text, record) => {
        return (
          <div>
            <span>{record.customerName}</span>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "ราคาทั้งหมด",
      dataIndex: "subTotal",
    },
    {
      title: "ประเภท",
      dataIndex: "kind",
      width: '15%',
    },
    {
      title: "Bill Details",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined className="mx-2" onClick={() => {
            setSelectedBill(record)
            setPrintBillModalVisibilty(true)
            setSelectedTable(record.table)
          }} />
        </div>
      ),
    },
  ];
  const cartcolumns = [
    {
      title: "รายการ",
      dataIndex: "order",
      render: (text, record) => {
        return (
          <div>
            <span>{record.name}</span>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: "ราคา",
      dataIndex: "price",
    },
    {
      title: "จำนวน",
      dataIndex: "_id",
      render: (_id, record) => (
        <div>
          <b>{record.quantity}</b>

        </div>
      ),
    },
    {
      title: "รวม",
      dataIndex: "_id",
      render: (_id, record) => (
        <div>
          <b>{record.quantity * record.price}</b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllBills();
    getAllorder()
  }, []);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });



  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Bills</h3>
      </div>
      <Divider />
      <Table columns={columns} dataSource={billsData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibilty(false);
          }}
          visible={printBillModalVisibility}
          title="Bill Details"
          footer={false}
          width={350}
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h5>
                  <b>{getNamerestaurant}</b>
                </h5>
              </div>
              <div style={{ width: "50%" }}>
                <p>{getAddress}</p>
              </div>
            </div>
            <div className="bill-customer-details my-2 dotted-border">
              <p>
                <b>Name</b> : {selectedBill.customerName || selectedBill.table}
              </p>

              <p>
                <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
              </p>
              <p >
                <b>Date</b> :{" "}
                {selectedBill.createdAt.toString().substring(0, 10)} {" "}
                {(selectedBill.timecheckbills.toString().substring(0, 5))}
              </p>
              {/* <p >
                <b>Cashier</b> :{" "}
              </p> */}
            </div>
            <Card
                sx={{
                    boxShadow: "none",
                    border: "1px solid #ddd",
                    width: "100%",
                    justifyContent: "start !important",
                }}
            >
                {selectedBill.cartItems.map((item, index) => (
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
                        {selectedBill.cartItems
                            .reduce(
                                (total, item) =>
                                    item.table === selectedTable && item.IDrestaurant === getIdrestaurant
                                        ? total + item.price * item.quantity
                                        : total,
                                0
                            )
                            .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </Typography>
                </CardContent>
            </Card>
            <div className="dotted-border">

              {selectedBill.paymentMode === 'เงินสด' ? (
                <>
                  <p><b>รับเงิน</b> : {selectedBill.cash}</p>
                  <p><b>เงินทอน</b> : {selectedBill.change}</p>
                </>
              ) : (
                <p><b>PayMode</b> : {selectedBill.paymentMode}</p>
              )}
            </div>

            <div>
              <h4><b>ราคาทั้งหมด : {selectedBill.subTotal}</b></h4>
            </div>
            <div className="dotted-border"></div>

            <div className="text-center">
              <p>Thanks</p>
              <p>Visit Again :)</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button type='primary' onClick={handlePrint}>Print Bill</Button>
          </div>

        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Bills