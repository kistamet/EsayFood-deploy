import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Button, Divider, Table , message } from 'antd';
import axios from 'axios'
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
function Kitchen() {
  const [orderData, setOrderData] = useState([]);
  const dispatch = useDispatch();
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const getAllorder = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-order")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setOrderData(response.data)
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    getAllorder();
  }, [getAllorder]);

  const cookingdOrder = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/bills/bill-order-update", { orderId: record._id , status : "กำลังทำ"})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success(`${record.order} order is being made.`)
        getAllorder()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });
  };

  const cancelOrder = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/bills/bill-order-update", { orderId: record._id , status : "ยกเลิก" })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success(`${record.order} has been canceled`)
        getAllorder()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });
  };

  const alreadyOrder = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/bills/bill-order-update", { orderId: record._id , status : "เสร็จแล้ว"})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success(`${record.order} finished.`)
        getAllorder()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });
  };
  const columns = [
    {
      title: 'รายการ',
      dataIndex:  'order',
      width: '30%',
    },
    {
      title: 'เพิ่มเติม',
      dataIndex:  'detail',
      width: '30%',
    },
    {
      title: 'โต๊ะ',
      dataIndex: 'table',
      width: '15%',
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
      width: '15%',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      width: '25%',
    },
    {
      title: "Actions",
      dataIndex: "_id",
      width: "425px",

      render: (id, record) => <div className="d-flex justify-content-end">
        <Button className="d-flex justify-content-end"
          type="primary"
          onClick={() => cookingdOrder(record)}
          style={{ marginLeft: "10px", fontSize: "15px", backgroundColor: "blue" 
          }}  >กำลังทำ</Button>


        <Button className="d-flex justify-content-between" 
          type="primary"
          onClick={() => alreadyOrder(record)}
          style={{fontSize: "15px",backgroundColor: "green",marginLeft: "10px",
          }}  >เสร็จแล้ว</Button>

        <Button className="d-flex justify-content-end"
          type="primary"
          onClick={() => cancelOrder(record)}
          style={{ marginLeft: "10px", fontSize: "15px", backgroundColor: "red" 
          }}  >ยกเลิก</Button>
      </div>

    },
  ];
  return (
    <DefaultLayout>
    <div className="d-flex justify-content-between" >
    <h3>ครัว</h3>
    </div>
    <div>

      <Divider />

      <Table
        columns={columns}
        dataSource={orderData.filter((i) => i.IDrestaurant === getIdrestaurant && i.status === "กำลังทำ" || i.status === "ส่งครัว"  )} bordered />
    </div>
    </DefaultLayout>
  )
}

export default Kitchen
