const express = require('express');
const dbConnect = require('./dbConnect');

const app = express();
app.use(express.json());
const itemsRoute = require('./routes/itemsRoute');
const userRoute = require("./routes/userRoute");
const billsRoute = require("./routes/billsRoute");
const restaurantRoute = require("./routes/restaurantRoute");

app.use('/api/items/', itemsRoute);
app.use("/api/users/", userRoute);
app.use("/api/bills/", billsRoute);
app.use("/api/restaurants/", restaurantRoute);

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Node JS Server Running at port ${port}`)
});
