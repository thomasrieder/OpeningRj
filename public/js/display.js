var ip = location.host;
var socket = io.connect(ip);

$(document).ready(function(){
    
    socket.emit('setDisplay');
});

//update the interface to the current step
socket.on('welcome', function(currentStep){
    
    setStep(currentStep);
});

/**
 * SHOW QUESTIONS
 */
socket.on('setUserStep', function(data){

    setStep(data.step);
});

function setStep(step){
    
    if(step > 0 && step < 10){
        
        setQuestion(step);
    }
    if(step == 10){
        
        setImagePage();
    }
}

function animQuestion(){


}

function setQuestion(step){
    
    $('#question').slideToggle(200,function(){
        if(step == 1){
            
            $('#question').html('Question 1');
    
        }else if(step == 2){
            
            $('#question').html('Question 2');
    
        }else if(step == 3){
            
            $('#question').html('Question 3');
    
        }else if(step == 4){
            
            $('#question').html('Question 4');
        }
        
        $('#question').slideToggle(200);
    });
    
}

/**
 * SHOW IMAGES
 */

function setImagePage(){
    
    $('.page-question').css('display', 'none');
    $('.page-images').css('display', 'block');
}

socket.on('newImage', function(data){
    
    //gen an id with current time
    var id = Date.now();

    var defWidth = data.w;
    var defHeight = data.h;
    var divisor = 3;

    //add Image on html
    $('.page-images').append('<img id="'+id+'" class="image" src="'+data.img+'">');

    //gen random pos for big size
    var tmpLeftPos = Math.floor((Math.random() * ($('.page-images').width() - defWidth)) + 1);
    var tmpTopPos = Math.floor((Math.random() * ($('.page-images').height() - defHeight)) + 1);

    //set pos and display the image
    $('#'+id).css({
        'left': tmpLeftPos,
        'top': tmpTopPos,
        'width': defWidth+'px',
        'height': defHeight+'px',
        'display': 'block'
    });

    //minimize the image
    var width =  defWidth / divisor;
    var height =  defHeight / divisor;

    //gen new random pos
    var leftPos = Math.floor((Math.random() * ($('.page-images').width() - width)) + 1);
    var topPos = Math.floor((Math.random() * ($('.page-images').height() - height)) + 1);

    //anim the image
    $('#'+id).animate({
        'background-color': 'rgba(0,0,0,0)',
        'width': width,
        'height': height,
        'left': leftPos,
        'top': topPos
    }, 1000, function(){
        
        setTimeout(function(){

            $('#'+id).animate({
                'opacity': '0',
                'width': '0',
                'height': '0'
            }, 500, function(){
                $('#'+id).remove();
            });
        },3000);
    });
});