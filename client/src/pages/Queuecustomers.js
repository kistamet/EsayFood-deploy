import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Button,Form, Input, Row, message ,Col , Modal} from "antd";
import { useCallback } from 'react';
import { Table } from "antd";
import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function Queuecustomers() {
  const [queuesData, setQueuesData] = useState([]);

  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const dispatch = useDispatch();
  const [editingQueue, setEditingQueue] = useState(null)

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const getAllQueue = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/restaurants/get-all-queue")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setQueuesData(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    getAllQueue();
  }, [getAllQueue]);

  const deleteQueue = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/restaurants/delete-queue" , {queueId : record._id})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Queue deleted successdully')
        getAllQueue()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });
  };
  const columns = [
    {
      title: "ชื่อ",
      dataIndex: "name",
    },
    {
      title: "จำนวนคน",
      dataIndex: "quantity",
    },
    {
      title: "รายละเอียดเพิ่มเติม",
      dataIndex: "details",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <div className="d-flex">
        <EditOutlined className="ms-2" onClick={() => {
          setEditingQueue(record)
          setAddEditModalVisibilty(true)
        }} />
        <DeleteOutlined className="mx-2" onClick={()=> deleteQueue(record)} />

      </div>
    },
  ];
  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if(editingQueue===null)
    {
      axios
      .post('/api/restaurants/add-queuerestaurants',{...values , Idrestaurant : Idrestaurant } )
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Queue add successfully')
        setEditingQueue(null)
        setAddEditModalVisibilty(false)
        getAllQueue()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }
    else {
      axios
      .post("/api/restaurants/edit-queue", {...values , queueId : editingQueue._id})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item edited successfully')
        setAddEditModalVisibilty(false)
        getAllQueue()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }

  }
  return (
    <DefaultLayout>
        <div className="d-flex justify-content-between">
            <h3>ลำดับคิว</h3>
            <Button type="primary" onClick={() => setAddEditModalVisibilty(true)}  >เพิ่มคิว</Button>
        </div>
        <Table columns={columns} dataSource={queuesData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
        {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingQueue(null)
          setAddEditModalVisibilty(false)
        }} 
        visible={addEditModalVisibilty} 
        title={`${editingQueue !==null ? 'แก้ไขคิว' : 'เพิ่มคิว'}`}
        footer={false}
        >
          <Form
            initialValues={editingQueue}
            layout="vertical" onFinish={onFinish}>
            

            <Form.Item name='name' label='ชื่อ'>
              <Input placeholder="ชื่อ" />
            </Form.Item>

            <Form.Item name='quantity' label='จำนวนคน'>
              <Input placeholder="จำนวนคน" />
            </Form.Item>

            <Form.Item name='details' label='รายละเอียดเพิ่มเติม'>
              <Input placeholder="รายละเอียดเพิ่มเติม" />
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">บันทึก</Button>
            </div>
          </Form>
        </Modal>
      )}
        </DefaultLayout>
)
}
