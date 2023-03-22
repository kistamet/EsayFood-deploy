import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomersLayout from "../components/CustomersLayout";
import { useParams } from "react-router-dom";
import { Col, Row, Input } from "antd";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import ItemCustomers from "../components/ItemCustomers";
import axios from "axios";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useSelector } from "react-redux";
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
function CustomerHomepage() {
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const { search } = useLocation();
  const { value } = useParams();
  const [restaurantId, setRestaurantId] = useState(null);
  const [table, setTable] = useState([]);
  const location = useLocation();
  const state = useSelector(state => state.rootReducer);
  const [isLoading, setIsLoading] = useState(true); // add a loading state
  const queryParams = new URLSearchParams(search);
  const uniqueTableID = queryParams.get("uniqueTableID");
  const tableID = queryParams.get("tableID");
  const itemCount = state.cartItemsCustomer.reduce((total, item) => total + item.quantity, 0);
  console.log(itemCount)
  const getAllItems = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/menuitems/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

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

  useEffect(() => {
    getAllItems();
    getAllTable();
    const queryParams = new URLSearchParams(search);
    const expires = queryParams.get("expires");
    if (expires && new Date(expires) < new Date()) {
      setIsLinkExpired(true);
    }
  }, [getAllItems, getAllTable, search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("restaurantId");
    setRestaurantId(id);

  }, [location.search]);

  const checkLinkValidity = () => {
    const tableIds = [];
    table.forEach((item) => {
      if (item.IDrestaurant === restaurantId) {
        tableIds.push(item.uniqueTableID);
      }
    });

    const queryParams = new URLSearchParams(location.search);
    const uniqueTableID = queryParams.get("uniqueTableID");
    const expires = queryParams.get("expires");

    if (tableIds.includes(uniqueTableID)) {
      setIsLinkExpired(false);
    } else {
      setIsLinkExpired(true);

    }

  }

  useEffect(() => {
    checkLinkValidity();
    setIsLoading(false);
  }, [table, restaurantId, location.search]);

  function goToCartpage() {
    const newLink = `/CustomerCartpage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${restaurantId}`;
    navigate(newLink);
  }

  console.log(state.cartItemsCustomer)
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };
  console.log(isLoading)
  if (isLoading) { // display a loading indicator while isLoading is true
    return <CustomersLayout>Loading...</CustomersLayout>;
  }

  if (isLinkExpired) {
    // setIsLoading(true);
    return (
      <CustomersLayout>
        <div>This link has expired.</div>
      </CustomersLayout>
    );
  }
  return (
    <CustomersLayout>
      <div>
        <Input.Search
          placeholder="Search for items"
          size="large"
          onChange={handleSearch}
          style={{ width: '350px' }}
        />
        <Row
          gutter={20}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            minHeight: "300px", // add a minimum height
            overflow: "auto", // enable scrolling if content oveกกrflows
          }}
        >
          {itemsData
            .filter(
              (i) =>
                i.IDrestaurant === restaurantId &&
                i.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => {
              return (
                <Col span={6} xs={24} lg={6} md={12} sm={6}>
                  <div>
                    <ItemCustomers item={item} />
                  </div>
                </Col>
              );
            })}
        </Row>
      </div>
      <div className="cart-icon" style={{ position: 'fixed', bottom: '50px', right: '30px' }}>
        <Badge badgeContent={itemCount} color="secondary">
          <IconButton onClick={goToCartpage} style={{ backgroundColor: '#4D91CF', color: 'white' }}>
            <ShoppingCartIcon />
          </IconButton>
        </Badge>
      </div>
    </CustomersLayout>
  );
}

export default CustomerHomepage;
