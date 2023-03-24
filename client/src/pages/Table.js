import DefaultLayout from "../components/DefaultLayout";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input , Button} from 'antd';
function Table() {

  const [buttons, setButtons] = useState([]);

  const handleAddButton = (label) => {
    setButtons([...buttons, { label }]);
  };
  return (
    <DefaultLayout>
    <Form>
      {buttons.map((button, index) => (
        <Button key={index}>{button.label}</Button>
      ))}

      <Form.Item label="Name">
        <Input
          placeholder="Enter button name"
          onPressEnter={(event) => {
            handleAddButton(event.target.value);
            event.target.value = "";
          }}
        />
      </Form.Item>
    </Form>
  </DefaultLayout>
  )
}

export default Table