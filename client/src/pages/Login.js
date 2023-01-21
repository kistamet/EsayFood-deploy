import React, { useEffect } from 'react'
import { Button,Form, Input, Row,message ,Col} from "antd";
import '../resourses/authentication.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onFinish=(values)=>{
    dispatch({type:'showLoading'})
      axios.post('/api/users/login', values).then((res)=>{
        message.success('Login successfull')
      localStorage.setItem('pos-user', JSON.stringify(res.data))
      navigate('/home')
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
              <h3>Login</h3>

            <Form.Item name='userId' label='user ID'>
              <Input  />
            </Form.Item>

            <Form.Item name='password' label='Password'>
              <Input  type='password'/>
            </Form.Item>
            <div className="d-flex justify-content-between align-items-center">
              <Link to='/register'> Not yet Register ? Click to Login </Link>
              <Button htmlType="submit" type="primary" >
                Login</Button>
            </div>
          </Form>
          </Col>
        </Row>
    </div>
  )
}

export default Login