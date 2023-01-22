const express = require('express');
const dbConnect = require('./dbConnect');

const app = express();
app.use(express.json());
const itemsRoute = require('./routes/itemsRoute');
const userRoute = require("./routes/userRoute");

app.use('/api/items/', itemsRoute);
app.use("/api/users/", userRoute);
const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Node JS Server Running at port ${port}`)
});
