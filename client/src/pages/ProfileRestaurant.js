import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DefaultLayout from '../components/DefaultLayout';
import { Button, TextField, Grid, Typography, Card, CardContent, Divider, IconButton, Avatar } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import axios from "axios";

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
  const namerestaurant = JSON.parse(localStorage.getItem("pop-name-restaurant"));
  const getIdrestaurant = JSON.parse(localStorage.getItem("pop-ID-restaurant"));
  const [Idrestaurant, setIdrestaurant] = useState(getIdrestaurant);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const classes = useStyles();

  const updateRestaurant = async () => {
    setLoading(true);
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    formData.append('name', namerestaurant);
    formData.append('id', Idrestaurant);

    try {
      const res = await axios.put(`http://localhost:3001/restaurant/${Idrestaurant}`, formData);
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="User Id"
                    defaultValue={Idrestaurant}
                    onChange={(e) => setIdrestaurant(e.target.value)}
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Password"
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Confirm Password"
                  />
                  <TextField
                    className={classes.input}
                    fullWidth
                    label="Address"
                    required
                  />
                </form>
              </Grid>
            </Grid>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={updateRestaurant}
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