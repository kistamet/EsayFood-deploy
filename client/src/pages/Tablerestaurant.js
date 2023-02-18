import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Form, Modal, Descriptions, Table, message, Select ,Divider } from 'antd';
import "../resourses/Table.css";
import {
  PlusCircleOutlined,
  CheckSquareOutlined,
  QrcodeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useCallback } from 'react';

function Tablerestaurant() {
  const dispatch = useDispatch()
  const [activeTable, setActiveTable] = useState(null);
  const [keepButton, setKeepButton] = useState([]);
  const [buttonColor, setButtonColor] = useState('primary');

  const [subTotal, setSubTotal] = useState(0)

  const [billtable, setBilltable] = useState(false);

  const now = new Date(); // get the current time
  const timenow = now.toLocaleTimeString();

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const handleButtonClick = (buttonName) => {
    if (activeTable === buttonName) {
      setActiveTable(null);
      setButtonColor('primary');
      console.log("if")
    } else {
      setActiveTable(buttonName);
      setButtonColor('danger');
      getAllTabel()

    }
  };

  const getAllTabel = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/tables/get-all-table")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setKeepButton(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  const cancelTable = () => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/tables/cancel-table", { tablenumber: activeTable })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Table cancel successfully')
        getAllTabel()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });

  };

  const onFinish = (values) => {

    dispatch({ type: "showLoading" });
    axios
      .post("/api/tables/add-table", { ...values, Idrestaurant: Idrestaurant, table: activeTable, status: "active", time: timenow })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Table add successfully')
        getAllTabel()
      })
      .catch((error) => {
        if (error.response.data.message === "Table already exists") {
          message.error(`Table ${activeTable} already  `)
        } else {
          message.error("Something went wrong");
        }
        dispatch({ type: "hideLoading" });
      });
  }
  const onFinishbilltable = (values) => {
    setBilltable(false);
    console.log(values)
    const reqObject = {
      ...values,
      subTotal,
      tax: ((subTotal / 100) * 10),
      totalAmount: subTotal,
      userID: JSON.parse(localStorage.getItem('pos-user'))._id,
      Idrestaurant : Idrestaurant
    };
    axios.post('/api/bills/bill-order', reqObject )
    .then(() => {
      message.success("Bill charged Successfully");
    }).catch(() => {
      message.error("Something went wrong");
    })
    console.log(reqObject)
  }
  useEffect(() => {
    getAllTabel();
  }, [getAllTabel]);

  const ArraykeepButton = keepButton.find((i) => i.table === activeTable)
  const timeTableArraykeepButton = ArraykeepButton?.time

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      name: `กระเกรา ${i}`,
      age: 32,
      address: `1. ${i}`,
    });
  }

  const columns = [
    {
      title: 'รายการ',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'ราคา',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'จำนวน',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'รวม',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'สถานะ',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <DefaultLayout>
      <Row>
        <Col span={12}><h3>โต๊ะอาหาร</h3>
          <Row gutter={16}>
            
            <Col span={22}  ><Divider />
              <div >
                <Button className={`${activeTable === 'A1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A1')} >
                  A1
                </Button>
                <Button className={`${activeTable === 'A2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A2')}  >
                  A2
                </Button>
                <Button className={`${activeTable === 'A3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A3')}>
                  A3
                </Button>
                <Button className={`${activeTable === 'B1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B1')}>
                  B1
                </Button>
                <Button className={`${activeTable === 'B2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B2')}>
                  B2
                </Button>
                <Button className={`${activeTable === 'B3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B3')}>
                  B3
                </Button>

              </div>
            </Col>


          </Row>

        </Col>
        <Col span={12}>
          <Row gutter={12}>
            <Col span={26}>
              <Card title="รายละเอียด" bordered={false} className="custom-card">

                <Col span={26} >
                  <Descriptions labelStyle={{ fontSize: '20px' }}>
                    <Descriptions.Item label="โต๊ะ" style={{ fontSize: '20px' }}>{activeTable}</Descriptions.Item>
                    <Descriptions.Item label="รายการ">2</Descriptions.Item>
                    <Descriptions.Item label="ราคา">300</Descriptions.Item>
                    <Descriptions.Item label="เวลามา" style={{ fontSize: '20px' }}>{timeTableArraykeepButton}</Descriptions.Item>
                  </Descriptions>
                </Col>

              </Card>
            </Col>
          </Row>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col span={6} >
                <Button className="custom-button" onClick={() => onFinish()}>
                  <PlusCircleOutlined style={{ fontSize: '40px' }} />
                  <span>เพิ่ม</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button">
                  <QrcodeOutlined style={{ fontSize: '40px' }} />
                  <span>เพิ่ม</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button" onClick={() => cancelTable()}>
                  <DeleteOutlined style={{ fontSize: '40px' }} />
                  <span>ยกเลิก</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button" onClick={() => setBilltable(true)}>
                  <CheckSquareOutlined style={{ fontSize: '40px' }} />
                  <span>เช็คบิล</span>
                </Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: 200,
              }}
              bordered={true}
            />
          </Col>
          <div className="d-flex justify-content-end" style={{ backgroundColor: '#13AAFF', border: '2px solid black' }}>
            <div class="p-2" style={{ fontSize: '25px' }}>ราคารวม :</div>
            <div class="p-2" style={{ fontSize: '25px' }}>200</div>
          </div>
        </Col>
      </Row>
      {billtable && (
        <Modal  onCancel={() => {
          setBilltable(false)
        }}
          visible={billtable}
          title={"Charge Bill"}
          footer={false}
        >
          <Form 
            layout="vertical" onFinish={onFinishbilltable}  >
            <div>
              <div className="Charge-bill-amount">
                <h5>รายการทั้งหมด<b></b></h5>
                <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: 200,
              }}
              bordered={true}
            />
                <h2>ยอดรวม : <b>323</b></h2>
              </div>
              <div className="d-flex justify-content-start">
              <h4 >จ่ายด้วย </h4>
              <Form.Item  name='paymentMode'style={{ width: '200px', marginLeft: '10px' }}>
                <Select>
                  <Select.Option value='cash' >เงินสด</Select.Option>
                  <Select.Option value='card'>บัตร</Select.Option>
                </Select>
              </Form.Item>
              
              </div>
              <div class="d-flex justify-content-end">
              <Button htmlType="submit" type="primary"  >ยืนยัน</Button>
            </div>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  )
}

export default Tablerestaurant