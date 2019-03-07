// conversation model
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let Conversation = new Schema({
    posted: Boolean,
    name: String,
    channel: String
},{
    timestamps: true
  })

module.exports = mongoose.model('conversations', Conversation)