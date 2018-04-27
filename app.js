//TEEEEEEEEEEEEEEEEEEEEEEEEEEEESSSTTTT
var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require('fs');
var path = require('path');


server.listen(80);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    
    res.sendFile(path.join(__dirname+'/public/pages/user.html'));

})
.get('/admin', function(req, res){
    
    res.sendFile(path.join(__dirname+'/public/pages/admin.html'));

})
.get('/display', function(req, res){
    
    res.sendFile(path.join(__dirname+'/public/pages/display.html'));

})
.use(function(req, res, next){
    
});


/**
 * STEP:
 * 0 -> welcome
 * 100 -> yellow screen
 * 105 -> veille
 * 106 -> hide text
 * 110 -> half of clients
 * 210 -> show Cross
 * 1 -> question 1
 * 2 -> question 2
 * 3 -> question 3
 * 4 -> question 4
 * 10 -> question draw logo
 * 20 -> question play video
 * 30 -> question draw signatur
 */

var idDisplay;
var idAdmin =[];
var step = 0;
var winner = [];
var users = [];
var nbVideoLoaded = 0;
var txtIsHide = 0;

io.on('connection', function(socket){

    socket.on('newUser', function(){
        
        console.log('new user');
        
        users.push(socket);
        
        if(winner.length < 10){
            
            winner.push(socket.id);
        }
        socket.emit('welcome', step);
    
        for(var i = 0; i < idAdmin.length; i++){
            
            socket.to(idAdmin[i]).emit('nbUserChange', {nbUser: users.length, nbVid: nbVideoLoaded});
        }

    });

    socket.on('disconnect', function () {
        
        var i = users.indexOf(socket);

        console.log(users.indexOf(socket));
        
        if(nbVideoLoaded > 0 && users.indexOf(socket) != -1){
            
            nbVideoLoaded--;
        }

        if(users.indexOf(socket) != -1){

            users.splice(i, 1);
        }
        
    
        for(var i = 0; i < idAdmin.length; i++){
            
            socket.to(idAdmin[i]).emit('nbUserChange', {nbUser: users.length, nbVid: nbVideoLoaded});
        }
    });

    socket.on('videoLoaded', function(){
        
        nbVideoLoaded++;
        
        for(var i = 0; i < idAdmin.length; i++){
            
            socket.to(idAdmin[i]).emit('nbUserChange', {nbUser: users.length, nbVid: nbVideoLoaded});
        }
    });

    socket.on('newAdmin', function(){
        
        console.log('admin: '+nbVideoLoaded+'/'+users.length);
        
        socket.emit('nbUserChange', {nbUser: users.length, nbVid: nbVideoLoaded});

        idAdmin.push(socket.id);
        socket.emit('welcome', step);
    });

    //get the id of the display client 
    socket.on('setDisplay', function(){
        
        idDisplay = socket.id; 
        socket.emit('welcome', step);  
    });

    socket.on('setStep', function(data){
        
        step = data.step;

        console.log('step: '+step);
        
        if(step == 106){
            
            if(txtIsHide){

                txtIsHide = 0;
            }else{
                txtIsHide = 1;
            }
        }
        socket.emit('stepSetted', {step: step, txtIsHide: txtIsHide});
        socket.broadcast.emit('setUserStep', {step: step, txtIsHide: txtIsHide});
    });

    socket.on('sendImage', function(data){
        
        var width = data.w;
        var height = data.h;
        
        var img = data.img;
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        socket.to(idDisplay).emit('newImage', {img: img, w: width, h: height});
    });
});