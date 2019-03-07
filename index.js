const
    express = require('express'),
    app = express(),
    path = require("path"),
    mongoose = require("mongoose"),
    dotenv = require('dotenv').config(),
    PORT = 3000,
    messageRoutes = require('./routes/messageRoutes.js'),
    conversationRoutes = require('./routes/conversationRoutes.js'),
    mongooseConnection = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}${process.env.MONGOADDRESS}`;
    mongooseOptions = {
        useNewUrlParser: true
    }
    mongoose.connect(mongooseConnection, mongooseOptions, function(err) {
    if(err) return console.log(err)
        console.log("Connected to MongoDB");
    })

    app.use(express.static('public'))

    app.get('/', function(req, res){
        res.sendFile(path.join(__dirname+'/index.html'));
    })
    app.get('/test', function(req, res){
        res.sendFile(path.join(__dirname+'/test.html'));
    })
    // Apply Routes
    app.use('/message', messageRoutes);
    app.use('/conversation', conversationRoutes);

    app.listen(process.env.PORT || PORT, function(){
        console.log("Connected on port " + PORT);
    })