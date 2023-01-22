import { Button } from 'antd'
import React from "react";
import { useDispatch } from 'react-redux';

function Item({item}) {
    const dispatch = useDispatch()
    function addToCart(){
        dispatch({type:'addToCart' , payload : {...item , quantity :1}})
    }
    return (
        <div className='item-customer'>
            <img src={item.image} alt="" height='100' width='100'/>
            <h4 className='name'>{item.name}
            <h4 className='price'><b>Price : </b>{item.price} Bath</h4>
            </h4>
            <Button onClick={()=>addToCart()}>Add To Cart</Button>

            </div>
    )
}

export default Item