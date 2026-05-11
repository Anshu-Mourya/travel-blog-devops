const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  country: { type: String },
  image:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Destination", destinationSchema);