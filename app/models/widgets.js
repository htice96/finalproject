const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const widgetSchema = new Schema({
  todo: { type: String, required: true },
  details: { type: String },
  dateDue: { type: Date, required: true },
  dateCreated: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Todo", "In Process", "Done"],
    default: "Todo",
  },
});
module.exports = mongoose.model("todos", widgetSchema);
