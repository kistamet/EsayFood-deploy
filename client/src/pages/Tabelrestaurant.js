import React, { useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button } from 'antd';
import "../resourses/Tabel.css";

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
        <Col span={12}><h3>โต๊ะอาหาร</h3>
          <Row gutter={16}>
            <Col span={20}  >
              <div>
                <Button className={`${activeButton === 'button1' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button1')}>
                  Button 1
                </Button>
                <Button className={`${activeButton === 'button2' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button2')}>
                  Button 2
                </Button>
                <Button className={`${activeButton === 'button3' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button3')}>
                  Button 3
                </Button>
                <Button className={`${activeButton === 'button4' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button4')}>
                  Button 4
                </Button>
                <Button className={`${activeButton === 'button5' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button5')}>
                  Button 5
                </Button>
                <Button className={`${activeButton === 'button6' ? buttonColor : ''} button`} onClick={() => handleButtonClick('button6')}>
                  Button 6
                </Button>
              </div>
            </Col>


          </Row>

        </Col>
        <Col span={12}><h3>รายละเอียด</h3>
        </Col>
      </Row>
    </DefaultLayout>
  )
}

export default Tabelrestaurant