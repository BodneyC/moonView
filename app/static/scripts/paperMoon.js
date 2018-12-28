// Global vars
var moonInfo = require(__dirname + '/static/scripts/moonView');
console.log(moonInfo)
var widthMid = view.size.width / 2;
var heightMid = view.size.height / 2;
var cirLen = widthMid / 2;
var moon = new Path.Circle({
	center: view.center,
	radius: cirLen
});
moon.fillColor = '#f7f7a3'
var handleLen = cirLen * 0.55;
var vector = new Point({
	angle: 90,
	length: handleLen 
});
var crescent = new Path();
crescent.fullySelected = true;
crescent.fillColor = '#c4c479'

// Functionised for onResize()
function draw() {
	widthMid = view.size.width / 2;
	heightMid = view.size.height / 2;

	var oldCirLen = cirLen;
	cirLen = widthMid / 2;

	var ratio = cirLen / oldCirLen;

	moon.scale(ratio);

	handleLen = cirLen * 0.55;
	vector.length = handleLen;

	crescent.segments = [
		[[widthMid - cirLen, heightMid], null, vector.rotate(180)],
		[[widthMid, heightMid - cirLen], vector.rotate(90), vector.rotate(-90)],
		[[widthMid + cirLen, heightMid], vector.rotate(180), vector],
		[[widthMid, heightMid + cirLen], vector.rotate(-90), vector.rotate(90)],
		[[widthMid - cirLen, heightMid], vector, null]
	];
}

function onMouseMove(event) {
	var point = event.point.clone();
	var delta = (point - view.center).x;
	var deltaX55 = delta * 0.55;
	
	var curve1 = crescent.curves[0];
	var curve2 = crescent.curves[3];
	
	curve1.handle2.y = (delta + cirLen) - ((cirLen - Math.abs(delta)) * 0.7);
	curve2.handle1.y = -curve1.handle2.y;
	
	curve1.handle2.x = curve2.handle1.x = deltaX55;
	
	curve1.handle1.y = deltaX55 - ((cirLen - Math.abs(deltaX55)) * 0.12);
	curve2.handle2.y = -curve1.handle1.y;
	
	crescent.segments[0].point.x = 
		crescent.segments.slice(-1)[0].point.x = 
		point.x;
}

function setCrescent() {
	for(var i = 0; i < 4; i++) {
		crescent.segments[i].point.x = moon.segments[i].point.x;
		crescent.segments[i].point.y = moon.segments[i].point.y;
	}
	crescent.segments[4].point.x = moon.segments[0].point.x;
	crescent.segments[4].point.y = moon.segments[0].point.y;
}

function onResize(event) {
	draw();
	moon.position = view.center;
	setCrescent();
}

// Non-function code
// NOTE: draw() must be before onMouseMove()
draw();
// Call onMouseMove once to correctly position the text items:
onMouseMove({ point: view.center - vector.rotate(-90) });
