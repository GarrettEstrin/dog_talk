const   
    Message = require('../models/Message.js'),
    axios = require('axios')

let ProcessMessages = {
    checkForMessages: () => {
        console.log("checking for messages");
        Message.find({ posted: false}, function (err, messages) {
            if(messages.length > 0){
                ProcessMessages.sendMessage(messages[0]);
            } else {
                return;
            }
        }).sort({ "date_time" : 1 }).limit(1)
    },

    sendMessage: (messageObj) => {
        let url = ProcessMessages.buildUrl(messageObj.message, messageObj.user);
        axios.post(url)
          .then(function (response) {
            Message.findOneAndUpdate({ _id: messageObj._id}, {$set: { posted: true}}, function(err, message){
                if (err) { throw err; }
                else { console.log("Updated"); }
            });
            return;
          })
          .catch(function (error) {
            ProcessMessages.checkForMessages();
          });
    },

    buildUrl: (message, user) => {
        let encodedMessage = encodeURIComponent(message);
        return `https://slack.com/api/chat.postMessage?token=${process.env[user + "TOKEN"]}&channel=testing&text=${encodedMessage}&as_user=true&pretty=1`
    },

    randomTimeBetweenMessages: () => {
        var rand = Math.floor(Math.random() * (3 - 10 + 1) + 1);
        return rand * 1000;
    },

    setCron: (startTime) => {
        console.log(startTime);
    }
};

module.exports = ProcessMessages;