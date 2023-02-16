import React, { useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Divider, Descriptions, Table , message } from 'antd';
import "../resourses/Tabel.css";
import {
  PlusCircleOutlined,
  CheckSquareOutlined,
  QrcodeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch , useSelector } from "react-redux";

function Tabelrestaurant() {
  const dispatch = useDispatch()
  const [activeTabel, setActiveTabel] = useState(null);
  const [keepButton, setKeepButton] = useState(null);
  const [buttonColor, setButtonColor] = useState('primary');
  const [buttonColor2, setButtonColor2] = useState('primary');
  const { cartItems } = useSelector((state) => state.rootReducer);
  console.log(cartItems)
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);

  const handleButtonClick = (buttonName) => {
    if (activeTabel === buttonName) {
      setActiveTabel(null);
      setButtonColor('primary');
      console.log('if')
    } else {
      setActiveTabel(buttonName);
      setButtonColor('danger');
      console.log('else')
      console.log(activeTabel)
      
    }
  };
  const handleButtonClick2 = () => {
    console.log(activeTabel)
    setActiveTabel(activeTabel);
    setButtonColor2('red');
  };
  const onFinish = (values) => {
    dispatch({ type: "showLoading" });
      axios
      .post("/api/restaurants/add-tabel",{...values , Idrestaurant : Idrestaurant ,tabel : activeTabel ,status:"active" } )
      .then((response) => {
        dispatch({ type: "hideLoading" });
        message.success('Tabel add successfully')
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        message.success('Somthing went wrong')
        console.log(error);
      });
  }

  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      key: i,
      name: `กระเกรา ${i}`,
      age: 32,
      address: `1. ${i}`,
    });
  }

  const columns = [
    {
      title: 'รายการ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ราคา',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'จำนวน',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'รวม',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'สถานะ',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <DefaultLayout>
      <Row>
        <Col span={12}><h3>โต๊ะอาหาร</h3>
          <Row gutter={16}>
            <Col span={22}  >
              <div >
                <Button className={`${activeTabel === 'A1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A1')} >
                  A1
                </Button>
                <Button className={`${activeTabel === 'A2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A2')}  >
                  A2
                </Button>
                <Button className={`${activeTabel === 'A3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('A3')}>
                  A3
                </Button>
                <Button className={`${activeTabel === 'B1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B1')}>
                  B1
                </Button>
                <Button className={`${activeTabel === 'B2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B2')}>
                  B2
                </Button>
                <Button className={`${activeTabel === 'B3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('B3')}>
                  B3
                </Button>
                <Button className='button'  style={{ fontSize: '40px' , backgroundColor: buttonColor2 }} onClick={() => handleButtonClick('button7')}  >
                  7
                </Button>
              </div>
            </Col>


          </Row>

        </Col>
        <Col span={12}>
          <Row gutter={12}>
            <Col span={26}>
              <Card title="รายละเอียด" bordered={false} className="custom-card">

                <Col span={26} >
                  <Descriptions labelStyle={{ fontSize: '20px' }}>
                    <Descriptions.Item label="โต๊ะ" style={{ fontSize: '20px' }}>{activeTabel}</Descriptions.Item>
                    <Descriptions.Item label="รายการ">2</Descriptions.Item>
                    <Descriptions.Item label="ราคา">300</Descriptions.Item>
                    <Descriptions.Item label="จำนวนคน">2</Descriptions.Item>
                    <Descriptions.Item label="เวลามา" style={{ fontSize: '20px' }}>18:29</Descriptions.Item>
                  </Descriptions>
                </Col>

              </Card>
            </Col>
          </Row>
          <Col span={24}>
            <Row gutter={[8, 8]}>
              <Col span={6} >
                <Button className="custom-button" onClick={() => onFinish()}>
                  <PlusCircleOutlined style={{ fontSize: '40px' }} />
                  <span>เพิ่ม</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button">
                  <QrcodeOutlined style={{ fontSize: '40px' }} />
                  <span>เพิ่ม</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button">
                  <DeleteOutlined style={{ fontSize: '40px' }} />
                  <span>ยกเลิก</span>
                </Button>
              </Col>
              <Col span={6} >
                <Button className="custom-button">
                  <CheckSquareOutlined style={{ fontSize: '40px' }} />
                  <span>เช็คบิล</span>
                </Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              dataSource={data}
              pagination={false}
              scroll={{
                y: 200,
              }}
              bordered={true}
            />
          </Col>
          <div className="d-flex justify-content-end" style={{ backgroundColor: '#13AAFF' , border: '2px solid black' }}>
            <div class="p-2" style={{ fontSize: '25px' }}>ราคารวม :</div>
            <div class="p-2" style={{ fontSize: '25px' }}>200</div>
          </div>
        </Col>
      </Row>
    </DefaultLayout>
  )
}

export default Tabelrestaurant