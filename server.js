const express = require('express');
const bodyParser = require('body-parser')
const logger = require("morgan");
const path = require('path');
const app = express();

// Mongoose
const mongoose = require('mongoose');

mongoose.connection.on("connected", function(){
  console.log("Connected to MongoDB!");
});

mongoose.connection.on("error", function(){
  console.log("Failed to connect to MongoDB.");
});

mongoose.connect(process.env.MONGODB_URI);

// Mongoose Models
const Contact = require('./models/models').Contact;

// Middleware
app.use(express.static(path.join(__dirname, 'build')));
app.use(logger('dev'));
app.use(bodyParser.json());


// Paths
app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/testing', function(req, res) {
  res.json({text: 'HELLO THERE'});
});

app.get('/contacts', function(req, res) {
  Contact.find()
    .exec()
    .then( contacts => {
      res.json({ contacts: contacts });
    });
});

app.post('/contact/create', function(req, res) {
  new Contact({
    name: req.body.name,
    phone: req.body.phone,
    birthday: new Date(req.body.birthday)
  })
  .save()
  .then( () => {
    console.log("Successfully added new contact!");
    res.end();
  })
  .catch( err => {
    console.log(err);
    res.status(404);
  });
})

app.post('/contact/:id', function(req ,res) {

});

app.post('/contact/delete/:id', function(req, res) {

});

const port = process.env.PORT || 1337;
app.listen(port);
console.log('Server listening on port', port)
