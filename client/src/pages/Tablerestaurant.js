import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Form, Modal, Descriptions, Table, message, Select, Input, Tabs } from 'antd';
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
import { v4 as uuidv4 } from 'uuid';
import QrCode from "react-qr-code";

function Tablerestaurant() {
  const dispatch = useDispatch()
  const [buttonLabels, setButtonLabels] = useState([]);
  //Tab
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState('1');
  //Qrcode Modal
  const [isModalVisibleQrCode, setIsModalVisibleQrCode] = useState(false);
  //state ที่เอาไว้ให้ปุ่ม enable หรือ disable
  const [isButtonDisabledQrCode, setIsButtonDisabledQrCode] = useState(true);
  const [isButtonDisabledAdd, setIsButtonDisabledAdd] = useState(true);
  const [isButtonDisabledCancel, setIsButtonDisabledCancel] = useState(true);
  const [isButtonDisabledBills, setIsButtonDisabledBills] = useState(true);
  const [isButtonDisabledCheckBills, setIsButtonDisabledCheckBills] = useState(true);

  //โหมดของการจ่ายเงิน
  const [paymentMode, setPaymentMode] = useState(null); // null to start, until user selects a payment mode  const [isCashSelected, setIsCashSelected] = useState(true); // track whether "Cash" is selected
  //state ที่เอาไว้ให้ show ปุ่มกับ Input เมื่อเลือก "เงินสด"
  const [showCashInput, setShowCashInput] = useState(false);
  //เงินที่รับมาจากช่อง Input
  const [cashAmount, setCashAmount] = useState(0);
  //บวกค่าของ Input
  const ClickPlusCash = (value) => {
    setCashAmount(cashAmount + value);
  };

  //Link ของ QrCode
  const [link, setLink] = useState(null);

  //เปลี่ยน Tab
  const handleTabChange = (key) => {
    dispatch({ type: "showLoading" });
    setActiveTab(key);
    queryDataTakeAway();
    getAllorder()
    setIsButtonDisabledQrCode(true)
    if (key === "1") {
      setIsButtonDisabledAdd(false)
      setActiveTable(null)
    } else
      setActiveTable(null)
    setIsButtonDisabledAdd(true)
    setIsButtonDisabledBills(true)
    setIsButtonDisabledCancel(true)
    setIsButtonDisabledBills(true)
  };
  //ข้อมูลของ Take Away มห้นำมาแสดง
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
  const now = new Date();
  const timenow = now.toLocaleTimeString();
  // const dateTimeString = now.toISOString();
  //console.log(dateTimeString);

  const moment = require('moment-timezone');
  const thTime = moment().tz('Asia/Bangkok').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
  //console.log(thTime);

  const year = now.getFullYear() + 543;
  //console.log(dayOfWeekString)
  //console.log(year)

  //Idrestaurant
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  //get table avtive
  // const getStatusTable = JSON.parse(localStorage.getItem('pop-table'));
  //const [statusTable, setStatusTable] = useState([]);

  // const getStatusOrder = JSON.parse(localStorage.getItem('pop-table-Order'));
  const [statusTableOrder, setStatusTableOrder] = useState([])
  //console.log(statusTable)

  //function สำหรับเปลี่ยนสีปุ่มเมื่อกด add หรือ มีออเดอร์ และเปลี่ยนเป็นสีเขียวเมื่อเสร็จแล้ว
  function getTableColor(tableNumber, Idrestaurant, table, statusTableOrder) {
    const isTableOccupied = table.some(item => item.table === tableNumber && item.IDrestaurant === Idrestaurant);
    const isTableBeingPrepared = statusTableOrder.some(item => item.table === tableNumber && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ"));
    const isTableCompletedOrCancelled = statusTableOrder.some(item => item.table === tableNumber && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก"));

    if (isTableOccupied || isTableBeingPrepared) {
      return '#3672f4';
    } else if (isTableCompletedOrCancelled) {
      return 'green';
    } else {
      return '';
    }
  }
  const A1Color = getTableColor('A1', Idrestaurant, table, statusTableOrder);
  const A2Color = getTableColor('A2', Idrestaurant, table, statusTableOrder);
  const A3Color = getTableColor('A3', Idrestaurant, table, statusTableOrder);
  const B1Color = getTableColor('B1', Idrestaurant, table, statusTableOrder);
  const B2Color = getTableColor('B2', Idrestaurant, table, statusTableOrder);
  const B3Color = getTableColor('B3', Idrestaurant, table, statusTableOrder);

  //active Button
  const handleButtonClick = (buttonName) => {
    const tableColor = table.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant) ||
      statusTableOrder.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ"))
      ? '#3672f4'
      : (statusTableOrder.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
        ? 'green'
        : '';

    //Disabel ปุ่มเมื่อกดเข้ามาที่หน้า table
    if (activeTable === buttonName) {
      setActiveTable(null);
      setButtonColor('primary');
      setIsButtonDisabledQrCode(true);
      setIsButtonDisabledBills(true);
      setIsButtonDisabledCancel(true);
      setIsButtonDisabledAdd(true);
      console.log("if 1")
    } else {
      setActiveTable(buttonName);
      setButtonColor('danger');
      getAllTable();
      setIsButtonDisabledQrCode(false);
      setIsButtonDisabledBills(false);
      setIsButtonDisabledCancel(false);
      setIsButtonDisabledAdd(false);
      console.log("else 1")
      if (tableColor === '#3672f4' || tableColor === 'green') {
        setIsButtonDisabledQrCode(false);
        setIsButtonDisabledBills(false);
        setIsButtonDisabledCancel(false);
        setIsButtonDisabledAdd(true);
        console.log("if 2")
      } else {
        setIsButtonDisabledQrCode(true);
        setIsButtonDisabledBills(true);
        setIsButtonDisabledCancel(true);
        console.log("else 2")
      }
    }
  };

  const handleButtonClickTakeAway = (label) => {
    if (activeTable === label) {
      setActiveTable(null);
      setButtonColor('primary');
      setIsButtonDisabledBills(true)
      setIsButtonDisabledCancel(true)
    } else {
      setActiveTable(label);
      setButtonColor('danger');
      getAllTable()
      setIsButtonDisabledBills(false)
      setIsButtonDisabledCancel(false)
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
        // setStatusTable(response.data)
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
    dispatch({ type: "hideLoading" });
  }, [dispatch]);

  const cancelTable = () => {
    dispatch({ type: "showLoading" });
    setActiveTable(null)
    setCashAmount(0)
    if (orderData.length > 0) {
      for (let i = 0; i < orderData.length; i++) {
        axios
          .post("/api/tables/cancel-table", { tablenumber: activeTable, customerName: activeTable })
          .then((response) => {
            dispatch({ type: "hideLoading" });
            getAllTable()
            getAllorder()

            // Remove the cancelled table from the buttonLabels array
            setButtonLabels((prevLabels) => prevLabels.filter((label) => label !== activeTable));
          })
          .catch((error) => {
            dispatch({ type: "hideLoading" });
            message.error('Something went wrong')
            console.log(error);
          });

      }
    } else if (table.length >= 0) {
      axios
        .post("/api/tables/cancel-table", { tablenumber: activeTable })
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

    message.success(`Table ${activeTable} cancel successfully`);
  };
  const onFinish = (values) => {
    const uniqueTableID = uuidv4(); // generate new unique ID
    const newLink = `http://localhost:3000/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${activeTable}&restaurantId=${Idrestaurant}`;
    setIsButtonDisabledQrCode(false);
    setIsButtonDisabledBills(false);
    setIsButtonDisabledCancel(false);
    setIsButtonDisabledAdd(true);
    setCashAmount(0)
    dispatch({ type: "showLoading" });
    axios
      .post("/api/tables/add-table", { ...values, Idrestaurant: Idrestaurant, table: activeTable, status: "active", time: timenow, Link: newLink, uniqueTableID: uniqueTableID })
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
    setCashAmount(0)
    setPaymentMode(null)
    setShowCashInput(false)
    setActiveTable(null)
    const reqObject = {
      ...values,
      cartItems: dataOrdertable, //order table page to bill page
      subTotal: total,
      quantity: quantity,
      table: activeTable,
      timecheckbills: timenow,
      Idrestaurant: Idrestaurant,
      daycheckbills: thTime,
      kind: "", // initialize kind as an empty string
      change: cashAmount - total,
      cash: cashAmount
    };

    // Check if orderData contains customerName or tablenumber
    const hasCustomerName = orderData.some((item) => item.customerName && item.customerName === activeTable);
    const hasTableNumber = orderData.some((item) => item.table && item.table === activeTable);

    if (hasCustomerName) {
      reqObject.kind = "takeaway";
    } else if (hasTableNumber) {
      reqObject.kind = "table";
    }

    axios
      .post("/api/bills/charge-bill", reqObject)
      .then(() => {
        message.success(`Bill ${activeTable} charged Successfully`);
      })
      .catch(() => {
        message.error("Something went wrong");
      });

    for (let i = 0; i < orderData.length; i++) {
      axios
        .post("/api/tables/cancel-table", {
          tablenumber: activeTable,
          customerName: activeTable,
        })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          getAllTable();
          getAllorder();
          setButtonLabels((prevLabels) =>
            prevLabels.filter((label) => label !== activeTable)
          );
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");
          console.log(error);
        });
    }
  };

  useEffect(() => {
    const labels = [...new Set(orderData.filter((order) => order.customerName).map((order) => order.customerName))];
    setButtonLabels(labels);
    queryDataTakeAway();
    getAllorder()
    getAllTable()
  }, []);


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

  const handleQrCodeButtonClick = () => {
    setIsModalVisibleQrCode(true);
    table.forEach((item) => {
      if (item.IDrestaurant === Idrestaurant && item.table === activeTable) {
        setLink(item.Link);
      }
    });
    // setLink(newLink);
  };

  const handleModalOk = () => {
    setIsModalVisibleQrCode(false); // hide the modal
  };

  const handleModalCancel = () => {
    setIsModalVisibleQrCode(false); // hide the modal
    setLink("");
  };

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
                    {buttonLabels.map((label, index) => {
                      const completedColor = orderData.some((item) => item.customerName === label && (item.status === "กำลังทำ" || item.status === "ส่งครัว"))
                        ? "blue-color-class"
                        : orderData.some((item) => item.customerName === label && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก"))
                          ? "green-color-class"
                          : "";
                      return (
                        <Button
                          onClick={() => handleButtonClickTakeAway(label)}
                          className={`${activeTable === label ? buttonColor : ''} buttontakeaway ${completedColor}`}
                          key={index}
                          style={{ fontSize: '30px' }}
                        >
                          {label}
                          <div style={{ fontSize: '15px' }}>
                            {orderData.find((item) => item.customerName === label)?.details}
                          </div>
                        </Button>
                      );
                    })}
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
                    <Descriptions.Item label="ราคา">{total.toLocaleString('en-US')}</Descriptions.Item>
                    <Descriptions.Item label="เวลามา" style={{ fontSize: '20px' }}>{getTimetable}</Descriptions.Item>
                  </Descriptions>
                </Col>

              </Card>
            </Col>
          </Row>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col span={6} >
                <Button className="custom-button" disabled={isButtonDisabledAdd} onClick={() => onFinish()}>
                  <PlusCircleOutlined style={{ fontSize: '40px' }} />
                  <span>เพิ่ม</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button" disabled={isButtonDisabledQrCode} onClick={handleQrCodeButtonClick}>
                  <QrcodeOutlined style={{ fontSize: '40px' }} />
                  <span>Qr Code</span>
                </Button>
                <Modal title={`QR Code for Table ${activeTable}`} visible={isModalVisibleQrCode} onOk={handleModalOk} onCancel={handleModalCancel}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <QrCode value={link} style={{ width: '50%', height: 'auto' }} />
                    {link && <p>{link}</p>}
                  </div>
                </Modal>
              </Col>
              <Col span={6} >
                <Button className="custom-button" disabled={isButtonDisabledCancel} onClick={() => cancelTable()}>
                  <DeleteOutlined style={{ fontSize: '40px' }} />
                  <span>ยกเลิก</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button" disabled={isButtonDisabledBills} onClick={() => setBilltable(true)}>
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
            <div className="p-2" style={{ fontSize: '25px' }}>ราคาอาหารรวม :</div>
            <div className="p-2" style={{ fontSize: '25px' }}>{total}</div>
          </div>
        </Col>
      </Row>
      {billtable && (
        <Modal
          onCancel={() => {
            setBilltable(false);
            setShowCashInput(false);
            setPaymentMode(null)
            setCashAmount(0)
          }}
          visible={billtable}
          title={"Charge Bill"}
          footer={false}
          width={800}
        >
          <Form layout="vertical" onFinish={onFinishbilltable}>
            <div>
              <div className="Charge-bill-amount">
                <h5>
                  รายการทั้งหมด<b></b>
                </h5>
                <Table
                  columns={columns}
                  dataSource={orderData.filter(
                    (i) =>
                      i.IDrestaurant === getIdrestaurant &&
                      (i.table || i.customerName) === activeTable
                  )}
                  pagination={false}
                  scroll={{
                    y: 200,
                  }}
                />
                <h5>
                  รายการ : <b>{quantity}</b>
                </h5>
                <h2>
                  ยอดรวม : <b>{total.toLocaleString('en-US')}</b>
                </h2>
              </div>
              <div className="bill-customer-details my-2 dotted-border" />
              <div className="d-flex justify-content-start">
                <Form.Item name="paymentMode" label="เลือกวิธีชำระเงิน" style={{ width: "200px", marginLeft: "10px" }}>
                  <Select
                    onChange={(value) => {
                      setPaymentMode(value);
                      setShowCashInput(value === "เงินสด");
                    }}
                  >
                    <Select.Option value="เงินสด">เงินสด</Select.Option>
                    <Select.Option value="เงินโอน">เงินโอน</Select.Option>
                  </Select>
                </Form.Item>
                <div className="d-flex justify-content-between" style={{ marginLeft: "120px" }}>
                  {showCashInput && (
                    <div >
                      <Form.Item
                        name="cashAmount"
                        label="จำนวนเงิน"
                        rules={[
                          {
                            validator: (_, value) => {
                              if (value <= 0) {
                                return Promise.reject("โปรดระบุจำนวนเงิน");
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input.Group compact>
                          <Input
                            type="number"
                            style={{ width: "70%" }}
                            value={cashAmount}
                            onChange={(e) => setCashAmount(Number(e.target.value))}
                          />
                        </Input.Group>
                        <Button onClick={() => ClickPlusCash(20)}>+20</Button>
                        <Button onClick={() => ClickPlusCash(50)}>+50</Button>
                        <Button onClick={() => ClickPlusCash(100)}>+100</Button>
                        <Button onClick={() => ClickPlusCash(500)}>+500</Button>
                        {cashAmount > 0 && <div>เงินทอน: {cashAmount - total}</div>}
                      </Form.Item>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-end">
                {paymentMode === "เงินสด" && (
                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={!showCashInput || cashAmount <= total}
                  >
                    ยืนยัน
                  </Button>
                )}
                {paymentMode === "เงินโอน" && (
                  <Button
                    htmlType="submit"
                    type="primary"
                  >
                    ยืนยัน
                  </Button>
                )}
              </div>
            </div>
          </Form>
        </Modal>
      )}

    </DefaultLayout>
  )
}

export default Tablerestaurant