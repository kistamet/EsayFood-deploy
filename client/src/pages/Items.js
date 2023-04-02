import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined
} from "@ant-design/icons";
import { useCallback } from 'react';
import { Button, Table, Modal, Form, Input, Select, message, Divider } from "antd";

function Items() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const dispatch = useDispatch();
  const [editingItem, setEditingItem] = useState(null)
  const [image, setImage] = useState(null);

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);


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

  const deleteItem = (record) => {
    dispatch({ type: "showLoading" });
    axios
      .post("/api/menuitems/delete-item", { itemId: record._id })
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
        <EditOutlined className="ms-2" style={{ fontSize: "20px" }} onClick={() => {
          setEditingItem(record)
          setAddEditModalVisibilty(true)
        }} />
        <DeleteOutlined className="mx-2" style={{ fontSize: "20px" }} onClick={() => deleteItem(record)} />

      </div>
    },
  ];

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('category', values.category);
    formData.append('stock', values.stock);
    formData.append('image', image); // Pass the image file to the FormData object
    formData.append('Idrestaurant', Idrestaurant);

    if (editingItem === null) {
      axios
        .post("/api/menuitems/add-item", formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          console.log(Idrestaurant)
          dispatch({ type: "hideLoading" });
          message.success('Item add successfully')
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
      formData.append('itemId', editingItem._id);
      axios.post("/api/menuitems/edit-item", formData, { ...values, itemId: editingItem._id })
        .then((response) => {
          dispatch({ type: "hideLoading" });
          message.success('Item edited successfully')
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
      <Divider />
      <Table columns={columns} dataSource={itemsData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
      {addEditModalVisibilty && (
        <Modal onCancel={() => {
          setEditingItem(null)
          setAddEditModalVisibilty(false)

        }}
          visible={addEditModalVisibilty}
          title={`${editingItem !== null ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}`}
          footer={false}
        >
          <Form
            initialValues={editingItem}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="ชื่อ"
              rules={[{ required: true, message: "Please enter a name" }]}
            >
              <Input placeholder="name" />
            </Form.Item>

            <Form.Item
              name="price"
              label="ราคา"
              rules={[{ required: true, message: "Please enter a price" }]}
            >
              <Input placeholder="price" />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image"
              rules={[{ required: true, message: "Please choose an image" }]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Input
                  id="imageUpload"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  style={{ display: "none" }}
                />
                <label htmlFor="imageUpload" style={{ cursor: "pointer" }}>
                  <UploadOutlined style={{ marginRight: "8px" }} />
                  {image ? image.name : "Choose an image"}
                </label>
                <input type="hidden" name="image" value={image} />
              </div>
            </Form.Item>

            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: "Please enter a stock" }]}
            >
              <Input placeholder="Stock" />
            </Form.Item>

            <Form.Item
              name="category"
              label="ประเภท"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                <Select.Option value="อาหารจานเดียว">
                  อาหารจานเดียว
                </Select.Option>
                <Select.Option value="กับข้าว">กับข้าว</Select.Option>

                <Select.Option value="ประเภททอด">ประเภททอด</Select.Option>
                <Select.Option value="ประเภทต้ม">ประเภทต้ม</Select.Option>
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                บันทึก
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>

  )
}

export default Items