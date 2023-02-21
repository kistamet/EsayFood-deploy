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

function Bills() {
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibilty] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null)
  const componentRef = useRef();
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
      title: "ชื่อลูกค้า",
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
            setPrintBillModalVisibilty(true)
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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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
            setPrintBillModalVisibilty(false);
          }}
          visible={printBillModalVisibility}
          title="Bill Details"
          footer={false}
          width={800}
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h1>
                  <b>{Idrestaurant}</b>
                </h1>
              </div>
              <div>
                <p>Hyderabd</p>
                <p>Amberpet 500013</p>
                <p>9989649278</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <p>
                <b>Name</b> : {selectedBill.customerName}
              </p>
              <p>
                <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
              </p>
              <p>
                <b>Date</b> :{" "}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table dataSource={selectedBill.cartItems} columns={cartcolumns} pagination={false}/>

            <div className="dotted-border">
                <p><b>SUB TOTAL</b> : {selectedBill.subTotal}</p>
            </div>

            <div>
                <h2><b>ราคาทั้งหมด : {selectedBill.totalAmount}</b></h2>
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