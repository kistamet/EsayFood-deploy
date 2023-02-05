import React, { useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row , Button } from 'antd';
import { Link,} from "react-router-dom";
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
  return (
    <DefaultLayout>
        <Row>
      <Col span={12}>col-12
      <Row gutter={16}>
      <Col className="gutter-row" span={6}>
      <div>
      <Button type={activeButton === 'button1' ? buttonColor : 'primary'} onClick={() => handleButtonClick('button1')}>
      <Link to="/Items">สินค้าคงคลัง</Link>
      </Button>
      <Button type={activeButton === 'button2' ? buttonColor : 'primary'} onClick={() => handleButtonClick('button2')}>
        Button 2
      </Button>
    </div>

      </Col>
      <Col className="gutter-row" span={6}>
      <Button></Button>
      </Col>
      <Col className="gutter-row" span={6}>
      <Button></Button>
      </Col>
      <Col className="gutter-row" span={6}>
      <Button></Button>
      </Col>

    </Row>
      
      </Col>
      <Col span={12}>col-12
      </Col>
      </Row>
    </DefaultLayout>
  )
}

export default Tabelrestaurant