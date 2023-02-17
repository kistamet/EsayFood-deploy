import React, { useState, useEffect } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { Button, Form, Input, Row, message, Col , Divider } from "antd";
import axios from "axios";

function ProfileRestaurant() {
  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const [loading, setLoading] = useState(false);

  const updateRestaurant = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/restaurant/${Idrestaurant}`, {
        Idrestaurant
      });
      message.success('Successfully updated restaurant details');
    } catch (error) {
      message.error('Failed to update restaurant details');
    }
    setLoading(false);
  };
  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h3>Restaurant Profile</h3>
      </div><Divider />
      <Col span={8}>
        <Form layout="vertical">
          <Form.Item label="Username" name="username">
            <Input defaultValue={namerestaurant} />
          </Form.Item>
          <Form.Item label="User Id" name="userID">
            <Input defaultValue={Idrestaurant} onChange={e => setIdrestaurant(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password" name="Password">
            <Input />
          </Form.Item>
          <Form.Item label="Confirm Password" name="Confirm Password">
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="Address">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading} onClick={updateRestaurant}>Update</Button>
          </Form.Item>
        </Form>
      </Col>
    </DefaultLayout>
  );
}

export default ProfileRestaurant;