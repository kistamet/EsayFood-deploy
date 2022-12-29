const mongoose = require('mongoose')

const URL = 'mongodb+srv://kistamet:kistamet1234@cluster0.d6zvby6.mongodb.net/Easypos'

mongoose.connect(URL)

let connectionObj = mongoose.connection

connectionObj.on('connected' , ()=>{
    console.log('Mongo DB Connection Successfull')
})

connectionObj.on('error' , ()=>{
    console.log('Mongo DB Connection Failed')
})