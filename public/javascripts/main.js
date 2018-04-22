$(function (){
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#menu').addClass("normal");
        } else {
            $("#menu").removeClass("normal");
        }
    });
});