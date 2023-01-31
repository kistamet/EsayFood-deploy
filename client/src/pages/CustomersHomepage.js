import React, { useEffect, useState } from 'react';
import { Col, Row } from "antd";
import '../resourses/CustomersItems.css'
import CustomersLayout from '../components/CustomersLayout'
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import axios from 'axios'
import Item from '../components/ItemCustomers';

function CustomersHomepage() {
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
        <CustomersLayout>

        <Row gutter={[0, 0]}>
                {itemsData.map((item) => {
                    return <Col className='custom-col' span={1} xs={24} lg={6} md={12} sm={6}>

                        <Item item={item} />

                    </Col>

                })}
            </Row>


        </CustomersLayout>
    )
}

export default CustomersHomepage
