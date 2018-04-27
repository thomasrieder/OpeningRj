var ip = location.host;
var socket = io.connect(ip);

socket.on('welcome', function(step){

    $('.admin-content').css('opacity', '1')
    $('.wait').remove();
    setColorButton(step);
});

socket.on('nbUserChange',function(data){
    

    $('.info').html(data.nbVid+'/'+data.nbUser);
})

socket.on('stepSetted',function(data){
    
    if(data.txtIsHide){

        $('.hide-txt').html('show text');
    }else{

        $('.hide-txt').html('hide text');
    }
    
})

$(document).ready(function(){
    
    $('.wait').css({
        top: ($(document).height()/2) - ($('.wait').height() / 2)
    });

    socket.emit('newAdmin');
});

$('.step-button').click(function(){
    
    setStep($(this).attr('step'));
    
    setColorButton($(this).attr('step'));
});

function setStep(newStep){

    socket.emit('setStep', {step: newStep});
}

function setColorButton(step){

    $('.step-button').css('background-color', 'lightGrey');
    $('button[step="'+step+'"]').css('background-color', 'green');

}

function ee(){
    bb();
    $('#ee').html('<h1><br>ça fait les couleurs du portugal<br></h1><h2>Bonne soirée :*</h2>');
}
var k = 0;
function bb(){

    if(k == 0){

        $('body').css('background-color', 'red');
        $('#ee').css('color', 'green');
        k = 1;
    }else{

        $('body').css('background-color', 'green');
        $('#ee').css('color', 'red');
        k = 0;
    }

    setTimeout(function(){
        
        bb();
    },600);
}