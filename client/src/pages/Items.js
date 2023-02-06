import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal, Form, Input, Select, message } from "antd";

function Items() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState(null)
  const getmenuitems = JSON.parse(localStorage.getItem("pop-name-restaurant2"));
  const menuId = getmenuitems[0].menuId;

  const getAllItems = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/items/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        console.log(menuId)
        console.log(response.data._id)
        for (let i = 0; i < menuId.length; i++) {
          const response = menuId[i];
          if (menuId === response._id) {
              console.log(i);
              setItemsData(response);
              break;
          }
      }
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  const deleteItem = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/items/delete-item" , {itemId : record._id})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item deleted successdully')
        getAllItems()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.error('Something went wrong')
        console.log(error);
      });
  };

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
    }, {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => <div className="d-flex">
        <EditOutlined className="ms-2" onClick={() => {
          setEditingItem(record)
          setAddEditModalVisibilty(true)
        }} />
        <DeleteOutlined className="mx-2" onClick={()=> deleteItem(record)} />

      </div>
    },
  ];

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    if(editingItem===null)
    {
      axios
      .post("/api/items/add-item", values )
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item edited successfully')
        setEditingItem(null)
        setAddEditModalVisibilty(false)
        getAllItems()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }
    else {
      axios
      .post("/api/items/edit-item", {...values , itemId : editingItem._id})
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Item add successfully')
        setAddEditModalVisibilty(false)
        getAllItems()
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
    }

  }
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>คลังสินค้า</h3>
        <Button type="primary" onClick={() => setAddEditModalVisibilty(true)} >เพิ่มสินค้า</Button>
      </div>

      <Table columns={columns} dataSource={itemsData} bordered />
      {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingItem(null)
          setAddEditModalVisibilty(false)
        }} 
        visible={addEditModalVisibilty} 
        title={`${editingItem !==null ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}`}
        footer={false}
        >
          <Form
            initialValues={editingItem}
            layout="vertical" onFinish={onFinish}>
            <Form.Item name='name' label='ชื่อ'>
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item name='price' label='ราคา'>
              <Input placeholder="price" />
            </Form.Item>

            <Form.Item name='image' label='Image URL'>
              <Input placeholder="image" />
            </Form.Item>

            <Form.Item name='category' label='ประเภท'>
              <Select>
                <Select.Option value='อาหารจานเดียว'>อาหารจานเดียว</Select.Option>
                <Select.Option value='กับข้าว'>กับข้าว</Select.Option>

                <Select.Option value='ประเภททอด'>ประเภททอด</Select.Option>
                <Select.Option value='ประเภทต้ม'>ประเภทต้ม</Select.Option>
              </Select>
            </Form.Item>
            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">บันทึก</Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Items