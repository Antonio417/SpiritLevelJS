/*
 * The folowing two functions are available for you to use.
 * 
 * offsetBubble(x, y, bubbleId)
 *     This function will position the bubble with ID 'bubbleId' at an
 *     offset of (x, y) pixels from its original position in centre of
 *     the track.
 *
 *     The coordinate system's origin (0, 0) is the original bubble position.
 *     x increases to the right and y increases to the top of the view.
 *     
 *     Parameters:
 *         x, y:     Numbers in pixels. 
 *                   Negative values offset bubble in opposite direction.
 *         bubbleId: ID of bubble to be moved.
 * 
 *
 * bubbleTrackLength()
 *     Returns the length of both bubble tracks in pixels.
 * 
 *     Return value:
 *         Returns an Number of pixels representing the length.
 * 
 * 
 * removeMarkerStyles()
 *     Removes all JavaScript-created style changes from all track markers.
 *
 *
 * deviceMotionNormalisedAccelerationIncludingGravity(event)
 *     Given a DeviceMotionEvent object, returns a normalised version
 *     of the accelerationIncludingGravity property object with values
 *     matching Android, since Safari on iOS reports negated values.
 *     This is only useful if you want to test/run your app on iOS.
 * 
 *     Parameters:
 *         event:    A devicemotion event object.
 *     Return value:
 *         Returns an object with same properties as the 
 *         event.accelerationIncludingGravity object.
 * 
 * 
 * IDs of HTML elements of interest
 * =========================================
 * 
 * message-area       ID of text area at the bottom of the view.
 * vertical-25        ID of upper marker in vertical track.
 * vertical-50        ID of centre marker in vertical track.
 * vertical-75        ID of lower marker in vertical track.
 * horizontal-25      ID of left marker in horizontal track.
 * horizontal-50      ID of centre marker in horizontal track.
 * horizontal-75      ID of right marker in horizontal track.
 * vertical-bubble    ID of the bubble in vertical track.
 * horizontal-bubble  ID of the bubble in horizontal track. 
 */

// YOUR CODE HERE

function deviceMotionUpdate(event) {
    var aX = event.accelerationIncludingGravity.x;
    var aY = event.accelerationIncludingGravity.y;
    var aZ = event.accelerationIncludingGravity.z;

    var gX = aX / 9.8;
    var gY = aY / 9.8;
    var gZ = Math.abs(aZ / 9.8);

    var pitchAvg = 0;
    var rollAvg = 0;


    var pitch = Math.atan(-gY / gZ);
    var roll = Math.atan(gX / Math.sqrt(Math.pow(gY, 2) + Math.pow(gZ, 2)));
    var radtodeg = 180 / Math.PI; // Radian-to-Degree conversion

    pitch *= radtodeg;
    roll *= radtodeg;

    // Buffering Part

    pitchArray.push(pitch);
    rollArray.push(roll);

    if (pitchArray.length >= N) {
        pitchArray.shift();
        rollArray.shift();
    }

    for (var i = 0; i < N; i++) {
        pitchAvg += pitchArray[i];
        rollAvg += rollArray[i];
    }

    pitchAvg /= N;
    rollAvg /= N;

    // The smoothen pitch and roll is used for the rest of the function

    var pitchInDegrees = (Number(pitchAvg).toFixed(1) / 90) * (bubbleTrackLengthV() / 2.3);
    var rollInDegrees = (Number(rollAvg).toFixed(1) / 90) * (bubbleTrackLengthH() / 2.3);


    var positionOfBubble = [];
    var pitchAndRollCoordinates = [rollInDegrees, pitchInDegrees];

    sectionHighlight(pitchAndRollCoordinates);


    return positionOfBubble = [offsetBubble(pitchAndRollCoordinates[0], 0, 'horizontal-bubble'), offsetBubble(0, pitchAndRollCoordinates[1], 'vertical-bubble')]

}


function sectionHighlight(xy) {
    if (xy[0] >= -17 && xy[0] <= 16.5) {
        document.getElementById('horizontal-50').style.backgroundColor = "rgba(0, 100, 0, 0.5)";
    } else if (xy[0] >= -89.7 && xy[0] <= -53.5) {
        document.getElementById('horizontal-25').style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    } else if (xy[0] >= 55 && xy[0] <= 89) {
        document.getElementById('horizontal-75').style.backgroundColor = "rgba(255,0, 0, 0.3)";
    } else {
        removeMarkerStylesH()
    }

    if (xy[1] <= -55 && xy[1] >= -90) {
        document.getElementById('vertical-25').style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    } else if (xy[1] >= -19.5 && xy[1] <= 18) {
        document.getElementById('vertical-50').style.backgroundColor = "rgba(0, 100, 0, 0.5)";
    } else if (xy[1] >= 54 && xy[1] <= 88) {
        document.getElementById('vertical-75').style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    } else {
        removeMarkerStylesV()
    }
}


function removeMarkerStylesH() {
    var markers = ["horizontal-25", "horizontal-50", "horizontal-75"];

    for (var i = 0; i < markers.length; i++) {
        var marker = document.getElementById(markers[i]);
        if (marker) {
            marker.removeAttribute("style");
        }
    }
}

function removeMarkerStylesV() {
    var markers = ["vertical-25", "vertical-50", "vertical-75"];

    for (var i = 0; i < markers.length; i++) {
        var marker = document.getElementById(markers[i]);
        if (marker) {
            marker.removeAttribute("style");
        }
    }
}

// Global variable made for buffering

var N = 20; // Length of the array used for Buffering
var pitchArray = new Array(N);
var rollArray = new Array(N);

if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", deviceMotionUpdate);
} else {
    document.getElementById('horizontal-track').innerHTML = 'sensor is not available'
    document.getElementById('vertical-track').innerHTML = 'sensor is not available'
}
