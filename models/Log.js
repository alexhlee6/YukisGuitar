const mongoose = require("mongoose");
const Float = require('mongoose-float').loadType(mongoose, 4);
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  songName: {
    type: String,
    required: true
  },
  songNumber: {
    type: Number,
    required: true
  },
  col1: {
    type: [Float],
    required: true
  },
  col2: {
    type: [Float],
    required: true
  },
  col3: {
    type: [Float],
    required: true
  },
  col4: {
    type: [Float],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Log = mongoose.model("logs", LogSchema);