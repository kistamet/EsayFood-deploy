import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
    DeleteOutlined,
    EditOutlined
  } from "@ant-design/icons";
import { useCallback } from 'react';
import { Table } from "antd";

function Items() {
    const [itemsData, setItemsData] = useState([]);
    const dispatch = useDispatch();
    const getAllItems = useCallback(() => {
      dispatch({ type: "showLoading" });
      axios
        .get("/api/items/get-all-items")
        .then((response) => {
          dispatch({ type: "hideLoading" });
          setItemsData(response.data);
        })
        .catch((error) => {
          dispatch({ type: "hideLoading" });
          console.log(error);
        });
    }, [dispatch]);
  
    const columns = [
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "image",
          dataIndex: "image",
          render: (image, record) => (
            <img src={image} alt="" height="60" width="60" />
          ),
        },
        {
          title: "Price",
          dataIndex: "price",
        },
        {
        title: "Category",
        dataIndex: "category",
      },
        {
          title: "Actions",
          dataIndex: "_id",
          render: (id, record) => <div className="d-flex"> 
            <DeleteOutlined className="mx-2" />
            <EditOutlined className="ms-2" />
          </div>
        },
      ];

      useEffect(() => {
        getAllItems();
      }, [getAllItems]);
    return (

        <DefaultLayout>
            <h3>Items</h3>
            <Table columns={columns} dataSource={itemsData} bordered />
        </DefaultLayout>

    )
  }
  
  export default Items