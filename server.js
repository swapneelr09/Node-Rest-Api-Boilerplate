const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config.js');
const routes = require('./routes');

//Init DB Connection
mongoose.connect(config.mongodb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
.then(() => console.log('DB Connected.'))
.catch(error => { console.log(error) });




//Init app server
app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Can add https / SSL cert here using https module

// importing routes
app.use('/', routes);




app.listen(config.port, () => {
  console.log('API running on port 3001.');
});

