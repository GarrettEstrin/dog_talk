// user model
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let Message = new Schema({
    message: String,
    user: String,
    posted: Boolean,
},{
    timestamps: true
  })

module.exports = mongoose.model('messages', Message)