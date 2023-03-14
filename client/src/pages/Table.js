import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QrCode from "react-qr-code";
import DefaultLayout from "../components/DefaultLayout";
import { v4 as uuidv4 } from 'uuid';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
function Table() {
  //const { tableID } = useParams(1);
  const [tableID, setTableID] = useState("1");
  const [uniqueTableID, setUniqueTableID] = useState(uuidv4());
  const [expirationTime, setExpirationTime] = useState(null);
  const [link, setLink] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [restaurantId, setRestaurantId] = useState(null);
  const [menu, setMenu] = useState([]);
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  useEffect(() => {
    if (expirationTime) {
      const timer = setTimeout(() => {
        setLink(null);
        setExpirationTime(null);
      }, expirationTime - Date.now());

      return () => clearTimeout(timer);
    }
  }, [expirationTime]);

  const generateLink = () => {
    const newExpirationTime = new Date(Date.now() + 10 * 60 * 1000); // 30 minutes from now
    const newLink = `http://localhost:3000/CustomersHomepage?uniqueTableID=${uniqueTableID}&tableID=${tableID}&restaurantId=${Idrestaurant}&expires=${newExpirationTime.toISOString()}`;
    setExpirationTime(newExpirationTime);
    setLink(newLink);
  };

  const cancelLink = () => {
    setLink(null);
    setExpirationTime(null);
  };

  const isLinkValid = () => {
    if (!expirationTime) return false; // link not generated yet
    if (expirationTime < Date.now()) return false; // link has expired
    return true; // link is still valid
  };

  return (
    <DefaultLayout>
      <div>
        <h3>Table {uniqueTableID}</h3>
        {isLinkValid() ? (
          <>
            <p>This link will expire at: {expirationTime.toLocaleTimeString()}</p>
            <QrCode value={link} />
            <button onClick={cancelLink}>Cancel Link</button>
          </>
        ) : (
          <>
            <p>Click the button below to generate a link.</p>
            <button onClick={generateLink}>Generate Link</button>
          </>
        )}
        {link && <p>Link: {link}</p>}
      </div>
      
    </DefaultLayout>
  );
}

export default Table;
