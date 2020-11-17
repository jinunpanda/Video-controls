		
// display the page once the window loading were done
window.onload = function() {

	// get the video tag
	var vid = document.querySelector("video");
	var isPlaying = false;
	var isFullScreen = false;
	var isMuted = false;
	
	// for updating the seekbar and current time
	var videoInterval;

	// get the video duration hours, minutes, seconds
	var vidDuration = Math.floor(vid.duration);
	var secs = Math.floor(vidDuration) % 60;
	var secs_string = secs.toString();
	var secs_length = secs_string.length;

	var min = Math.floor(vidDuration / 60);
	var hr = Math.floor(min / 60);

	// inside the video-data-controls to append the controllers
	var VDC = document.querySelector('[video-data-controls="true"]');

	// lets create a controls container
	var controls_container = document.createElement("div");
	controls_container.setAttribute("class", "controls-container");
			
	// append it to the VDC (video-data-controls="true")
	VDC.appendChild(controls_container);

	// lets set an innerHTML for the controls-container we use the class of it.
	// to find it inside the DOM
	var class_controls_container = document.querySelector(".controls-container");
	class_controls_container.innerHTML = 

		// for seekbar
		'<div style="position:relative;bottom:10px;height:20px">' +
			'<progress id="video_currentTime" value="0"></progress>' +
			'<input id="range" type="range" value="0"></input><br>' +
		'</div>' +

		// we use SVG as button for play and pause toggle
		'<svg id="play_and_pause" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">' + 
			'<path d="M0 0h24v24H0z" fill="none"/>' + 
			'<path fill="#fff" d="M8 5v14l12-7z"/>' + 
		'</svg>' +

		// for fullscreenVid SVG action button toggle using "F"
		'<svg id="FullscreenVid" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">' + 
			'<path d="M0 0h24v24H0z" fill="none"/>' + 
			'<path fill="#fff" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>' + 
		'</svg>' +

		// for toggle mute SVG action button
		'<svg id="toggleMute" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">' + 
			'<path d="M0 0h24v24H0z" fill="none"/>' + 
			'<path fill="#fff" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>' + 
		'</svg>' +

		// for time indicator of video
		'<div class="timeStamp">' + 
			'<span id="timeStart">' + 
				'<span id="timeStartHours">0</span>' + ':' + '<span id="timeStartMinutes">0</span>' + ':' + '<span id="timeStartSeconds">00</span>' + 
			'</span>' + ' / ' + 
			'<span id="timeEnd">' + 
				'<span id="timeEndHours">0</span>' + ':' + '<span id="timeEndMinutes">0</span>' + ':' + '<span id="timeEndSeconds">00</span>' + 
			'</span>' + 
		'</div>'
	;

	// for time start hours, minutes, seconds variables
	var timeStartHours = document.querySelector("#timeStartHours");
	var timeStartMinutes = document.querySelector("#timeStartMinutes");
	var timeStartSeconds = document.querySelector("#timeStartSeconds");

	// for time end hours, minutes, seconds variables
	var timeEndHours = document.querySelector("#timeEndHours");
	var timeEndMinutes = document.querySelector("#timeEndMinutes");
	var timeEndSeconds = document.querySelector("#timeEndSeconds");

	// lets set the video time End HOUR, MINUTES, SECONDS
	if (secs_length == 1) {
		timeEndHours.innerHTML = hr;
		timeEndMinutes.innerHTML = min;
		timeEndSeconds.innerHTML = "0" + secs_string;
	}
	else {
		timeEndHours.innerHTML = hr;
		timeEndMinutes.innerHTML = min;
		timeEndSeconds.innerHTML = secs_string;
	}

	// button action for play and pause, fullscreen, mute toggle, and seekbar
	var play_and_pause_Btn = document.querySelector("#play_and_pause");
	var mute = document.querySelector("#toggleMute");
	var FullscreenVid = document.querySelector("#FullscreenVid");
	var progress = document.querySelector("#video_currentTime");
	var range = document.querySelector("#range");

	// lets set first the the max attribute of range and progress of seekbar
	// and value of it
	progress.setAttribute("max", Math.floor(vid.duration));
	range.setAttribute("max", Math.floor(vid.duration));

	// value of progress the OUTPUT = 0;
	progress.value = Math.floor(vid.currentTime);
	range.value = Math.floor(vid.currentTime);

	// seekbar action
	range.oninput = function() {
				
		/* then set also the video current time */
		vid.currentTime = range.value;
		progress.value = range.value;

		// update the current time of video
		update_video_currentTime();	
	}

	function update_video_currentTime() {

		// for timestart seconds 
		var vidSecs = Math.floor(vid.currentTime) % 60;
		var vidSecs_string = vidSecs.toString();
		var vidSecs_length = vidSecs_string.length;

		// current time of video
		progress.value = Math.floor(vid.currentTime);
		range.value = Math.floor(vid.currentTime);
							
		// update always the counting of the video in 500 milliseconds
		if (vidSecs_length == 1) {
			timeStartHours.innerHTML = Math.floor(vid.currentTime / 60 / 60);
			timeStartMinutes.innerHTML = Math.floor(vid.currentTime / 60);
			timeStartSeconds.innerHTML = "0" + vidSecs_string;
		}
		else {
			timeStartHours.innerHTML = Math.floor(vid.currentTime / 60 / 60);
			timeStartMinutes.innerHTML = Math.floor(vid.currentTime / 60);
			timeStartSeconds.innerHTML = vidSecs_string;
		}
	}

	// for fullScreen action
	FullscreenVid.addEventListener("click", fullScreenVid);
	function fullScreenVid() {
		switch (isFullScreen) {
			case true:
				isFullScreen = false;

				if (document.exitFullscreen) {
				    document.exitFullscreen();
				} 
				else if (document.webkitExitFullscreen) {
				    document.webkitExitFullscreen();
				} 
				else if (document.msExitFullscreen) {
				    document.msExitFullscreen();
				}
			break;

			case false:
				isFullScreen = true;

				if (vid.requestFullscreen) {
			  		vid.requestFullscreen();
				} 
				else if (vid.webkitRequestFullscreen) {
					vid.webkitRequestFullscreen();
				} 
				else if (vid.msRequestFullscreen) {
					vid.msRequestFullscreen();
				}
			break;
		}
	}

	// play and pause of video button for playing 
	play_and_pause_Btn.addEventListener("click", play_and_pause);
	vid.addEventListener("click", play_and_pause);
	function play_and_pause() {
		switch(isPlaying) {
			case true:
				isPlaying = false;
				document.querySelector("video").pause();
				
				// play icon 
				play_and_pause_Btn.innerHTML =
					'<path d="M0 0h24v24H0z" fill="none"/>' + 
					'<path fill="#fff" d="M8 5v14l11-7z"/>'
				;
				
				// stop the interval counting of video
				clearInterval(videoInterval);
			break;

			case false:
				isPlaying = true;
				document.querySelector("video").play();
				
				// pause icon 
				play_and_pause_Btn.innerHTML = 
					'<path d="M0 0h24v24H0z" fill="none"/>' + 
					'<path fill="#fff" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'
				;
						
				// update it the video time every 100 milliseconds 
				videoInterval = setInterval(function() {
							
					// update the current time of video once it playing
					update_video_currentTime();

					// set if the video ended 
					if (vid.ended) {
						
						// since the video ended, then set it to false and stop the interval 
						clearInterval(videoInterval);
							isPlaying = false;

						// change the text to Play again 
						play_and_pause_Btn.innerHTML =
							'<path d="M0 0h24v24H0z" fill="none"/>' + 
							'<path fill="#fff" d="M8 5v14l11-7z"/>'
						;
					}
				}, 100);
			break;
		}
	}

	// mute action button 
	mute.addEventListener("click", function() {
		switch(isMuted) {

			// if muted is equal to false then true
			case true:
				isMuted = false;
				vid.muted = false;

				// change the icon
				mute.innerHTML = 
					'<path d="M0 0h24v24H0z" fill="none"/>' + 
					'<path fill="#fff" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>'
				;
			break;

			case false:
				isMuted = true;
				vid.muted = true;

				// change the icon
				mute.innerHTML = 
					'<path d="M0 0h24v24H0z" fill="none"/>' + 
					'<path fill="#fff" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'
				;
			break;
		}
	});

	// keyboard support for play and pause and fullscreen toggle
	window.onkeyup = function(e) {
		switch(e.keyCode) {
			/* SPACE */
			case 32:
				play_and_pause();
			break;

			/* F */
			case 70:
				fullScreenVid();
			break;
		}
	}
}
