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
  }, [getAllBills]);
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
                  <b>{Idrestaurant}</b>
                </h5>
              </div>
              <div>
                <p>327 ถ. มหาไชย</p>
                <p>แขวงสำราญราษฎร์ เขตพระนคร</p>
                <p>กรุงเทพมหานคร 10200</p>
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
              <p >
                <b>Cashier</b> :{" "}
              </p>
            </div>
            <Table dataSource={selectedBill.cartItems} columns={cartcolumns} pagination={false} />

            <div className="dotted-border">
              <p><b>Total</b> : {selectedBill.subTotal}</p>
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