var cirLen = 100;

var moon = new Path.Circle({
	center: view.center,
	radius: cirLen
});
moon.fillColor = '#f7f7a3'

var handleLen = cirLen * 0.55;
var widthMid = view.size.width / 2;
var heightMid = view.size.height / 2;

var vector = new Point({
	angle: 90,
	length: handleLen 
});

var crescent = new Path();
crescent.segments = [
    [[widthMid, heightMid - cirLen], null, vector.rotate(90)],
    [[widthMid - cirLen, heightMid], vector.rotate(180), vector],
    [[widthMid,heightMid + cirLen], vector.rotate(90), vector.rotate(-90)],
    [[widthMid + cirLen, heightMid], vector, vector.rotate(180) ],
    [[widthMid, heightMid - cirLen], vector.rotate(-90), null]
];
crescent.fullySelected = true;
crescent.fillColor = '#c4c479'

function onMouseMove(event) {
	var point = event.point.clone();
	var delta = (point - view.center).x;
	var deltaX55 = delta * 0.55;
    
	var curve1 = crescent.curves[0];
	var curve2 = crescent.curves[1];
	
	curve1.handle1.y = (delta + cirLen) - ((cirLen - Math.abs(delta)) * 0.7);
   	curve2.handle2.y = -curve1.handle1.y;
   	
	curve1.handle1.x = curve2.handle2.x = deltaX55;
	
	curve1.handle2.y = deltaX55 - ((cirLen - Math.abs(deltaX55)) * 0.12);
	curve2.handle1.y = -curve1.handle2.y;
 	
 	var lSeg = crescent.segments[1]
 	lSeg.point.x = point.x
}

function setCrescent() {
    crescent.segments[0].point.x = moon.segments[1].point.x;
    crescent.segments[0].point.y = moon.segments[1].point.y;
    crescent.segments[2].point.x = moon.segments[3].point.x;
    crescent.segments[2].point.y = moon.segments[3].point.y;
    crescent.segments[3].point.x = moon.segments[2].point.x;
    crescent.segments[3].point.y = moon.segments[2].point.y;
    crescent.segments[4].point.x = moon.segments[1].point.x;
    crescent.segments[4].point.y = moon.segments[1].point.y;
}

function onResize(event) {
	moon.position = view.center;
	setCrescent();
}

// Call onMouseMove once to correctly position the text items:
onMouseMove({ point: view.center - vector.rotate(-90) });