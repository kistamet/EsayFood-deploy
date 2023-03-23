import React, { useEffect, useState } from 'react';
import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios'
import { Col, Row, } from "antd";
import Item from '../components/Item';
import '../resourses/items.css'
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

function Homepage() {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); // initially "All"
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const categories = [
    {
      name: "All", // "Select All" category
      imageURL: "https://dummyimage.com/80x60/000/fff.png&text=All",
    },
    {
      name: "อาหารจานเดียว",
      imageURL:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Culinary_fruits_front_view.jpg",
    },
    {
      name: "ประเภททอด",
      imageURL:
        "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/shopping-bag-full-of-fresh-vegetables-and-fruits-royalty-free-image-1128687123-1564523576.jpg",
    },
    {
      name: "ประเภทต้ม",
      imageURL:
        "https://images.ctfassets.net/3s5io6mnxfqz/5GlOYuzg0nApcehTPlbJMy/140abddf0f3f93fa16568f4d035cd5e6/AdobeStock_175165460.jpeg?fm=jpg&w=900&fl=progressive",
    },
  ];
  const dispatch = useDispatch();
  const getAllItems = useCallback(() => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/menuitems/get-all-items")
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setItemsData(response.data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);
console.log(itemsData)
  return (
    <DefaultLayout>
      <div className="d-flex categories">
        {categories.map((category) => {
          return (
            <div
              onClick={() => setSelectedCategory(category.name)}
              className={`d-flex category ${selectedCategory === category.name && "selected-category"
                }`}
            >
              <h4>{category.name}</h4>
              <img src={category.imageURL} height="60" width="80" alt="" />
            </div>
          );
        })}
      </div>
      <Row gutter={20}>
        {itemsData
          .filter(
            (i) =>
              (selectedCategory === "All" || i.category === selectedCategory) && // check for "All" category
              i.IDrestaurant === Idrestaurant && i.stock > 0
          )
          .map((item) => {
            return (
              <Col span={6} xs={24} lg={6} md={12} sm={6}>
                <Item item={item} />
              </Col>
            );
          })}
      </Row>
    </DefaultLayout>
  );
}



export default Homepage