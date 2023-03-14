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
import { v4 as uuidv4 } from 'uuid';
import QrCode from "react-qr-code";

function Tablerestaurant(props) {
  const dispatch = useDispatch()
  const [buttonLabels, setButtonLabels] = useState([]);
  const { TabPane } = Tabs;
  const [activeTab, setActiveTab] = useState('1');
  const [isModalVisibleQrCode, setIsModalVisibleQrCode] = useState(false);

  const [isButtonDisabledQrCode, setIsButtonDisabledQrCode] = useState(true);
  const [isButtonDisabledAdd, setIsButtonDisabledAdd] = useState(true);
  const [isButtonDisabledCancel, setIsButtonDisabledCancel] = useState(true);
  const [isButtonDisabledBills, setIsButtonDisabledBills] = useState(true);

  const [isLinkExpired, setIsLinkExpired] = useState(false);


  const [link, setLink] = useState(null);

  const handleTabChange = (key) => {
    dispatch({ type: "showLoading" });
    setActiveTab(key);
    queryDataTakeAway();
    getAllorder()
    setIsButtonDisabledQrCode(true)
    if (key === "1") {
      setIsButtonDisabledAdd(false)
    } else
      setIsButtonDisabledAdd(true)
    setIsButtonDisabledBills(true)
    setIsButtonDisabledCancel(true)
    setIsButtonDisabledBills(true)
  };
  const queryDataTakeAway = () => {
    orderData.forEach((item) => {
      if (item.IDrestaurant === Idrestaurant) {
        const labels = [...new Set(orderData.filter((order) => order.customerName).map((order) => order.customerName))];
        setButtonLabels(labels);
      }
    });
  };
  const handleExpireButtonClick = () => {
    setIsLinkExpired(true);
    console.log(isLinkExpired)
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
  const dateTimeString = now.toISOString();
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
  const getStatusTable = JSON.parse(localStorage.getItem('pop-table'));
  const [statusTable, setStatusTable] = useState([]);

  const getStatusOrder = JSON.parse(localStorage.getItem('pop-table-Order'));
  const [statusTableOrder, setStatusTableOrder] = useState([])
  //console.log(statusTable)
  const A1Color = (table.some(item => item.table === "A1" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A1" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "A1" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';
  const A2Color = (table.some(item => item.table === "A2" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A2" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "A2" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';
  const A3Color = (table.some(item => item.table === "A3" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "A3" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "A3" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';
  const B1Color = (table.some(item => item.table === "B1" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B1" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "B1" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';
  const B2Color = (table.some(item => item.table === "B2" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B2" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "B2" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';
  const B3Color = (table.some(item => item.table === "B3" && item.IDrestaurant === Idrestaurant) ||
    statusTableOrder.some(item => item.table === "B3" && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ")))
    ? '#3672f4'
    : (statusTableOrder.some(item => item.table === "B3" && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
      ? 'green'
      : '';

  //active Button
  const handleButtonClick = (buttonName) => {
    const tableColor = table.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant) ||
      statusTableOrder.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant && (item.status === "ส่งครัว" || item.status === "กำลังทำ"))
      ? '#3672f4'
      : (statusTableOrder.some(item => item.table === buttonName && item.IDrestaurant === Idrestaurant && (item.status === "เสร็จแล้ว" || item.status === "ยกเลิก")))
        ? 'green'
        : '';

    if (activeTable === buttonName) {
      setActiveTable(null);
      setButtonColor('primary');
      setIsButtonDisabledQrCode(true);
      setIsButtonDisabledBills(true);
      setIsButtonDisabledCancel(true);
      setIsButtonDisabledAdd(true);
      console.log("1")
    } else {
      setActiveTable(buttonName);
      setButtonColor('danger');
      getAllTable();
      setIsButtonDisabledQrCode(false);
      setIsButtonDisabledBills(false);
      setIsButtonDisabledCancel(false);
      setIsButtonDisabledAdd(false);
      console.log("2")

      if (tableColor === '#3672f4') {
        setIsButtonDisabledQrCode(false);
        setIsButtonDisabledBills(false);
        setIsButtonDisabledCancel(false);
        console.log("3")
      } else {
        setIsButtonDisabledQrCode(true);
        setIsButtonDisabledBills(true);
        setIsButtonDisabledCancel(true);
        console.log("4")
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
    };

    // Check if orderData contains customerName or tablenumber
    const hasCustomerName = orderData.some((item) => item.customerName);
    const hasTableNumber = orderData.some((item) => item.table);

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