const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Defining model for Shirts collection
const shirtSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },

  desc: {
    type: String,
    trim: true,
    required: true
  },

  img: {
    type: String,
    trim: true,
    required: true

  },

  genre: {
    type: String,
    trim: true,
    required: true
  },

  link: {
    type: String,
    trim: true,
    required: true
  }

});

const Shirts = mongoose.model("Shirts", shirtSchema);

module.exports = Shirts;
