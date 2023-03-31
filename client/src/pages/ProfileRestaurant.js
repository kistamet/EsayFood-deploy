import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DefaultLayout from '../components/DefaultLayout';
import { Button, TextField, Grid, Typography, Card, CardContent, Divider, IconButton, Avatar } from '@material-ui/core';
import { message } from 'antd';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from "axios";
import { useDispatch } from "react-redux";
import { useCallback } from 'react';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(4),
  },
  card: {
    backgroundColor: 'rgb(211, 198, 198)',
    width: 800,
    margin: 'auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  form: {
    margin: theme.spacing(2),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20),
    margin: 'auto',
  },
  icon: {
    color: theme.palette.primary.main,
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

function ProfileRestaurant() {
  const dispatch = useDispatch()
  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const classes = useStyles();

  const [username, setUsername] = useState(namerestaurant);
  const [userId, setUserId] = useState(Idrestaurant);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const UpdateAddress = () => {
    const formData = {
      namerestaurant: username,
      restaurantId: userId,
      restaurantpassword: password,
      address: address
    };
  
    dispatch({ type: "showLoading" });
  
    axios.post('/api/restaurants/update-Address', formData)
      .then(() => {
        dispatch({ type: "hideLoading" });
        message.success("Address updated successfully");
      })
      .catch(() => {
        dispatch({ type: "hideLoading" });
        message.error("Something went wrong");
      });
  };

  const handleImageUpload = (file) => {
    setImage(file);
  };

  const handleImageRemove = () => {
    setImage(null);
  };

  return (
    <DefaultLayout>
      <div className={classes.root}>
        <Typography variant="h3" className={classes.title}>
          Restaurant Profile
        </Typography>
        <Divider />
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h4" className={classes.title}>
              Edit Profile
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <form className={classes.form}>
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Username"
                    defaultValue={namerestaurant}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="User Id"
                    defaultValue={Idrestaurant}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Address"
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </form>
              </Grid>
            </Grid>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={UpdateAddress}
            >
              {loading ? "Loading..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}

export default ProfileRestaurant;