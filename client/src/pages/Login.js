import React from 'react'
import { Button,Form, Input, Row, message ,Col} from "antd";
import { Link } from 'react-router-dom';
// import '.../resourses/authentication.css'

function Login() {

    const onFinish=(Values)=>{
        console.log(Values)
    }
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

            <Form.Item name='userid' label='user ID'>
              <Input  />
            </Form.Item>

            <Form.Item name='password' label='Password'>
              <Input  type='password'/>
            </Form.Item>
            <div className="d-flex justify-content-between align-items-center">
              <Link to='/register'> Not yet Register ? Click to Login </Link>
              <Button htmlType="submit" type="primary" >
                Register</Button>
            </div>
          </Form>
          </Col>
        </Row>
    </div>
  )
}

export default Login