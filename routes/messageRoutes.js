const 
    express = require('express'),
    router = express.Router(),
    Message = require('../models/Message.js'),
    Conversation = require('../models/Conversation.js'),
    axios = require('axios'),
    processMessages = require('../utilities/ProcessMessages.js');

router.route('/sendMessage')

    .post(function(req, res){
        if(req.query.conversation == "new"){
            Conversation.create({
                posted: false,
                name: req.query.conversationName,
                channel: req.query.channel
            }, function(err, conversation){
                if (err) return console.log(err);
                processMessages.setConversationCron(req.query.time, conversation._id);
                let message = createMessage(req, conversation);
                res.status(200).json({
                    status: "ok",
                    message,
                    conversation
                })
                return;
            })
        } else {
            let message = createMessage(req);
            res.status(200).json({
                status: "ok",
                message
            })
        }
    })
router.route('/getMessages')
    .get(function(req, res){
        Message.find({conversation: req.query.conversation}, function(err, messages){
            res.status(200).json({
                status: "ok",
                messages
            })
        })
    })

router.route('/getMessage/:messageId')
    .get(function(req, res){
        Message.find({_id: req.params.messageId}, function(err, message){
            res.status(200).json({
                status: "ok",
                message
            })
        })
    })
router.route('/editMessage')
    .patch(function(req, res){
        Message.findByIdAndUpdate(req.query.messageId,{message: req.query.updatedMessage}, function(err, message){
            res.status(200).json({
                status: "ok"
            })
        })
    })

router.route('/deleteMessage')
    .delete(function(req, res){
        Message.findByIdAndDelete(req.query.messageId, function(err, message){
            res.status(200).json({
                status: "ok"
            })
        })
    })

router.route('/getChannels')
    .get(function(req, res){
        let url = `https://slack.com/api/conversations.list?token=${process.env[req.query.user + "TOKEN"]}&types=public_channel,private_channel`;
        axios.get(url)
        .then((axiosResponse) => {
            res.status(200).json({
                status: 'ok',
                channels: axiosResponse.data.channels
            })
        })
        .catch(function (err) {
          console.log(err);
        });
    })

module.exports = router



function createMessage(req, conversation = null){
    let conversationId;
    let channel;
    if(conversation){
       conversationId = conversation._id;
       channel = conversation.channel;
        Message.create({
            message: req.query.message,
            user: req.query.user,
            posted: false,
            conversation: conversationId,
            channel: channel
        }, 
        function(err, message){
            if (err) return console.log(err);
            return message;
        })
    } else {
        conversationId = req.query.conversation;
        Conversation.find({_id: conversationId}, (err, conversation) => {
            channel = conversation[0].channel;
            Message.create({
                message: req.query.message,
                user: req.query.user,
                posted: false,
                conversation: conversationId,
                channel: channel
            }, 
            function(err, message){
                if (err) return console.log(err);
                return message;
            })
        })
    }
}