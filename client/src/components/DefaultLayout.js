import React, { useEffect, useState } from "react";

import { Button, Layout, Menu, Modal, Row, Col, Card, Badge, Typography, message } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  LoginOutlined,
  UserOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  HistoryOutlined,
  SolutionOutlined,
  LaptopOutlined,
  BellOutlined,
  CloseOutlined,
  CheckOutlined,
  SyncOutlined
} from "@ant-design/icons";
import "../resourses/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
import axios from "axios";

const { Header, Sider, Content } = Layout;


const DefaultLayout = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);

  const { count } = useSelector((state) => state.rootReducer);

  const state = useSelector(state => state.rootReducer.count);
  // console.log(state);

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const [table, setTable] = useState([]);

  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    localStorage.setItem("count", JSON.stringify(count));

  }, [cartItems]);


  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [count, setCount] = useState(0);

  const showModal = () => {
    getAllTable();
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    getAllTable();
    setIsModalVisible(false);
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


  //const [countNoti, setCountNoti] = useState(0);


  useEffect(() => {
    getAllTable()
  }, []);

  let countNoti = 0
  table.forEach((item) => {
    if (item.IDrestaurant === Idrestaurant && (item.status === "callstaff" || item.status === "checkbills"  ) ) {
      countNoti += 1
    }
  });

  function handleCheck(table) {
    axios
      .post("/api/tables/update-table", { tableId: table._id, status: "active" })
      .then(() => {
        message.success(`Table ${table.table} successfully`);
      })
      .catch(() => {
        message.error("Something went wrong");
      });
    getAllTable()
  }

  function handleClose() {
    // logic to handle the "Close" action
  }

  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div
            class="spinner-border"
            role="status"
          >
          </div>
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={collapsed} >
        <div className="logo">
          <h3 >Easy POS</h3>
        </div >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}


        >    <div>
            <div onClick={showModal}>
              <Badge count={countNoti}>
                <BellOutlined style={{ fontSize: "30px", marginLeft: "20px", color: "white" }} />
              </Badge>
            </div>
            <Modal
              title={<Typography style={{ color: '#2e186a' }}>รายการแจ้งเตือน</Typography>}
              visible={isModalVisible}
              onCancel={handleCancel}
              bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(60vh - 100px)' }}
              autoFocus
              footer={[
                <Button key="refresh" onClick={() => getAllTable()} icon={<SyncOutlined />}>
                  Refresh
                </Button>
              ]}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Typography style={{ color: 'blue' }}>เรียกพนักงาน</Typography>
                  {table.filter(item => item.status === "callstaff" && item.IDrestaurant === getIdrestaurant).length > 0 ? (
                    table
                      .filter(item => item.status === "callstaff" && item.IDrestaurant === getIdrestaurant)
                      .map(item => (
                        <Card
                          key={item.id}
                          actions={[
                            <CheckOutlined onClick={() => handleCheck(item)} />,
                            <div onClick={handleClose}><CloseOutlined /></div>
                          ]}
                        >
                          {item.table} เรียกพนักงาน
                        </Card>
                      ))
                  ) : (
                    <Typography style={{ color: 'blue' }}>ไม่มีการเรียก</Typography>
                  )}
                </Col>
                <Col span={12}>
                  <Typography style={{ color: 'red' }}>ชำระเงิน</Typography>
                  {table.filter(item => item.status === "checkbills" && item.IDrestaurant === getIdrestaurant).length > 0 ? (
                    table
                      .filter(item => item.status === "checkbills" && item.IDrestaurant === getIdrestaurant)
                      .map(item => (
                        <Card
                          key={item.id}
                          actions={[
                            <CheckOutlined onClick={() => handleCheck(item)} />,
                            <CloseOutlined />
                          ]}
                        >
                          {item.table} ชำระเงิน
                        </Card>
                      ))
                  ) : (
                    <Typography style={{ color: 'blue' }}>ไม่มีการเรียก</Typography>
                  )}
                </Col>
              </Row>
            </Modal>
          </div>
          <Menu.Item key="/home" icon={<HomeOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/home">Home</Link>
          </Menu.Item>


          <Menu.Item key="/cart" icon={<ShoppingCartOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/cart">Cart</Link>
          </Menu.Item>


          <Menu.Item key="/Bills" icon={<CopyOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/Bills">Bills</Link>
          </Menu.Item>


          <Menu.Item key="/Tablerestaurant" icon={<AppstoreOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/Tablerestaurant">โต๊ะอาหาร</Link>
          </Menu.Item>


          <Menu.Item key="/Queuecustomers" icon={<SolutionOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/Queuecustomers">ลำดับคิว</Link>
          </Menu.Item>


          <Menu.Item key="/Kitchen" icon={<LaptopOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/Kitchen">ครัว</Link>
          </Menu.Item>


          <Menu.Item key="/Items" icon={<ContainerOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/Items">สินค้าคงคลัง</Link>
          </Menu.Item>
          <Menu.Item key="/HistoryRestaurant" icon={<HistoryOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/HistoryRestaurant">ประวัติการขาย</Link>
          </Menu.Item>
          <Menu.Item key="/ProfileRestaurant" icon={<UserOutlined style={{ fontSize: '20px' }} />}>
            <Link to="/ProfileRestaurant">Profile</Link>
          </Menu.Item>


          <Menu.Item key="/Logout" icon={<LoginOutlined style={{ fontSize: '20px' }} />} onClick={() => {
            localStorage.removeItem('pos-user')
            localStorage.removeItem('pop-name-restaurant')
            localStorage.removeItem('pop-name-restaurant2')
            navigate('/LoginRestaurant')
          }}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 10, fontSize: '20px' }} >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <h3>{namerestaurant}</h3>


          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/cart")}
          >
            <b>
              <p className="mt-3 mr-2" style={{ fontSize: "20px" }}>{totalQuantity}</p>
            </b>
            <ShoppingCartOutlined style={{ fontSize: "30px" }} />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "10px",
            padding: 24,
            minHeight: '80vh',
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default DefaultLayout;



