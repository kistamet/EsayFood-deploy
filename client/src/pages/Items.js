import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
    DeleteOutlined,
    EditOutlined
  } from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table , Modal, Form , Input, Select} from "antd";

function Items() {
    const [itemsData, setItemsData] = useState([]);
    const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
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
      },        {
        title: "คงเหลือ",
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

      const onFinish=(values)=>{
        dispatch({ type: "showLoading" });
        axios
          .post("/api/items/add-item" , values)
          .then((response) => {
            dispatch({ type: "hideLoading" });
          })
          .catch((error) => {
            dispatch({ type: "hideLoading" });
            console.log(error);
          });

      }
    return (
        <DefaultLayout>
        <div className="d-flex justify-content-between">
            <h3>Items</h3>
            <Button type="primary" onClick={()=>setAddEditModalVisibilty(true)}>Add Item</Button>
        </div>
            
            <Table columns={columns} dataSource={itemsData} bordered />
            <Modal onCancel={()=>setAddEditModalVisibilty(false)} visible={addEditModalVisibilty} title='Add New Item' footer={false}>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item name='name' label='Name'>
                    <Input placeholder="Name" />
                </Form.Item>

                <Form.Item name='price' label='Price'>
                    <Input placeholder="price" />
                </Form.Item>

                <Form.Item name='image' label='Image URL'>
                    <Input placeholder="image" />
                </Form.Item>

                <Form.Item name='category' label='Category'>
                    <Select>
                        <Select.Option value='fruits'>fruits</Select.Option>
                        <Select.Option value='vegetables'>Vegetables</Select.Option>

                        <Select.Option value='meat'>Meat</Select.Option>
                    </Select>
                </Form.Item>
                <div className="d-flex justify-content-end">
                    <Button htmlType="submit" type="primary">SAVE</Button>
                </div>
            </Form>
            </Modal>
        </DefaultLayout>

    )
  }
  
  export default Items