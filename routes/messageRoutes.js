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
                name: req.query.conversationName
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

router.route('/getConversations')
    .get(function(req, res){
        Conversation.find({posted: false}, function(err, conversations){
            if(err) return console.log(err)
            res.status(200).json({
                status: "ok",
                conversations
            })
        })
    })

module.exports = router



function createMessage(req, conversation = null){
    let conversationId;
    if(conversation){
       conversationId = conversation._id;
    } else {
        conversationId = req.query.conversation;
    }
    Message.create({
        message: req.query.message,
        user: req.query.user,
        posted: false,
        conversation: conversationId
    }, 
    function(err, message){
        if (err) return console.log(err);
        return message;
    })
}