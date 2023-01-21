
import React, { useEffect } from 'react'
import { Button,Form, Input, Row, message ,Col} from "antd";
import '../resourses/authentication.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Register() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onFinish=(values)=>{
      dispatch({type:'showLoading'})
        axios.post('/api/users/register', values).then((res)=>{
          message.success('Registration successfull , please wait for verification')
        }).catch(()=>{
          dispatch({type:'hideLoading'})
          message.error('Something went wrong')
        })
  }
  useEffect(()=>{
    if(localStorage.getItem('pos-user'))
    navigate('/home')
  },[])
  return (
    <div className='authentication'>
        <Row>
          <Col lg={8} xs ={22}>
        <Form
            layout="vertical"
            onFinish={onFinish}
            >
              <h1><b>Easy POS</b></h1>
              <hr/>
              <h3>Register</h3>
            <Form.Item name='name' label='Name'>
            <Input  />
            </Form.Item>

            <Form.Item name='userId' label='user ID'>
              <Input  />
            </Form.Item>

            <Form.Item name='password' label='Password'>
              <Input  type='password'/>
            </Form.Item>
            <div className="d-flex justify-content-between align-items-center">
              <Link to='/login'>Already Register ? Click to login</Link>
              <Button htmlType="submit" type="primary">Register</Button>
            </div>
          </Form>
          </Col>
        </Row>
    </div>
  )
}

export default Register