import React, { useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Divider, Descriptions, Table } from 'antd';
import "../resourses/Tabel.css";
import {
  PlusCircleOutlined,
  CheckSquareOutlined,
  QrcodeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

function Tabelrestaurant() {
  const [activeButton, setActiveButton] = useState(null);
  const [buttonColor, setButtonColor] = useState('primary');

  const handleButtonClick = (buttonName) => {
    if (activeButton === buttonName) {
      setActiveButton(null);
      setButtonColor('primary');
    } else {
      setActiveButton(buttonName);
      setButtonColor('danger');
    }
  };
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
              <div>
                <Button className={`${activeButton === 'button1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button1')}>
                  A1
                </Button>
                <Button className={`${activeButton === 'button2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button2')}>
                  A2
                </Button>
                <Button className={`${activeButton === 'button3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button3')}>
                  A3
                </Button>
                <Button className={`${activeButton === 'button4' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button4')}>
                  B1
                </Button>
                <Button className={`${activeButton === 'button5' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button5')}>
                  B2
                </Button>
                <Button className={`${activeButton === 'button6' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button6')}>
                  B3
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
                    <Descriptions.Item label="โต๊ะ" style={{ fontSize: '20px' }}>A1</Descriptions.Item>
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
                <Button className="custom-button">
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