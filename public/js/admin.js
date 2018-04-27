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
    
    $('body').css('background-image', 'url(../img/cross.png)');
}
