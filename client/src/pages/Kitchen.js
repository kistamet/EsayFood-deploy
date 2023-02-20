import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Button, Divider, Table } from 'antd';
import axios from 'axios'
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
function Kitchen() {
  const [orderData, setOrderData] = useState([]);
  const dispatch = useDispatch();

  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const getAllorder = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/bills/get-all-order")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setOrderData(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  const ArraykeepButton = orderData.find((i) => i.cartItems)
  const timeTableArraykeepButton = ArraykeepButton?.cartItems.find(item => {
    return item.name ; // replace with your desired search value
  });
  console.log(timeTableArraykeepButton)


  useEffect(() => {
    getAllorder();
  }, [getAllorder]);

  const columns = [
    {
      title: 'รายการ',
      dataIndex:  'name', 
      render: (text) => <a>{text}</a>,
      width: '50%',
    },
    {
      title: 'โต๊ะ',
      dataIndex: 'table',
    },
    {
      title: 'จำนวน',
      dataIndex: 'address',
      width: '15%',
    },
    {
      title: 'สถานะ',
      dataIndex: 'address',
      width: '20%',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
    
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const [selectionType, setSelectionType] = useState('checkbox');
  return (
    <DefaultLayout>
    <div className="d-flex justify-content-between" >
    <h3>ครัว</h3>
    <div class="d-flex justify-content-center">
    <Button className="d-flex justify-content-center"
          type="primary"
          style={{ marginLeft: "20px",  width: '200px' , height:'50px',  fontSize: "25px", backgroundColor: "blue" 
          }}  >กำลังทำ</Button>
    <Button className="d-flex justify-content-center"
          type="primary"
          style={{ marginLeft: "20px", width: '150px' , height:'50px', fontSize: "25px", backgroundColor: "green" 
          }}  >เสร็จแล้ว</Button>
    <Button className="d-flex justify-content-center"
          type="primary"
          style={{ marginLeft: "20px" ,  width: '150px' , height:'50px', fontSize: "25px" , backgroundColor: "red" 
          }}  >หมด</Button>
    </div>
    </div>


    <div>

      <Divider />

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={orderData.filter((i) => i.IDrestaurant === getIdrestaurant)} bordered />
    </div>
    </DefaultLayout>
  )
}

export default Kitchen
