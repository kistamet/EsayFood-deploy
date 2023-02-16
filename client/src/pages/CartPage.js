import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axios from 'axios'
function CartPage() {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false)
  const [subTotal, setSubTotal] = useState(0)
  const dispatch = useDispatch();

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  console.log(Idrestaurant)
  
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
  }, [cartItems]);

  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: ((subTotal / 100) * 10),
      totalAmount: subTotal,
      userID: JSON.parse(localStorage.getItem('pos-user'))._id,
      Idrestaurant : Idrestaurant
    };
    axios.post('/api/restaurants/charge-bill', reqObject )
    .then(() => {
      message.success("Bill charged Successfully");
    }).catch(() => {
      message.error("Something went wrong");
    })
    console.log(reqObject)

  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (_id, record) => (
        <div>
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
      render: (id, record) => <DeleteOutlined onClick={() => dispatch({ type: 'deleteFromCart', payload: record })} />,
    },
  ];
  return (
    <DefaultLayout>
      <h3>ตะกร้าสินค้า</h3>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subTotal">
          <h3>ยอดรวม : <b>{subTotal} ฿ </b></h3>
        </div>
        <Button type="primary" onClick={() => setBillChargeModal(true)}>Charge Bill</Button>
      </div>
      <Modal title='Charge Bill' visible={billChargeModal} footer={false} onCancel={() => setBillChargeModal(false)}><Form
        layout="vertical" onFinish={onFinish}>


        <Form.Item name='customerName' label='ชื่อลูกค้า'>
          <Input  />
        </Form.Item>

        <Form.Item name='customerPhoneNumber' label='เบอร์โทรศัพท์'>
          <Input />
        </Form.Item>

        <Form.Item name='paymentMode' label='จ่ายด้วย'>
          <Select>
            <Select.Option value='cash'>เงินสด</Select.Option>
            <Select.Option value='card'>บัตร</Select.Option>
          </Select>
        </Form.Item>
        <div className="Charge-bill-amount">
          <h5>ยอดรวม : <b> {subTotal}</b></h5>
          <h5>ภาษี : <b>{(subTotal / 100) * 10}</b></h5>
          <h2>ยอดรวมทั้งหมด : <b>{subTotal}</b></h2>
        </div>
        <div className="d-flex justify-content-end">
          <Button htmlType="submit" type="primary">
            บันทึก
          </Button>
        </div>
      </Form>{""}
      </Modal>
    </DefaultLayout>
  );
}
export default CartPage;
