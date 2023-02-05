const mongoose = require('mongoose');
const {MONGOURI} = require('./prod')


// const connectDB = async() => {
//     try {
//         const conn = await mongoose.connect(MONGOURI)
//         console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
//     } catch(error) {
//         console.log(`Error: ${error.message}`.red.bold)
//         process.exit()
//     }
// }

// module.exports = connectDB;

// mongoose.set('strictQuery',true).connect(MONGOURI)
// .then(response => {
//     console.log('MongoDB Connected')
// })
// .catch(err => {
//     console.log('MongoDB Err',err)
// })