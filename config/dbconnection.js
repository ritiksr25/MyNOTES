const mongoose = require('mongoose');
require('dotenv').config();

//connection string
const dburl = process.env.MONGO_URI;
//map global promise
mongoose.Promise = global.Promise;
//connection definition
mongoose.connect(dburl, { useNewUrlParser: true })
    .then(() => { console.log('Database Connected Successfully!!') })
    .catch(err => console.log('Error in database connectivity!!'));