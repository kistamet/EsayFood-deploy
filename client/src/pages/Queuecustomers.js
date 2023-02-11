import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Button, Form, Input, message, Modal } from "antd";
import { useCallback } from 'react';
import { Table } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  EditOutlined,
  PlusOutlined,
  CloseOutlined
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function Queuecustomers() {
  const [queuesData, setQueuesData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const [clearnumberqueue, setClearnumberqueue] = useState(false);
  const dispatch = useDispatch();
  const [editingQueue, setEditingQueue] = useState(null)

  const [numberqueue, setNumberqueue] = useState(1);

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);


  const getAllQueue = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/restaurants/get-all-queue")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setQueuesData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    getAllQueue();
  }, [getAllQueue]);



  const cancelQueue = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/restaurants/delete-queue", { queueId: record._id })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Queue cancel successfully')
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
      title: "ลำดับ",
      dataIndex: 'Queue',
      width: "50px",
    },
    {
      title: "ชื่อ",
      dataIndex: "name",

    },
    {
      title: "จำนวนคน",
      dataIndex: "quantity",
      width: "150px",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "รายละเอียดเพิ่มเติม",
      dataIndex: "details",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      width: "425px",

      render: (id, record) => <div className="d-flex justify-content-end">
        <Button className="d-flex justify-content-end"
          icon={<CheckOutlined />}
          type="primary"
          onClick={() => cancelQueue(record)}
          style={{ marginLeft: "10px", fontSize: "15px", backgroundColor: "green" 
          }}  >เรียกคิว</Button>


        <Button className="d-flex justify-content-between" icon={<EditOutlined />}
          type="primary"
          onClick={() => {
            setEditingQueue(record)
            setAddEditModalVisibilty(true)
          }}
          style={{fontSize: "15px",backgroundColor: "Black",marginLeft: "10px",
          }}  >แก้ไข</Button>

        <Button className="d-flex justify-content-end"
          icon={<CloseOutlined />}
          type="primary"
          onClick={() => cancelQueue(record)}
          style={{ marginLeft: "10px", fontSize: "15px", backgroundColor: "red" 
          }}  >ยกเลิก</Button>
      </div>

    },
  ];
  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if (editingQueue === null) {
      axios
        .post('/api/restaurants/add-queuerestaurants', { ...values, Idrestaurant: Idrestaurant, Queue: numberqueue })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success(`Queue ${queuesData.length + 1} added successfully`)
          setEditingQueue(null)
          setNumberqueue(numberqueue + 1)
          setAddEditModalVisibilty(false)
          getAllQueue()
          console.log(numberqueue)
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error('Something went wrong')
          console.log(error);
        });
    }
    else {
      axios
        .post("/api/restaurants/edit-queue", { ...values, queueId: editingQueue._id })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success('Queue edited successfully')
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

  const onFinishqueue = () => {
    setNumberqueue(1);
    setClearnumberqueue(false);
  }

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>ลำดับคิว</h3>
        <div>
          <Button icon={<PlusOutlined style={{ fontSize: "45px" }} />} type="primary" onClick={() => setAddEditModalVisibilty(true)} style={{ fontSize: "15px" }}  >เพิ่มคิว</Button>
          <Button type="primary" onClick={() => setClearnumberqueue(true)} style={{ marginLeft: "5px", backgroundColor: "red" }}>ล้างลำดับคิว</Button>
        </div>
      </div>
      <Table columns={columns} dataSource={queuesData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
      {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingQueue(null)
          setAddEditModalVisibilty(false)
        }}
          visible={addEditModalVisibilty}
          title={`${editingQueue !== null ? 'แก้ไขคิว' : 'เพิ่มคิว'}`}
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

      {clearnumberqueue && (
        <Modal onCancel={() => {
          setClearnumberqueue(false)
        }}
          visible={clearnumberqueue}
          title={"ล้างคิว"}
          footer={false}
        >
          <Form
            layout="vertical" >
            <div class="d-flex justify-content-around">
              <h3>ต้องการล้างลำดับคิวใช่หรือไม่ ?</h3>
            </div>
            <div class="d-flex justify-content-around">
            <Button htmlType="submit" type="primary" onClick={onFinishqueue} >ยืนยัน</Button>
              <Button htmlType="submit" type="primary" style={{backgroundColor: "red" }}  onClick={onFinishqueue} >ยกเลิก</Button>
            </div>
          </Form>
        </Modal>
      )}
      <div>
      <h5>ลำดับคิวถัดไป : {numberqueue}</h5>
      </div>
    </DefaultLayout>
  )
}
