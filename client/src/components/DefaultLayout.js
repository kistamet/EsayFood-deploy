import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
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
  SolutionOutlined 
} from "@ant-design/icons";
import "../resourses/layout.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Header, Sider, Content } = Layout;

const DefaultLayout = (props) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
  }, [cartItems]);
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
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h3>Easy POS</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>

          <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
            <Link to="/cart">Cart</Link>
          </Menu.Item>

          <Menu.Item key="/Tabelrestaurant" icon={<AppstoreOutlined />}>
            <Link to="/Tabelrestaurant">โต๊ะอาหาร</Link>
          </Menu.Item>

          <Menu.Item key="/Queuecustomers" icon={<SolutionOutlined />}>
            <Link to="/Queuecustomers">ลำดับคิว</Link>
          </Menu.Item>

          <Menu.Item key="/Bills" icon={<CopyOutlined />}>
            <Link to="/Bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/Items" icon={<ContainerOutlined />}>
            <Link to="/Items">สินค้าคงคลัง</Link>
          </Menu.Item>
          <Menu.Item key="/Customers" icon={<HistoryOutlined />}>
            <Link to="/Customers">ประวัติการขาย</Link>
          </Menu.Item>
          <Menu.Item key="/ProfileRestaurant" icon={<UserOutlined />}>
            <Link to="/ProfileRestaurant">Profile</Link>
          </Menu.Item>
          <Menu.Item key="/Logout" icon={<LoginOutlined />}onClick={()=>{
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
        <Header className="site-layout-background" style={{ padding: 10 }} >
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
              <p className="mt-3 mr-2">{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined />
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
