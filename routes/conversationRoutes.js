const 
    express = require('express'),
    router = express.Router(),
    Message = require('../models/Message.js'),
    Conversation = require('../models/Conversation.js'),
    processMessages = require('../utilities/ProcessMessages.js');

router.route('/getConversations')
    .get(function(req, res){
        Conversation.find({}, function(err, conversations){
            if(err) return console.log(err)
            res.status(200).json({
                status: "ok",
                conversations
            })
        })
    })

router.route('/getUnpostedConversations')
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