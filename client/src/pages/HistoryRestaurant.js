import React, { useEffect, useState } from "react";
import DefaultLayout from '../components/DefaultLayout'
import { Col, Row, Button, Card, Form, Modal, Descriptions, Table, message, Select ,Divider } from 'antd';

function HistoryRestaurant() {
  const [button1Color, setButton1Color] = useState('blue');
  const [button2Color, setButton2Color] = useState('blue');
  const [button3Color, setButton3Color] = useState('blue');

  function handleButtonClick(buttonNumber) {
    switch (buttonNumber) {
      case 1:
        setButton1Color('red');
        setButton2Color('blue');
        setButton3Color('blue');
        break;
      case 2:
        setButton1Color('blue');
        setButton2Color('red');
        setButton3Color('blue');
        break;
      case 3:
        setButton1Color('blue');
        setButton2Color('blue');
        setButton3Color('red');
        break;
      default:
        break;
    }
  }
  return (
    <DefaultLayout>
    <div>
      <Button onClick={() => handleButtonClick(1)} style={{ backgroundColor: button1Color }}>
        Button 1
      </Button>
      <Button onClick={() => handleButtonClick(2)} style={{ backgroundColor: button2Color }}>
        Button 2
      </Button>
      <Button onClick={() => handleButtonClick(3)} style={{ backgroundColor: button3Color }}>
        Button 3
      </Button>
    </div>



    <div>ประวัติการขาย</div>




    </DefaultLayout>
  )
}

export default HistoryRestaurant