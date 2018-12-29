// Module-scoped vars
var moonInfo = require(__dirname + '/static/scripts/moonView')

var moonCol = '#f7f7a3'
var crescentCol = '#c4c497'

var handleScale = 0.52
var widthMid = view.size.width / 2
var heightMid = view.size.height / 2
var cirLen = widthMid / 2
var moon = new Path.Circle({
	center: view.center,
	radius: cirLen
})
moon.fillColor = moonCol
var handleLen = cirLen * handleScale
var vector = new Point({
	angle: 90,
	length: handleLen 
})
var crescent = new Path()
crescent.fillColor = crescentCol

// Functionised for onResize()
function placeCircles() {
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

function setCrescentCurve(xVal) {
	xVal = widthMid - xVal

	var delta = xVal - view.center.x
	var deltaX55 = delta * handleScale

	var curve = crescent.curves
	
	curve[0].handle2.y = (delta + cirLen) - ((cirLen - Math.abs(delta)) * 0.7)
	curve[3].handle1.y = -curve[0].handle2.y
	
	curve[0].handle2.x = curve[3].handle1.x = deltaX55
	
	curve[0].handle1.y = deltaX55 - ((cirLen - Math.abs(deltaX55)) * 0.12)
	curve[3].handle2.y = -curve[0].handle1.y
	
	crescent.segments[0].point.x = 
		crescent.segments.slice(-1)[0].point.x = 
		xVal
}

function setCrescentLocation() {
	for(var i = 0; i < 4; i++) {
		crescent.segments[i].point.x = moon.segments[i].point.x
		crescent.segments[i].point.y = moon.segments[i].point.y
	}
	crescent.segments[4].point.x = moon.segments[0].point.x
	crescent.segments[4].point.y = moon.segments[0].point.y
}

function getPercentAndQuarter(percent) {
	percent *= 4
	var quarter = parseInt(percent)
	percent -= quarter

	if(quarter == 4) // 4.0, i.e. full moon
		quarter = 0

	return {
		quarter: quarter,
		percent: percent
	}
}

function setCrescentRotateAndColors(info) {
	if(info.quarter == 0 || info.quarter == 2)
		crescent.rotate(180, view.center)
	if(info.quarter == 1 || info.quarter == 2) {
		moon.fillColor = crescentCol
		crescent.fillColor = moonCol
	}
	
}

function draw() {
	placeCircles()
	moon.position = view.center
	setCrescentLocation()
	var quarterPercent = getPercentAndQuarter(moonInfo.currentPhase.phase)

	// NOTE: Set curve before rotating (and rotate around view.center)
	setCrescentCurve(quarterPercent.percent * cirLen)
	setCrescentRotateAndColors(quarterPercent)
}

function onResize(event) {
	draw();
}

draw()
