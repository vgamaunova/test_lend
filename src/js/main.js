//= libs.min.js
//= jquery.countdown.js


;function addNum(){

 var  elem = $('#number');
   var num = elem.val() || 1;
   num++;
   elem.val(num++);
	console.log(elem.val());
 
}
function minusNum(){

 var  elem = $('#number');
   var num = elem.val() || 1;
   num--;
   elem.val(num--);
   if(elem.val()>1){
	$('#btnLess').css({'cursor':'pointer'})

   }else{
	elem.val('1');
	$('#btnLess').css({'cursor':'no-drop'})

   }
 
}

$(document).ready(function(){

	 $(document).on('click','#btnMore', function (elem){	 	
		addNum();

	$('#btnLess').css({'cursor':'pointer'})
	 });
	 $(document).on('click','#btnLess', function (elem){	 	
		minusNum();
	 });


});
$(function(){
	
	var note = $('#note'),
		ts = new Date(2016, 10 ,18, 22, 10),
		newYear = true;
	console.log(ts);

	if((new Date()) > ts){
		// The new year is here! Count towards something else.
		// Notice the *1000 at the end - time must be in milliseconds
		ts = (new Date()).getTime() + 10*24*60*60*1000;
		newYear = false;
	}
		
	$('#countdown').countdown({
		timestamp	: ts,
		callback	: function(days, hours, minutes, seconds){
			
			var message = "";
			
			message += days + " day" + ( days==1 ? '':'s' ) + ", ";
			message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
			message += minutes + " minute" + ( minutes==1 ? '':'s' ) + " and ";
			message += seconds + " second" + ( seconds==1 ? '':'s' ) + " <br />";
			
			if(newYear){
				message += "left until the new year!";
			}
			else {
				message += "left to 10 days from now!";
			}
			
			note.html(message);
		}
	});
	
});

    $(".form-control").change(function() {
      if($(this).attr("type") == 'email') {
        var pattren =  /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,8}$/;
        if(pattren.test($(this).val())) {
          $(this).closest('.controls').removeClass("has-error").addClass("has-success");     
        } else {
          $(this).closest('.controls').removeClass("has-success").addClass("has-error"),
          this.value='';
        }
      } else if ($(this).attr("type") == 'text' && !$(this).hasClass("no-validator")) {
        var pattren =  /^[A-Za-zА-ЯА-я ]{3,30}$/;
        if(pattren.test($(this).val())) {
          $(this).closest('.controls').removeClass("has-error").addClass("has-success");
        } else {
          $(this).closest('.controls').addClass("has-error").removeClass("has-success"),
          this.value='' ;
        }
      }    else if($(this).attr("type") == 'tel'){
      	 var pattren =  /^[+0-9]{3,30}$/;
      	  if(pattren.test($(this).val())) {
          $(this).closest('.controls').removeClass("has-error").addClass("has-success");     
        } else {
          $(this).closest('.controls').removeClass("has-success").addClass("has-error"),
          this.value='';
        }

      }  
    });

    $(window).scroll(function () {
        var st = $(this).scrollTop();
        // if(st < 600){

	         $('.big_title').css({
	            "background-position": "-22% "+st / 10 +"%"
	        }) 
	        $('#paral_1').css({
	            "transform": "translate(0%, " + st / 10 + "%"
	        }) 
	         $('#paral_2').css({
	            "transform": "translate(0%, " + st / 20 + "%"
	        })  
	         $('#paral_3').css({
	            "transform": "translate(0%, " + st / 30 + "%"
	        }) 

        // }else if(st>600){
	         $('#paral_4').css({
	            "transform": "translate(0%, " + st / 70 + "%"
	        }) 
	         $('#paral_5').css({
	            "transform": "translate(0%, " + st / 40 + "%"
	        })

        // }else {
	         $('#paral_7').css({
	            "transform": "translate(0%, " + st / 70 + "%"
	        }) 
	         $('#paral_8').css({
	            "transform": "translate(0%, " + st / 40 + "%"
	        })  


        // }
// 
    });
    function initialize() {
        var mapContainer = document.getElementById('map-record');
        if (!mapContainer) {
            return;
        }
        var zoom = jQuery('#map-record').data('zoom');
        if (!zoom) {
            zoom = 3;
        }
        var lat = parseFloat(jQuery('#map-record').data('lat'));
        var lng = parseFloat(jQuery('#map-record').data('lng'));
        var title = jQuery('#map-record').data('title');
        var fenway = new google.maps.LatLng(lat, lng);
        var mapOptions = {
            center: fenway,
            zoom: zoom,
            scrollwheel: false
        };

        var map = new google.maps.Map(mapContainer, mapOptions);

       

        var marker = new google.maps.Marker({
            position: fenway,
            title: title,
            // icon: image

        });
        marker.setMap(map);

    }

    google.maps.event.addDomListener(window, 'load', initialize);