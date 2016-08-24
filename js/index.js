var map;
//var infoWindows = [];
var report_info = {};
	
$(function() {
	document.body.addEventListener('touchmove', function(e){this.scrollTop=scrollStartPos-e.touches[0].pageY;e.preventDefault(); });
	$("#desc-popup").hide();
	
	//initial
	var myLatlng = new google.maps.LatLng(38.831033, -77.30474);
	var mapOptions = {
		zoom : 16,
		center : myLatlng,
		minZoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	$("#desc-popup-close").click(function() {
		$("#desc-popup").hide();
	});

	loadReports();
	loadReportsMarkers();
	
	//upload a file to server once onchange is detected
	$('#pgAddImage0').on('change', function () {
		var time00 = new Date().getTime();
		$.mobile.loading("show", {
		text: "Loading file...",
		textVisible: true
		});
		//check to see if we have a file
		var fName = document.getElementById('pgAddImage0').files[0];
		if (typeof (fName) === 'undefined') fName = '';
		if (Len(fName) > 0) {
			//get the file name
			var ofName = time00 + '(0)' + fName.name;
			report_info["image0"] = ofName;
			//get the file extension
			var ofExt = Mid(ofName, InStrRev(ofName, '.'));
			// open a file reader to upload the file to the server
			var reader = new FileReader();
			// once the file reader has loaded the file contents
			reader.onload = function() {
				// get the dataURL of the file, a base 64 decoded string
				var dataURL = reader.result;
				//save the file to the server
				var req = Ajax("savepng.php", "POST", "file=" + ofName + "&content=" + dataURL);
				if (req.status == 200) {
				// return the full path of the saved file
				fName = req.responseText;
				$('#pgAddImagePreview0').attr('src', dataURL);
				} else {
					// return a blank file name
					fName = '';
				}
				//set the file name to store later
				$('#pgAddImage0').data('file', fName);
			};
			// start reading the file contents
			reader.readAsDataURL(fName);
		} else {
		}
		$.mobile.loading("hide");
	});
	
		//upload a file to server once onchange is detected
	$('#pgAddImage1').on('change', function () {
		var time01 = new Date().getTime();
		$.mobile.loading("show", {
		text: "Loading file...",
		textVisible: true
		});
		//check to see if we have a file
		var fName = document.getElementById('pgAddImage1').files[0];
		if (typeof (fName) === 'undefined') fName = '';
		if (Len(fName) > 0) {
			//get the file name
			var ofName = time01 + '(1)' +fName.name;
			report_info["image1"] = ofName;
			//get the file extension
			var ofExt = Mid(ofName, InStrRev(ofName, '.'));
			// open a file reader to upload the file to the server
			var reader = new FileReader();
			// once the file reader has loaded the file contents
			reader.onload = function() {
				// get the dataURL of the file, a base 64 decoded string
				var dataURL = reader.result;
				//save the file to the server
				var req = Ajax("savepng.php", "POST", "file=" + ofName + "&content=" + dataURL);
				if (req.status == 200) {
				// return the full path of the saved file
				fName = req.responseText;
				$('#pgAddImagePreview1').attr('src', dataURL);
				} else {
					// return a blank file name
					fName = '';
				}
				//set the file name to store later
				$('#pgAddImage1').data('file', fName);
			};
			// start reading the file contents
			reader.readAsDataURL(fName);
		} else {
		}
		$.mobile.loading("hide");
	});
	
	
initiate_geolocation();	

$("#pgAddReportSave").click(function(){
	//var time_now = new Date().getTime();
	var currentTime = new Date();
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes
	};
	var finalTime = month + "/" + day + "/" + year + " " + hours + ":" + minutes;
	report_info["rep_time"] = finalTime;
	report_info["description"] = $('#pgAddDescription').val();

	
	if (report_info["description"] == "" || report_info["image0"] == null){
		alert("Required: description and at least one image, Thanks!");
	}else{
		//upload data
		$.ajax({
			type : "POST",
			url : "../php/cgdv1/saveReport.php",
			data : {
				info : report_info
			},
			success : function(response) {
				console.log(response);
				alert("Thanks!");
				location.replace("http://geo.gmu.edu/vgi/cgdv1/");
			}
		});
	}

});

});

//geolocation
function initiate_geolocation() {
        navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
    }
 
function handle_errors(error)
    {
		switch(error.code)
            {
                case error.PERMISSION_DENIED: alert("user did not share geolocation data");
                break;
 
                case error.POSITION_UNAVAILABLE: alert("could not detect current position");
                break;
 
                case error.TIMEOUT: alert("retrieving position timed out");
                break;
 
                default: alert("unknown error");
                break;
            }
    }
 
function handle_geolocation_query(position){
		report_info["lat"] = position.coords.latitude;
		report_info["lng"] = position.coords.longitude;
        console.log('Lat: ' + position.coords.latitude +
                  ' Lon: ' + position.coords.longitude);
	}


function loadReports(){
	var time1 = new Date().getTime();
	$.getJSON('../php/cgdv1/getreports.php?_=' + time1, function(data) {
		$('#reportList li').remove();
		$('#reportList').append('<li data-role="list-divider">Reports</li>');
		var reports = data.items;
		//console.log(data.items);
		$.each(reports, function(index, report) {
			$('#reportList').append('<li><a href="#pop' + report.id + '" data-rel="popup">' +
				'<img src="Files/' + report.image0 + '"/>' +
				'<h4>' + report.description + '</h4>' +
				'<p>' + report.rep_time + '</p>' +
				'</a></li>');
			if(report.image1){
				$('#pgReports').append('<div style="max-width:300px; max-height: 400px; overflow: auto;" id="pop' + report.id + '" data-role="popup"><h4>' + report.description + '</h4><p>*scroll down for more images</p><img style="max-width:300px" src="Files/' + report.image0 + '"/><br/><br/><img style="max-width:300px" src="Files/' + report.image1 + '"/></div>');	
			}else{
				$('#pgReports').append('<div style="max-width:300px" id="pop' + report.id + '" data-role="popup"><h4>' + report.description + '</h4><img style="max-width:300px" src="Files/' + report.image0 + '"/></div>');
			}		
		});
		$('#reportList').listview('refresh');
	});
}

function loadReportsMarkers(){
	var time1 = new Date().getTime();
	//push all the markers and filter by js
	$.getJSON('../php/cgdv1/getreports.php?_=' + time1, function(data) {
		var reports = data.items;
		$.each(reports, function(index, report) {
			var point = new google.maps.LatLng(report.lat, report.lng);
			var marker = new google.maps.Marker({
					map : map, 
					position : point, 
					icon: 'images/caution_underreview.png'
				});
			var content = "<img align='left' src='http://geo.gmu.edu/vgi/cgdv1/Files/" + report.image0 + "' style='max-height:3em;margin-right:5px' /> " + report.description;
			if (report.image1) content = "<img align='left' src='http://geo.gmu.edu/vgi/cgdv1/Files/" + report.image1 + "' style='max-height:3em;margin-right:5px' /> " + content;

			google.maps.event.addListener(marker, 'click', (function(marker,content) {
				return function() {
					$("#desc-popup-text").html(content);
					$("#desc-popup").show();
				};
			})(marker,content));	
		});
		
	});
}
