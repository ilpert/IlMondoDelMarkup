$(document).ready(function () {
    
    'use strict';
    
    var hrefValue = "",
        currentMousePos = {
            x: -1,
            y: -1
        },
        windowHeight = $(window).height();

    if ( localStorage.getItem('music') == 0 ) {
            $('#music').prop('volume', 0);
            $('#music').attr('volume', 0);
            $('#music-button').css('opacity', 0.5);
    }


    $("#update").click(function () {
        document.getElementById('pickup').play();
        var text = $('textarea#htmlcommand').val();
        $("div#sandbox").html(text);
        //console.log($("div#sandbox a").length)
        if ($("div#sandbox a").length > 0) {
            hrefValue = $("div#sandbox a").attr('href');
            console.log(hrefValue);
        }
		$('div#sandbox').children("div").addClass( "platform obstacle" );
		$('div#sandbox').children("a").addClass( "" ); //portal
		$('div#sandbox').children("p").addClass( "platform obstacle move-up-down" ); //elevator?
		$('div#sandbox').children("span").addClass( "platform-no-bottom obstacle" ); //no collider on bottom
		$('div#sandbox').children("img").addClass( "" );
		$('div#sandbox').children().hide().fadeIn(500);
        Collision.updateObstacles('obstacle');
    });

	$('#restart-button').click(function(){
		localStorage.setItem('level', 0);
		location.reload();		
	});

    /* Code for toggle Music */
    $('#music-button').click(function () {
        var volume = $('#music').attr('volume');
        if (volume === "1") {
            $('#music').prop('volume', 0);
            $('#music').attr('volume', 0);
            $('#music-button').css('opacity', 0.5);
	    localStorage.setItem('music', 0);
        }
        if (volume === "0") {
            $('#music').prop('volume', 1);
            $('#music').attr('volume', 1);
            $('#music-button').css('opacity', 1);
	    localStorage.setItem('music', 1);
        }
    });

  /* Code for mouse position tooltip */
  $(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    var targetId = event.target.id;
    var targetClass = event.target.className;
    $('.tooltip').css('left', event.pageX + 10).css('top', event.pageY + 10).css('display', 'block');
    $('.tooltip').html( "X: " + currentMousePos.x + "px, Y: " + (windowHeight - currentMousePos.y) + "px" +
                                "<div style='text-align:left;padding-left:8px;'>ID: " + targetId + " </div>" +
                                "<div style='text-align:left;padding-left:8px;''>Class: " + targetClass + "</div>"
                            );
  });
});
