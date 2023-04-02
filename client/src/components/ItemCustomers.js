import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardMedia, CardContent, Typography, Button, Box, } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { IconButton } from '@mui/material';
import { useSelector } from "react-redux";
import EditIcon from "@material-ui/icons/Edit";
import Chip from "@mui/material/Chip";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Modal } from "@mui/material";
import { TextField, InputAdornment } from "@material-ui/core";
import "../resourses/CustomersLayout.css";
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
    const [isModalEdit, setIsModalEdit] = useState(false);



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


    const itemCounts = cartItemsCustomer.reduce((counts, item) => {
        counts[item.name] = (counts[item.name] || 0) + item.quantity;
        return counts;
    }, {});
    useEffect(() => {
        localStorage.setItem("cartItemsCustomer", JSON.stringify(cartItemsCustomer));
    }, [cartItemsCustomer]);
    const [additionalDetails, setAdditionalDetails] = useState("");

    const handleAdditionalDetailsChange = (event) => {
        setAdditionalDetails(event.target.value);
    };

    const handleSave = () => {
        const payload = { ...item, quantity: 1, additionalDetails };
        dispatch({ type: 'addToCartCustomer', payload });
        setIsModalEdit(false);
    };

    return (
        <Card className={classes.card}>

            <div onClick={() => console.log("Image clicked")}>
                <CardMedia className={classes.media} title={item.name} >
                    <img src={item.image} alt="" height="100" width="100" />
                </CardMedia>
            </div>
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
                {itemCounts[item.name] > 0 && (
                    <IconButton
                        aria-label="edit item count"
                        onClick={() => setIsModalEdit(true)}
                        style={{
                            position: "absolute",
                            bottom: 30,
                            right: 30,
                            size: "10px !important",
                            backgroundColor: "white",
                        }}
                    >
                        <BorderColorIcon style={{ color: "#4D91CF" }} />
                    </IconButton>
                )}
            </Typography>
            <IconButton
                aria-label="add item"
                onClick={addToCartCustomer}
                style={{ color: "#00ff00" }}
            >
                <AddCircleOutlineIcon />
            </IconButton>
            <Modal open={isModalEdit} onClose={() => setIsModalEdit(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        padding: "20px",
                        outline: "none",
                        boxShadow: "0px 3px 20px rgba(0, 0, 0, 0.2)",
                        borderRadius: "10px",
                        textAlign: "center",
                        minWidth: "250px",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        รายละเอียดเพิ่มเติม
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="เช่น ไม่รับผัก"
                        value={additionalDetails}
                        onChange={handleAdditionalDetailsChange}
                    />
                    <Button className="edit-btn"
                        variant="contained"
                        onClick={handleSave}
                        sx={{ marginTop: "10px !important", marginRight: "10px !important" }}
                    >
                        บันทึก
                    </Button>
                    <Button className="cancel-btn"
                        variant="contained"
                        onClick={() => setIsModalEdit(false)}
                        sx={{ backgroundColor: "#fff !important", }}
                    >
                        ยกเลิก
                    </Button>
                </Box>
            </Modal>
        </Card>
    );
}

export default ItemCustomers;
