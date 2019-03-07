const 
    express = require('express'),
    router = express.Router(),
    Message = require('../models/Message.js'),
    Conversation = require('../models/Conversation.js'),
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