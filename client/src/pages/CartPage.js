import React from "react";
import { useSelector } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { Table } from "antd";
import { DeleteOutlined } from '@ant-design/icons'

function CartPage() {
    const {cartItems} = useSelector(state=>state.rootReducer)
    const columns = [
        {
            title : 'Name' ,
            dataIndex : 'name'

        },
        {
            title : 'image',
            dataIndex : 'image',
            render : (image , record)=> <img src = {image} alt="" height='60' width='60'/>
        },
        {
            title : 'Price',
            dataIndex : 'price'
        },
        {
            title : 'Quantity'   
        },
        {
            title :'Actions' ,
            dataIndex : '_id',
            render:(id , record)=> <DeleteOutlined />
        }
    ]
    return (
        <DefaultLayout>
            <h3>cart</h3>
            <Table columns={columns} dataSource={cartItems} bordered />
        </DefaultLayout>
    )
}
export default CartPage