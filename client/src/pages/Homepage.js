import React, { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios'
import { Col, Row } from "antd";
import Item from '../components/Item';
import '../resourses/items.css'
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

function Homepage() {
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

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  // rest of the component

    return (
        <DefaultLayout>

            <Row gutter={20}>
                {itemsData.map((item) => {
                    return <Col span={6} xs={24} lg={6} md={12} sm={6}>

                        <Item item={item} />

                    </Col>

                })}
            </Row>


        </DefaultLayout>
    )
}

export default Homepage