import { Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { useDispatch } from 'react-redux';

const ItemWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '25px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    '& .name': {
        margin: '10px 0',
    },
    '& .price': {
        margin: '10px 0',
    },
    '& img': {
        marginBottom: '10px',
    },
    '& .addToCartButton': {
        marginTop: '10px',
    },
});

function Item({ item }) {
    const dispatch = useDispatch();

    function addToCart() {
        dispatch({ type: 'addToCart', payload: { ...item, quantity: 1 } });
    }

    return (
        <ItemWrapper>
            <Typography variant="h6" className="name">{item.name}</Typography>
            <img src={item.image} alt="" height="100" width="100" />
            <Typography variant="subtitle1" className="price">
                <b>Price:</b> {item.price} ฿
            </Typography>
            <Button onClick={addToCart} className="addToCartButton" variant="contained" color="primary">
                Add To Cart
            </Button>
        </ItemWrapper>
    );
}

export default Item;
