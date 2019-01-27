// Module-scoped vars
var moonInfo = require(__dirname + '/static/scripts/moonView')
console.log(moonInfo)

var moonCol = '#e0dfa1'
var crescentCol = '#6d6d5e'

var handleScale = 0.55
var widthMid = view.size.width / 2
var heightMid = view.size.height / 2
var cirLen = widthMid / 4
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
	cirLen = widthMid / 4

	var ratio = cirLen / oldCirLen

	moon.scale(ratio)
	// moon.fullySelected = true

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
	curve[1].handle1.x = curve[2].handle2.x = handleLen

	curve[2].handle1.y = handleLen
	curve[1].handle2.y = -curve[2].handle1.y

	// crescent.fullySelected = true
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
	moon.position = view.center

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

function setCrescentRotateAndColors(info, angle) {
	if(info.quarter == 0 || info.quarter == 2)
		crescent.rotate(180 - angle, view.center)
	else
		crescent.rotate(angle, view.center)
	if(info.quarter == 1 || info.quarter == 2) {
		moon.fillColor = crescentCol
		crescent.fillColor = moonCol
	}
}

//------------------------------------- Stars

var n_stars = view.size.width / 10
var max_radius = 3
var stars = []

for(var i = 0; i < n_stars; i++)
	stars.push(returnStar())

function returnStar() {
	return new Path.Circle({
			center: new Point(
				Math.floor((Math.random() * view.size.width) + 1),
				Math.floor((Math.random() * view.size.height) + 1)
			),
			radius: Math.floor((Math.random() * max_radius) + 1),
			fillColor: '#fffcdd'
		})
}

function getMoonRotationAngle(phase) {
	return (phase * 47) - 23.5
}

//------------------------------------- Text

var moonTitle = new PointText(new Point(widthMid, (heightMid - cirLen) / 2))
moonTitle.justification = 'center'
moonTitle.fillColor = 'white'
moonTitle.fontSize = view.size.width * 0.04
moonTitle.content = moonInfo.moonName
var moonInfoText = new PointText(new Point(widthMid, heightMid + cirLen + (heightMid - cirLen) / 2))
moonInfoText.justification = 'center'
moonInfoText.fillColor = 'white'
moonInfoText.fontSize = view.size.width * 0.025
moonInfoText.content = 'Age: ' + Math.round(moonInfo.currentPhase.age) + ' days\nIllumination: ' + Math.round(moonInfo.currentPhase.illuminated * 100) + '%'

function positionText() {
	moonTitle.fontSize = view.size.width * 0.04
	moonTitle.position = new Point(widthMid, (heightMid - cirLen) / 2)
	moonInfoText.fontSize = view.size.width * 0.025
	moonInfoText.position = new Point(widthMid, heightMid + cirLen + (heightMid - cirLen) / 2)
}

//------------------------------------- Drawing

function draw() {
	placeCircles()
	setCrescentLocation()
	var quarterPercent = getPercentAndQuarter(moonInfo.currentPhase.illuminated)
	var angle = getMoonRotationAngle(moonInfo.currentPhase.phase)

	setCrescentCurve(quarterPercent.percent * cirLen)
	setCrescentRotateAndColors(quarterPercent, angle)

	moon.bringToFront()
	crescent.bringToFront()
	moonTitle.bringToFront()
}

function redrawStars() {
	for(var i = 0; i < n_stars; i++)
		stars[i].remove()
	stars = []
	n_stars = view.size.width / 10
	for(i = 0; i < n_stars; i++)
		stars.push(returnStar())
}

function onResize(event) {
	redrawStars()
	draw()
	positionText()
}

draw()