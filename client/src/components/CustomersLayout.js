import React, { useEffect} from "react";
import { Button, Layout} from "antd";
import {
  ShoppingCartOutlined,
  LeftOutlined
} from "@ant-design/icons";
import "../resourses/CustomersLayout.css";
import {useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Header,  Content } = Layout;

const CustomersLayout = (props) => {
  const navigate = useNavigate();
  const { cartItems, loading } = useSelector((state) => state.rootReducer);

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
      <Layout className="site-layout-customers">
        <Header className="site-layout-background-customers" style={{ padding: 10 } }>
        <Button icon={<LeftOutlined style={{fontSize:'70px', height:'25px' , backgroundColor: 'orange'}} />}         onClick={() => navigate("/CustomersHomepage")}></Button>
          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/CustomerCartpage")}
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
            margin: "5px",
            padding: 5,
            minHeight: '80vh',
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomersLayout;
