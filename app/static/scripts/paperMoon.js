// Global vars
var moonInfo = require(__dirname + '/static/scripts/moonView')

var handleScale = 0.52
var widthMid = view.size.width / 2
var heightMid = view.size.height / 2
var cirLen = widthMid / 2
var moon = new Path.Circle({
	center: view.center,
	radius: cirLen
})
moon.fillColor = '#f7f7a3'
var handleLen = cirLen * handleScale
var vector = new Point({
	angle: 90,
	length: handleLen 
})
var crescent = new Path()
crescent.fillColor = '#c4c479'

// Functionised for onResize()
function draw() {
	widthMid = view.size.width / 2
	heightMid = view.size.height / 2

	var oldCirLen = cirLen
	cirLen = widthMid / 2

	var ratio = cirLen / oldCirLen

	moon.scale(ratio)

	handleLen = cirLen * handleScale
	vector.length = handleLen

	crescent.segments = [
		[[widthMid - cirLen, heightMid], null, vector.rotate(180)],
		[[widthMid, heightMid - cirLen], vector.rotate(90), vector.rotate(-90)],
		[[widthMid + cirLen, heightMid], vector.rotate(180), vector],
		[[widthMid, heightMid + cirLen], vector.rotate(-90), vector.rotate(90)],
		[[widthMid - cirLen, heightMid], vector, null]
	]

	// Probably un-needed when the onMouseMove() goes
	var curve = crescent.curves
	curve[1].handle1.x = curve[2].handle2.x = (view.center.x - cirLen) * handleScale

	var delta = cirLen * handleScale
	var tmpCirLen = view.center.x - cirLen
	curve[2].handle1.y = delta + ((tmpCirLen - delta) * 0.12)
	curve[1].handle2.y = -curve[2].handle1.y

	crescent.fullySelected = false
}

function onMouseMove(event) {
	var point = event.point.clone()

	if(point.x > widthMid)
		point.x = widthMid
	if(point.x < widthMid - cirLen)
		point.x = widthMid - cirLen
	
	var delta = (point - view.center).x
	var deltaX55 = delta * handleScale

	var curve = crescent.curves
	
	curve[0].handle2.y = (delta + cirLen) - ((cirLen - Math.abs(delta)) * 0.7)
	curve[3].handle1.y = -curve[0].handle2.y
	
	curve[0].handle2.x = curve[3].handle1.x = deltaX55
	
	curve[0].handle1.y = deltaX55 - ((cirLen - Math.abs(deltaX55)) * 0.12)
	curve[3].handle2.y = -curve[0].handle1.y
	
	crescent.segments[0].point.x = 
		crescent.segments.slice(-1)[0].point.x = 
		point.x
}

function setCrescent() {
	for(var i = 0; i < 4; i++) {
		crescent.segments[i].point.x = moon.segments[i].point.x
		crescent.segments[i].point.y = moon.segments[i].point.y
	}
	crescent.segments[4].point.x = moon.segments[0].point.x
	crescent.segments[4].point.y = moon.segments[0].point.y
}

function onResize(event) {
	draw()
	moon.position = view.center
	setCrescent()
}

// Non-function code
// NOTE: draw() must be before onMouseMove()
draw()
// Call onMouseMove once to correctly position the text items:
onMouseMove({ point: view.center - vector.rotate(-90) })
