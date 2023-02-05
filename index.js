const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'))
// require('./config/db')
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery',true).connect(process.env.MONGOURI)
.then(response => {
    console.log('MongoDB connection established')
})
.catch(err => {
    console.log('MongoDB connection error: ' + err)
})

const api_routes = require('./ApiRoutes')
app.use('/api', api_routes)

app.use((req,res,next) => {
    return next({
        msg: "Not Found",
        status: 400
    })
})

app.use((error,req,res,nect) => {
    return res.json({
        msg: error.message || error.msg || error,
        status: error.status || 400
    })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('listening on PORT ', PORT)
})