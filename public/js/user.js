var ip = location.host;
var socket = io.connect(ip);

//update the interface to the current step
socket.on('welcome', function(currentStep){

    setStep(currentStep);
    downloadVideo();
});

$(document).ready(function(){

    if(browserIsOk()){

        socket.emit('newUser');
    }else{

        socket.disconnect();
        changeBrowser();
    }

    //disable scroll refresh
    $('.page').on('touchmove', function(e){

        e.preventDefault();
    }
  );


});

socket.on('setUserStep', function(data){
    
    txtIsHide = data.txtIsHide;    
    setStep(data.step);
});

//ask confirmation before refresh or quit the app
// window.onbeforeunload = function() {
    
//     return "quit message";
// };

function changeBrowser(){
    
    //alert('1googlechrome://navigate?url='+ip);
    // $('.page-welcome').html('<h1>:(</h1><br><h2>L\'expérience ne va pas marcher sur ce navigateur...</h2><br><h3>Avez-vous Google Chrome ?</h3><br><h3><a ontouchstart="alert();" class="link-chrome" href="googlechrome://navigate?url='+ip+'">ouvrir dans Google Chrome</a></h3>');
    $('body').html('<h1>:(</h1><br><h2>L\'expérience ne va pas marcher sur ce navigateur...</h2><br><h3>Avez-vous Google Chrome ?</h3><br><h3><a class="link-chrome" href="googlechrome://navigate?url='+ip+'">ouvrir dans Google Chrome</a></h3>');
}


function setStep(step){
    
    isWaitBlink = 0;

    if(step == 0){

        setPage('page-welcome');
    }else if(step == 100){

        //begin to load video
        //downloadVideo();

        setPage('page-yellow');
    }else if(step == 105){

        setPage('page-wait');
        
        isWaitBlink = 1;
        waitBlink();

    }else if(step == 106){

        toggleText();
        isWaitBlink = 1;
        waitBlink();

    }else if(step > 0 && step < 10){
        
        setPage('page-question-'+step, step);  
        setClickButton(step);      

    }else if(step == 10){
        
        setCanvas();
        touchMove();

    }else if(step == 20){

             
        setPage('page-video');    
    }else if(step == 21){

        playVideo();
    }else if(step == 210){
        
        crossIsBlinking = 1;
        blinkCross();
        setPage('page-cross');
    }else if(step = 900){
        
        setPage('page-welcome');
        $('.page-welcome').html('<h1>Merci d\'avoir participer à ce test</h1><h2 style="margin-top: 50px;">On a quelques questions à te poser pour améliorer l\'expérience.<br><br></h2><h2>Merci de prendre quelques minutes pour ça :)</h2><br><br><h2><a  style="color: yellow;" href="https://goo.gl/forms/kxBuQPTyzEKuDEuD3">ça se passe ici</a></h2>');
    }
}

function setPage(newPage, step){

    $('.page').animate({
        'opacity': 0
    }, 500, function(){
        
        $('.page').css('display', 'none');
        $('.'+newPage).css('display', 'block');
        
        if(step >= 1 && step <= 10){
            
            setBuzzerButton(step);
        }        

        $('.'+newPage).animate({
            'opacity': 1
        }, 500, function(){
            
        }).promise().then(function(){
            
        }); 
    });
}

/**
 * BLINK CROSS
 */

var crossIsBlinking = 0;
var crossOp;
var crossTime;

function blinkCross(){

    crossOp = Math.random();
    crossTime = Math.floor(Math.random() * 60) + 10;
    console.log(crossTime);
    
    $('.page-cross').css('opacity', crossOp);
    

    setTimeout(function(){

        if(crossIsBlinking){
            blinkCross();
        }
    }, crossTime);
}

/**
 * WAIT BLINK
 */

var isWaitBlink;
var opRandom;
var txtIsHide = 0;

function waitBlink(){

    opRandom = Math.random() * 0.6;

    $('.page-wait').css('background-color', 'rgba(255, 255, 255,'+opRandom+')');

    if(isWaitBlink){
        setTimeout(function(){
            waitBlink();
        }, 100);
    }
}

function toggleText(){

    if(txtIsHide){
        
        $('#waitText').css('display', 'none');
    }else{
        $('#waitText').css('display', 'block');
    }
}

/**
 * VIDEO
 */

 function playVideo(){

    console.log('play video');
    $('#vid').css('display', 'block');
    $('.page-video').css('background-color', 'black');
    $('#vid').get(0).play();
 }

 function downloadVideo(){

    $('.page-video').append('<video muted playsinline src="https://s3.eu-central-1.amazonaws.com/rj2018/vid.mp4" id="vid" preload="auto"></video>');

    
    console.log('load video');
    
    video = $('#vid').get(0).load();
    //check if the video is ready to play
    checkVideo();
 }
 
var isLoaded = 0;

function checkVideo(){
 

    video = $('#vid').get(0)

    console.log(video.readyState);

    if(video.readyState === 1){
        
        video.pause();
    }
 
    if (video.readyState === 4){
    
        console.log('Video is loaded !');
        
        //stop the loop
        isLoaded = 1;
        //pause the video
        video.pause();
        //user feedback the video is ready
        readyToPlay();
    }
    
    setTimeout(function(){

        if(!isLoaded){
        checkVideo();
        }
        
    }, 500);
}

function readyToPlay(video){

    socket.emit('videoLoaded');
    $('.page-video').css('background-color', 'yellow');
}



/**
 * DRAW
 */

 function setCanvas(){
    
    setPage('page-draw');

    //get canvas
    var cvs = $('#cvs').get(0);

    //set size of canvas
    cvs.width = $('.page-draw').width();
    cvs.height = $('.page-draw').height();
 }

 
function touchMove(){

    var fx =[];
    var fy =[];
    var cvs = $('#cvs').get(0);
    var ctx = cvs.getContext('2d');
    
    ctx.lineJoin = "round";

    var cvsLeft = $('#cvs').position().left;
    var cvsTop = $('#cvs').position().top;

    $('#cvs').on('touchstart touchmove', function(e){
        
        fx.push(e.touches[0].pageX - cvsLeft);
        fy.push(e.touches[0].pageY - cvsTop);
        
        draw(ctx, fx, fy);
    });

    $('#cvs').on('touchend', function(){
        
        fx = [];
        fy = [];
    });
    
    $('.remove-button').click(function(){
        
        clearctx(ctx);
    });

    $('.send-button').click(function(){
       
        var imgSend = cvs.toDataURL('image/png');

        var width = $(document).width();
        var height = $(document).height();
        
        
        socket.emit('sendImage', {img: imgSend, w: width, h: height});
        
        //clearctx(ctx);
        sendFeedback();
    });
}

function sendFeedback(){

    $('.user-feedback').css('display', 'block');
    
    $('.send-button').css('display', 'none');
    $('.remove-button').css('display', 'none');

    $('.user-feedback').find('h1').css({
        'margin-top': ($('.user-feedback').height()/2) - ($('.user-feedback').find('h1').height())
    });

    $('.user-feedback').animate({
        'opacity': '0.6'
    }, 500, function(){

        // $('.user-feedback').animate({
        //     'opacity': '0'
        // }, 500, function(){
            
        //     //$('.user-feedback').css('display', 'none');
        // });
    });
}

function draw(ctx, fx, fy){
    
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;

    for(var i = 0; i < fx.length; i++){
        
        ctx.beginPath();    

        if(i){
            
            ctx.moveTo(fx[i-1], fy[i-1]);
        }else{

            ctx.moveTo(fx[i]-1, fy[i]-1);
        }

        ctx.lineTo(fx[i], fy[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

function clearctx(ctx){
    
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
}
    

/**
 * QUESTION
 */

function setBuzzerButton(step){

    var bbHeight = $('.buzzer-button-'+step).height();
    var bbtxtHeight = $('.buzzer-button-'+step).find('h2').height();

    $('.bb').find('h2').css({
        'margin-top': (bbHeight/2) - (bbtxtHeight/2)
    });
}

function setClickButton(step){

    $('.page-question-'+step).children().css({
        'opacity': '1',
        'display': 'block'
    });

    $(".buzzer-button-"+step).click(function() {
        
        var currentColor = $(this).css("background-color");
        
        var btn = $(this);
    
        $('.page-question-'+step).css('background-color', currentColor)
    
        $('.page-question-'+step).children().animate({
            'opacity': '0'
        }, 500, function(){
            $('.page-question-'+step).children().css('display', 'none');
        });
    });
}

  

/**
 * WELCOME
 */

function setWelcome(){

    $('.fs-button').css({
        'top': ($(document).height()/2)- ($('.fs-button').height()/2),
        'left': ($(document).width()/2)- ($('.fs-button').width()/2),
        'display': 'block'
    });

    $('.fs-button').click(function(){
        
        toggleFullScreen(document.body);
        $(this).addClass('fs-ok');
    });
}

function yellowSreen(){
    $('.page-welcome').children().remove();

    $('.page-welcome').css('background-color', 'yellow');
}





function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * GET BROWSER
 */
function browserIsOk(){

    if(navigator.userAgent.indexOf('Samsung') == -1){
        
        return true;
    }else{

        return false;
    }
}