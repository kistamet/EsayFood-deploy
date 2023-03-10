import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { IconButton } from '@mui/material';

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
    const [quantity, setQuantity] = React.useState(0);

    function addToCart() {
        dispatch({ type: 'addToCart', payload: { ...item, quantity: quantity } });
        setQuantity(1);
    }

    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={item.image} title={item.name} />
            <CardContent className={classes.content}>
                <Typography variant="subtitle1" className={classes.name}>
                    {item.name}
                </Typography>
                <Typography variant="body2" className={classes.price}>
                    {item.price} ฿
                </Typography>
            </CardContent>
            <IconButton aria-label="remove item" disabled={quantity === 0} onClick={() => setQuantity(quantity - 1)} style={{ color: '#ff0000' }}>
                <RemoveCircleIcon />
            </IconButton>
            <Typography variant="body1">{quantity}</Typography>
            <IconButton aria-label="add item" onClick={() => setQuantity(quantity + 1)} style={{ color: '#00ff00' }}>
                <AddCircleOutlineIcon />
            </IconButton>
            
        </Card>
    );
}

export default ItemCustomers;
