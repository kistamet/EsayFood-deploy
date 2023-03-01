import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Form, Modal, Descriptions, Table, message, Select, Divider, Tabs } from 'antd';
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
  const [buttonLabels, setButtonLabels] = useState([]);
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState('1');
  const handleTabChange = (key) => {
    dispatch({ type: "showLoading" });
    setActiveTab(key);
    queryDataTakeAway();
    getAllorder()
  };
  const queryDataTakeAway = () => {
    orderData.forEach((item) => {
      if (item.IDrestaurant === Idrestaurant) {
        const labels = [...new Set(orderData.filter((order) => order.customerName).map((order) => order.customerName))];
        setButtonLabels(labels);
      }
    });
  };

  // table active
  const [activeTable, setActiveTable] = useState(null);

  //ตาราง table
  const [table, setTable] = useState([]);

  // color Button
  const [buttonColor, setButtonColor] = useState('primary');

  //ข้อมูล order
  const [orderData, setOrderData] = useState([]);

  //price
  //const [subTotal, setSubTotal] = useState(0)

  const [billtable, setBilltable] = useState(false);

  //time
  const now = new Date(); // get the current time
  const timenow = now.toLocaleTimeString();

  //Idrestaurant
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  //get table avtive
  const getStatusTable = JSON.parse(localStorage.getItem('pop-table'));
  const [statusTable, setStatusTable] = useState([]);

  const getStatusOrder = JSON.parse(localStorage.getItem('pop-table-Order'));
  const [statusTableOrder, setStatusTableOrder] = useState([])


  const A1Color = (statusTable.some(item => item.table === "A1" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A1" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';
  const A2Color = (statusTable.some(item => item.table === "A2" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A2" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';
  const A3Color = (statusTable.some(item => item.table === "A3" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A3" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';
  const B1Color = (statusTable.some(item => item.table === "B1" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B1" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';
  const B2Color = (statusTable.some(item => item.table === "B2" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B2" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';
  const B3Color = (statusTable.some(item => item.table === "B3" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B3" && item.IDrestaurant === Idrestaurant))
    ? '#3672f4'
    : '';

  //active Button
  const handleButtonClick = (buttonName) => {
    if (activeTable === buttonName) {
      setActiveTable(null);
      setButtonColor('primary');
    } else {
      setActiveTable(buttonName);
      setButtonColor('danger');
      getAllTable()
    }
  };
  const handleButtonClick2 = (label) => {
    if (activeTable === label) {
      setActiveTable(null);
      setButtonColor('primary');
    } else {
      setActiveTable(label);
      setButtonColor('danger');
      getAllTable()
    }
  };
  const getAllorder = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-order")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setOrderData(response.data)
        //get from app
        localStorage.setItem('pop-table-Order', JSON.stringify(response.data))
        setStatusTableOrder(response.data)

      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
      dispatch({ type: "hideLoading" });
  }, [dispatch]);

  const getAllTable = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/tables/get-all-table")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setTable(response.data);
        //get from app
        localStorage.setItem('pop-table', JSON.stringify(response.data))
        setStatusTable(response.data)
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
      dispatch({ type: "hideLoading" });
  }, [dispatch]);

  const cancelTable = () => {
    dispatch({ type: "showLoading" });
    for (let i = 0; i < orderData.length; i++) {
      axios
        .post("/api/tables/cancel-table", { tablenumber: activeTable, customerName: activeTable })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          getAllTable()
          getAllorder()

        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error('Something went wrong')
          console.log(error);
        });

    }
    message.success(`Table ${activeTable}  cancel successfully  `)
  }
  const onFinish = (values) => {

    dispatch({ type: "showLoading" });
    axios
      .post("/api/tables/add-table", { ...values, Idrestaurant: Idrestaurant, table: activeTable, status: "active", time: timenow })
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Table add successfully')
        getAllTable()
      })
      .catch((error) => {
        if (error.response.data.message === "Table already exists") {
          message.error(`Table ${activeTable} is already  `)
        } else {
          message.error("Something went wrong");
        }
        dispatch({ type: "hideLoading" });
      });
  }
  const onFinishbilltable = (values) => {
    dispatch({ type: "showLoading" });
    setBilltable(false);
    console.log(values)
    const reqObject = {
      ...values,
      cartItems: dataOrdertable, //order table page to bill page
      subTotal: total,
      quantity: quantity,
      table: activeTable,
      timecheckbills: timenow,
      Idrestaurant: Idrestaurant,
      kind: "table",
    };
    axios.post('/api/bills/charge-bill', reqObject)
      .then(() => {
        message.success(`Bill ${activeTable} charged Successfully`);
      }).catch(() => {
        message.error("Something went wrong");
      })
    for (let i = 0; i < orderData.length; i++) {
      axios
        .post("/api/tables/cancel-table", { tablenumber: activeTable, customerName: activeTable })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          getAllTable()
          getAllorder()
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error('Something went wrong')
          console.log(error);
        });

    }
  }

  useEffect(() => {
    const labels = [...new Set(orderData.filter((order) => order.customerName).map((order) => order.customerName))];
    setButtonLabels(labels);
    queryDataTakeAway();
  }, [orderData ]);


  //import time from "table"
  const timeTable = table.find((i) => i.table === activeTable && i.IDrestaurant === getIdrestaurant)
  const timeTableButton = timeTable?.time

  //price total and quantity each table 
  let total = "";
  let quantity = "";
  let dataTimetable = [];
  let dataOrdertable = [];
  let getTimetable = "";
  let temp = 0;
  orderData.forEach((item) => {
    if ((item.table || item.customerName) === activeTable && item.IDrestaurant === getIdrestaurant) {
      total = Number(total) + Number((item.price * item.quantity))
      quantity = Number(quantity) + 1
      dataTimetable.push(item.time)
      dataTimetable.sort()
      getTimetable = dataTimetable[0]
      temp = temp + (item.price * item.quantity)
      dataOrdertable.push(item)
    }
  })
  //console.log(dataOrdertable)

  const columns = [
    {
      title: 'รายการ',
      dataIndex: 'order',
      width: '30%',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
    },
  ];

  console.log(buttonLabels)
  return (
    <DefaultLayout>
      <Row>
        <Col span={12}>
          <Row gutter={16}>

            <Col span={22}  >

              <Tabs activeKey={activeTab} onChange={handleTabChange} >
                <TabPane tab={<span style={{ fontSize: '20px' }}>โต๊ะอาหาร</span>} key="1">
                  <div >
                    <Button className={`${activeTable === 'A1' ? buttonColor : ''} button`} style={{ backgroundColor: A1Color }} onClick={() => handleButtonClick('A1')} >
                      A1
                    </Button>
                    <Button className={`${activeTable === 'A2' ? buttonColor : ''} button`} style={{ backgroundColor: A2Color }} onClick={() => handleButtonClick('A2')}  >
                      A2
                    </Button>
                    <Button className={`${activeTable === 'A3' ? buttonColor : ''} button`} style={{ backgroundColor: A3Color }} onClick={() => handleButtonClick('A3')}>
                      A3
                    </Button>
                    <Button className={`${activeTable === 'B1' ? buttonColor : ''} button`} style={{ backgroundColor: B1Color }} onClick={() => handleButtonClick('B1')}>
                      B1
                    </Button>
                    <Button className={`${activeTable === 'B2' ? buttonColor : ''} button`} style={{ backgroundColor: B2Color }} onClick={() => handleButtonClick('B2')}>
                      B2
                    </Button>
                    <Button className={`${activeTable === 'B3' ? buttonColor : ''} button`} style={{ backgroundColor: B3Color }} onClick={() => handleButtonClick('B3')}>
                      B3
                    </Button>
                  </div>
                </TabPane>
                <TabPane tab={<span style={{ fontSize: '20px' }}>Take away</span>} key="2">
                  <div>
                    {buttonLabels.map((label, index) => (
                      <Button onClick={() => handleButtonClick2(label)} className={`${activeTable === label ? buttonColor : ''} buttontakeaway`} key={index}   >{label}</Button>
                    ))}
                  </div>
                </TabPane>
              </Tabs>
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
                    <Descriptions.Item label="รายการ">{quantity}</Descriptions.Item>
                    <Descriptions.Item label="ราคา">{total}</Descriptions.Item>
                    <Descriptions.Item label="เวลามา" style={{ fontSize: '20px' }}>{getTimetable}</Descriptions.Item>
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
                  <span>Qr Code</span>
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
              dataSource={orderData.filter((i) => i.IDrestaurant === getIdrestaurant && (i.table || i.customerName) === activeTable)}
              pagination={false}
              scroll={{
                y: 200,
              }}
              bordered={true}
              footer={false}
            />
          </Col>
          <div className="d-flex justify-content-end" style={{ backgroundColor: '#13AAFF', border: '2px solid black' }}>
            <div class="p-2" style={{ fontSize: '25px' }}>ราคาอาหารรวม :</div>
            <div class="p-2" style={{ fontSize: '25px' }}>{total}</div>
          </div>
        </Col>
      </Row>
      {billtable && (
        <Modal onCancel={() => {
          setBilltable(false)
        }}
          visible={billtable}
          title={"Charge Bill"}
          footer={false}
          width={800}
        >
          <Form
            layout="vertical" onFinish={onFinishbilltable}  >
            <div>
              <div className="Charge-bill-amount">
                <h5>รายการทั้งหมด<b></b></h5>
                <Table
                  columns={columns}
                  dataSource={orderData.filter((i) => i.IDrestaurant === getIdrestaurant && (i.table || i.customerName) === activeTable)}
                  pagination={false}
                  scroll={{
                    y: 200,
                  }}
                /><h5>รายการ : <b>{quantity}</b></h5>
                <h2>ยอดรวม : <b>{total}</b></h2>
              </div>
              <div className="d-flex justify-content-start">
                <h4 >จ่ายด้วย </h4>
                <Form.Item name='paymentMode' style={{ width: '200px', marginLeft: '10px' }}>
                  <Select>
                    <Select.Option value='เงินสด' >เงินสด</Select.Option>
                    <Select.Option value='บัตร'>บัตร</Select.Option>
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