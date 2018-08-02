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
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/contacts', function(req, res) {
  Contact.find()
    .exec()
    .then( contacts => {
      console.log("Successfully retrieved all contacts!");
      res.json({ contacts: contacts });
    })
    .catch( err => {
      console.log(err);
      res.status(404).end();
    });
});

app.post('/api/contact/create', function(req, res) {
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
    res.status(404).end();
  });
})

app.get('/api/contact/:id', function(req ,res) {
  Contact.findById(req.params.id)
    .exec()
    .then( contact => {
      res.json({ contact: contact });
    })
    .catch( err => {
      console.log(err);
      res.status(404).end();
    });
});

app.post('/api/contact/:id', function(req ,res) {
  Contact.findById(req.params.id)
    .exec()
    .then( contact => {
      Object.assign(contact, {
        name: req.body.name,
        phone: req.body.phone,
        birthday: new Date(req.body.birthday)
      });
      return contact.save();
    })
    .then( () => {
      console.log("Successfully edited contact!");
      res.end();
    })
    .catch( err => {
      console.log(err);
      res.status(404).end();
    });
});

app.delete('/api/contact/delete/:id', function(req, res) {
  Contact.findById(req.params.id)
    .exec()
    .then( contact => {
      return contact.remove();
    })
    .then( () => {
      console.log("Successfully deleted contact!");
      res.end();
    })
    .catch( err => {
      console.log(err);
      res.status(404).end();
    });
});

const port = process.env.PORT || 1337;
app.listen(port);
console.log('Server listening on port', port)
