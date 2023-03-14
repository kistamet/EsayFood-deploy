import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomersLayout from "../components/CustomersLayout";
import { useParams } from "react-router-dom";
import { Col, Row, Input } from "antd";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import ItemCustomers from "../components/ItemCustomers";
import axios from "axios";
import { Grid } from "@mui/material";

function CustomerHomepage() {
  const [itemsData, setItemsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const { search } = useLocation();
  const { value } = useParams();
  const [restaurantId, setRestaurantId] = useState(null);
  const [table, setTable] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(search);
  const uniqueTableID = queryParams.get("uniqueTableID");
  const tableID = queryParams.get("tableID");

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
  
  useEffect(() => {
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
  }, [table, restaurantId, location.search]);
  console.log(isLinkExpired)
  if (isLinkExpired) {
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
          enterButton="Search"
          size="large"
          // onChange={handleSearch}
        />
        <Row
          gutter={20}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            minHeight: "300px", // add a minimum height
            overflow: "auto", // enable scrolling if content overflows
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
                  <ItemCustomers item={item} />
                </Col>
              );
            })}
        </Row>
      </div>
    </CustomersLayout>
  );
}

export default CustomerHomepage;
