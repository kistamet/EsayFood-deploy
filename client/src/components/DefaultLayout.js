import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  LoginOutlined,
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

          <Menu.Item key="/Bills" icon={<CopyOutlined />}>
            <Link to="/Bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/Items" icon={<CopyOutlined />}>
            <Link to="/Items">คลังสินค้า</Link>
          </Menu.Item>
          <Menu.Item key="/Customers" icon={<UnorderedListOutlined />}>
            <Link to="/Customers">ประวัติการขาย</Link>
          </Menu.Item>
          <Menu.Item key="/Logout" icon={<LoginOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 10 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
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
