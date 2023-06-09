import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { Button, Table, Modal, Form, Input, Select, message, Divider, Typography } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';
function CartPage() {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false)
  const [billChargeTakeaway, setBillChargeTakeaway] = useState(false)
  //ข้อมูล order
  // const [orderData, setOrderData] = useState([]);

  //ตาราง table
  const [table, setTable] = useState([]);

  //time
  const now = new Date();
  const timenow = now.toLocaleTimeString();
  // const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  // const dateTimeString = now.toLocaleString('th-TH', options);
  // console.log(dateTimeString);

  const [isButtonDisabledTable, setIsButtonDisabledTable] = useState(true);
  const [isButtonDisabledTakeAway, setIsButtonDisabledTakeAway] = useState(true);

  const [subTotal, setSubTotal] = useState(0)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity + - 1 },
      });
    }
  };
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + (item.price * item.quantity)
    })
    setSubTotal(temp)
    getAllTable()
  }, [cartItems]);

  const onCustomerNameChangeTakeAway = (event) => {
    const { value } = event.target;
    setIsButtonDisabledTakeAway(value.length === 0);
  };

  const onTableChange = (value) => {
    setIsButtonDisabledTable(value === undefined);
  };

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

  const onFinish = (values, record) => {
    dispatch({ type: "showLoading" });
    console.log(values)
    const uniqueTableID = uuidv4(); // generate new unique ID
    const newLink = `http://localhost:3000/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${values.table}&restaurantId=${Idrestaurant}`;
    cartItems.forEach((item) => {
      console.log(item)
      axios.post('/api/bills/bill-order', { ...values, ObjectIdItem: item._id, time: timenow, order: item.name, status: "ส่งครัว", Idrestaurant: Idrestaurant, price: Number(item.price), quantity: Number(item.quantity) })
        .then(() => {
        }).catch(() => {
          //message.error("Something went wrong");
        })
    })
    dispatch({ type: "hideLoading" });
    // message.success("Bill charged Successfully");
    axios
      .post("/api/tables/add-table-active", { ...values, table:values.table , Idrestaurant: Idrestaurant, status: "active", time: timenow, Link: newLink, uniqueTableID: uniqueTableID })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Table add successfully')
        getAllTable()
      })
      .catch((error) => {
        if (error.response.data.message === "Table already exists") {
          message.error(`Table is already  `)
        } else {
          message.error("Something went wrong");
        }
        dispatch({ type: "hideLoading" });
      });
    navigate('/Tablerestaurant')

  };

  const onFinishtakeaway = (values, record) => {
    dispatch({ type: "showLoading" });
    cartItems.forEach((item) => {
      console.log(item)
      axios.post('/api/bills/bill-order', { ...values, ObjectIdItem: item._id, time: timenow, order: item.name, status: "ส่งครัว", Idrestaurant: Idrestaurant, price: Number(item.price), quantity: Number(item.quantity), })
        .then(() => {
        }).catch(() => {
          //message.error("Something went wrong");
        })
    })
    dispatch({ type: "hideLoading" });
    message.success("Take away Successfully");
    navigate('/Tablerestaurant')
  };
  const columns = [
    {
      title: "รายการ",
      dataIndex: "name",
    },
    {
      title: "รูป",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "ราคา",
      dataIndex: "price",
    },
    {
      title: "จำนวน",
      dataIndex: "_id",
      render: (_id, record) => (
        <div style={{ fontSize: "20px" }}>
          <PlusCircleOutlined
            className="mx-3"

            onClick={() => increaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined className="mx-3" onClick={() => decreaseQuantity(record)} />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <DeleteOutlined style={{ fontSize: "20px" }} onClick={() => dispatch({ type: 'deleteFromCart', payload: record })} />,
    },
  ];


  return (
    <DefaultLayout>
      <h3>ตะกร้าสินค้า</h3><Divider />
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subTotal">
          <h3>ยอดรวม : <b>{subTotal} ฿ </b></h3>
        </div>
        <div>
          <Button type="primary" style={{ backgroundColor: 'green', margin: '10px' }} onClick={() => setBillChargeTakeaway(true)}>Take away</Button>
          <Button type="primary" onClick={() => setBillChargeModal(true)}>บันทึกไปยังโต๊ะ</Button>
        </div>
      </div>

      <Modal title={<Typography style={{ color: '#2e186a' }}>บันทึกไปยังโต๊ะ</Typography>} visible={billChargeModal} footer={false} onCancel={() => setBillChargeModal(false)}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name='table' label='โต๊ะ'>
            <Select onChange={onTableChange}>
              {table.map((table) => {
                if (table.IDrestaurant === Idrestaurant) {
                  return (
                    <Select.Option key={table.table} value={table.table}>
                      โต๊ะ {table.table}
                    </Select.Option>
                  )
                }
                return null;
              })}
            </Select>
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary" disabled={isButtonDisabledTable}>
              บันทึก
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal title={<Typography style={{ color: '#2e186a' }}>Take away</Typography>} visible={billChargeTakeaway} footer={false} onCancel={() => setBillChargeTakeaway(false)}>
        <Form layout="vertical" onFinish={onFinishtakeaway}>
          <Form.Item name='customerName' label='ชื่อลูกค้า' rules={[
            {
              required: true,
              message: 'โปรดกรอกชื่อลูกค้า',
            },
          ]}>
            <Input onChange={onCustomerNameChangeTakeAway} />
          </Form.Item>

          <Form.Item name='customerPhoneNumber' label='เบอร์โทรศัพท์'>
            <Input />
          </Form.Item>

          <Form.Item name='details' label='เพิ่มเติม'>
            <Input />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary" disabled={isButtonDisabledTakeAway}>
              บันทึก
            </Button>
          </div>
        </Form>{""}
      </Modal>

    </DefaultLayout>
  );
}
export default CartPage;
