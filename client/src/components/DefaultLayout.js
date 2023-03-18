import React, { useEffect, useState } from "react";

import { Button, Layout, Menu, Modal , Row ,Col  } from "antd";
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
  BellOutlined
} from "@ant-design/icons";
import "../resourses/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const { Header, Sider, Content } = Layout;


const DefaultLayout = (props) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading ,count } = useSelector((state) => state.rootReducer);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

console.log(count)
  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);


  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));


  }, [cartItems]);


  const [isModalVisible, setIsModalVisible] = useState(false);
  //const [count, setCount] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //onst count = useSelector((state) => state.buttonCount);


  const dispatch = useDispatch();


  const handleClick = () => {
    
  };
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
          <h3>Easy POS</h3>
        </div >
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}


        >    <div>
            <div onClick={showModal}>
              <BellOutlined style={{ fontSize: "30px", marginLeft: "20px" }} />
              <span>{count}</span>
            </div>
            <Button onClick={handleClick}>Increase Count</Button>
            <Modal title="Basic Modal" visible={isModalVisible} onCancel={handleCancel}>
              <Row>
                <Col span={12}>col-12</Col>
                <Col span={12}>col-12</Col>
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



