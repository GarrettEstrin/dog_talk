const   
    Message = require('../models/Message.js'),
    Conversation = require('../models/Conversation.js'),
    axios = require('axios'),
    schedule = require('node-schedule'),
    moment = require('moment');

let ProcessMessages = {
    checkForMessages: (conversationId, firstMessage = true) => {
        Message.find({conversation: conversationId, posted: false}, function (err, messages) {
            if(messages.length > 0){
                if(firstMessage){
                    ProcessMessages.sendMessage(messages[0]);
                } else {
                    ProcessMessages.setMessageCron(messages[0]);
                }
            } else {
                return;
            }
        }).sort({ "date_time" : 1 }).limit(1)
    },

    sendMessage: (messageObj) => {
        let url = ProcessMessages.buildUrl(messageObj.message, messageObj.user);
        axios.post(url)
          .then(function (res) {
            Message.findOneAndUpdate({ _id: messageObj._id}, {$set: { posted: true}}, function(err, message){
                if (err) { throw err; }
                ProcessMessages.checkForMessages(message.conversation, false);
            });
            return;
          })
          .catch(function (err) {
            console.log(err);
          });
    },

    buildUrl: (message, user) => {
        let encodedMessage = encodeURIComponent(message);
        return `https://slack.com/api/chat.postMessage?token=${process.env[user + "TOKEN"]}&channel=testing2&text=${encodedMessage}&as_user=true&pretty=1`
    },

    randomTimeBetweenMessagesInSeconds: () => {
        let rand = Math.random() * (60 - 20) + 20
        return Math.round(rand);
    },

    setConversationCron: (startTime, conversationId) => {
        let scheduledTime = ProcessMessages.addMinutes(startTime);
        let j = schedule.scheduleJob(scheduledTime, function(){
            ProcessMessages.checkForMessages(conversationId);
            Conversation.findOneAndUpdate({ _id: conversationId}, {$set: { posted: true}}, function(err, message){
                if (err) { throw err; }
            });
        });
        return;
    },

    setMessageCron: (messageObj) => {
        let scheduledTime = ProcessMessages.addSeconds(ProcessMessages.randomTimeBetweenMessagesInSeconds());
        let j = schedule.scheduleJob(scheduledTime, function(){
            ProcessMessages.sendMessage(messageObj);
        });
        return;
    },

    addMinutes: (minutes) => {
        return moment(new Date()).add(minutes, 'm').toDate();
    },
    
    addSeconds: (seconds) => {
        return moment(new Date()).add(seconds, 's').toDate();
    }
};

module.exports = ProcessMessages;