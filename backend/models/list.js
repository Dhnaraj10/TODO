//backend\models/list.js
const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  user: [{
    type: mongoose.Types.ObjectId,
    ref: "User"
  }],
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: "General"
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  recurring: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null
    },
    startDate: {
      type: Date,
      default: null
    },
    endDate: {
      type: Date,
      default: null
    }
  }
}, { timestamps: true }); 

module.exports = mongoose.model("List", listSchema);