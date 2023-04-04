const express = require('express');
const dbConnect = require('./dbConnect');

const app = express();
app.use(express.json());
const menuItemsRoute = require('./routes/itemsRoute');
const userRoute = require("./routes/userRoute");
const billsRoute = require("./routes/billsRoute");
const restaurantRoute = require("./routes/restaurantRoute");
const queueRoute = require("./routes/queueRoute");
const tableRoute = require("./routes/tableRoute");

app.use('/uploads', express.static('uploads'))
app.use('/api/menuitems/', menuItemsRoute);
app.use("/api/users/", userRoute);
app.use("/api/bills/", billsRoute);
app.use("/api/restaurants/", restaurantRoute);
app.use("/api/tables/", tableRoute);
app.use("/api/queues/", queueRoute);

const path = require('path')

if(process.env.NODE_ENV==='production')
{
    app.use('/' , express.static('client/build'))
    app.get('*' , (req,res)=>{
         res.sendFile(path.resolve(__dirname , 'client/build/index.html'))
    }) 
}

const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World! from home api"));
app.listen(port, () => console.log('Node JS Server Running at port ${port}'));
