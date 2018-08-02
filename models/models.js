const mongoose = require("mongoose");
const connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var contactSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  phone: {
    required: true,
    type: String
  },
  birthday: {
    required: true,
    type: Date
  }
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = {
  Contact: Contact
}
