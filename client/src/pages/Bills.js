import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  EyeOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal, Divider } from "antd";

function Bills() {
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibility] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null)

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const dispatch = useDispatch();
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


  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
    },
     {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Bill Details",
      dataIndex: "_id",
      render: (id, record) =>(
        <div className="d-flex">
          <EyeOutlined className="mx-2" onClick={() =>{
            setSelectedBill(record)
            setPrintBillModalVisibility(true)
          }}/>
        </div>
      ),
    },
  ];
  const cartcolumns = [
    {
      title: "รายการ",
      dataIndex: "name",
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
  }, [getAllBills]);

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>คลังสินค้า</h3>
      </div>
      <Divider />
      <Table columns={columns} dataSource={billsData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibility(false)
          }}
          visible={printBillModalVisibility}
          title='Bill Details'
          footer={false}
          width={800}
        >
          <div className="bill-model">
            <div className="d-flex justify">
              <div>
                <div className="bill-customer-details my-2">
                  <p>Name:{selectedBill.customerName}</p>
                  <p>Date :{selectedBill.createdAt.toString().substring(0,11)}</p>
                </div>
                <Table dataSource={selectedBill.cartItems} columns={cartcolumns} pagination={false}></Table>
                <div className="dotted-border">
                  <p><b>ยอดรวม</b> : {selectedBill.subTotal} </p>
                </div>

              </div>
            </div>
          </div>
        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Bills