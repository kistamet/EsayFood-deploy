import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { Table } from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

function CartPage() {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const dispatch = useDispatch();

  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  const decreaseQuantity = (record) => {
    if(record.quantity!==1){
        dispatch({
            type: "updateCart",
            payload: { ...record, quantity: record.quantity +- 1 },
          });
    }
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
          <MinusCircleOutlined className="mx-3" onClick={() => decreaseQuantity(record) }/>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <DeleteOutlined onClick={()=>dispatch({type: 'deleteFromCart' , payload : record})} />,
    },
  ];
  return (
    <DefaultLayout>
      <h3>cart</h3>
      <Table columns={columns} dataSource={cartItems} bordered />
    </DefaultLayout>
  );
}
export default CartPage;
