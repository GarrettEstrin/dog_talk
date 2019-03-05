const
    express = require('express'),
    app = express(),
    path = require("path"),
    mongoose = require("mongoose"),
    dotenv = require('dotenv').config(),
    PORT = 3000,
    mongooseConnection = `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@ds347665.mlab.com:47665/dogtalk`;
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

    // require routes
    var routes = require('./routes/messageRoutes.js');
    // routes
    app.use('/message', routes)

    app.listen(process.env.PORT || PORT, function(){
        console.log("Connected on port " + PORT);
    })