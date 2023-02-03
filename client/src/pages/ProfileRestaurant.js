import React from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { Button, Table, Modal, Form, Input, Select, message } from "antd";

function ProfileRestaurant() {
    return (
        <DefaultLayout>
            <div className="d-flex justify-content-between">
                <h3>Restaurant Profile</h3>
                <Button type="primary" >เพิ่มสินค้า</Button>
            </div></DefaultLayout>
    )
}

export default ProfileRestaurant