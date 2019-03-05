const 
    express = require('express'),
    router = express.Router(),
    Message = require('../models/Message.js'),
    processMessages = require('../utilities/ProcessMessages.js');

router.route('/sendMessage')

    .post(function(req, res){
        Message.create({
            message: req.query.message,
            user: req.query.user,
            posted: false
        }, 
        function(err, message){
            if (err) return console.log(err);
            Message.find({ posted: false}, function (err, messages) {
                if(messages.length == 1){
                    processMessages.setCron(req.query.conversationStartTime);
                }
            })
            res.status(200).json({
                status: "ok",
                message
            })
            return;
        })
    })

module.exports = router