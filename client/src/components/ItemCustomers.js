import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { IconButton } from '@mui/material';
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    media: {
        height: 100,
        width: 100,
    },
    content: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    name: {
        fontWeight: 'bold',
    },
    price: {
        color: theme.palette.secondary.main,
    },
}));

function ItemCustomers({ item }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const state = useSelector(state => state.rootReducer);

    
    function addToCartCustomer() {
        dispatch({ type: 'addToCartCustomer', payload: { ...item, quantity: 1 } });
    }
    function deleteFromCartCustomer(itemId, currentQuantity) {
        const updatedCartItemsCustomer = cartItemsCustomer.map((item) => {
          if (item._id === itemId) {
            return {
              ...item,
              quantity: currentQuantity - 1
            };
          }
          return item;
        }).filter((item) => item.quantity > 0);

        dispatch({ type: 'deleteFromCartCustomer', payload: { _id: itemId, quantity: currentQuantity - 1 } });
        localStorage.setItem("cartItemsCustomer", JSON.stringify(updatedCartItemsCustomer));
      }

    const cartItemsCustomer = useSelector(
        (state) => state.rootReducer.cartItemsCustomer
    );
    
    console.log(cartItemsCustomer)
    const itemCounts = cartItemsCustomer.reduce((counts, item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
        return counts;
      }, {});
      useEffect(() => {
        localStorage.setItem("cartItemsCustomer", JSON.stringify(cartItemsCustomer));
      }, [cartItemsCustomer]);
    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={item.image} title={item.name} />
            <CardContent className={classes.content}>
                <Typography variant="subtitle1" className={classes.name}>
                    {item.name}
                </Typography>
                <Typography variant="body2 " className={classes.price}>
                    {item.price} ฿
                </Typography>
            </CardContent>
            <IconButton
                aria-label="remove item"
                onClick={() => deleteFromCartCustomer(item._id)}
                style={{ color: "#ff0000" }}
            >
                <RemoveCircleIcon />
            </IconButton>
            <Typography variant="body1">
            {itemCounts[item.name] || 0}
            </Typography>
            <IconButton
                aria-label="add item"
                onClick={addToCartCustomer}
                style={{ color: "#00ff00" }}
            >
                <AddCircleOutlineIcon />
            </IconButton>
        </Card>
    );
}

export default ItemCustomers;
