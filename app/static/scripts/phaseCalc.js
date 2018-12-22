/*function strToDate(dateString) {
    // Check dateString matches dd/mm/YYYY
    if(/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        date = new Date()
        date.setDay(dateString.substr(0, 2))
        date.setMonth(dateString.substr(4, 6))
        date.setFullYear(dateString.substr(7, 11))
        return date
    }
    return null
}*/

/*function setMoonPhase(daysIntoCycle) {
    const moonEleStyle = document.getElementById('moon').style

    //moonEleStyle.backgroundImage = "url(__dirname + '/static/assests/newMoon.png')"


    const upper = percent + 3 > 100 ? 100 : percent + 3
    const dir = percent > 50 ? 270 : 90

    moonEleStyle.backgroundImage = "linear-gradient( \
        " + dir + "deg, \
        rgba(60, 60, 48, 1) 0%, \
        rgba(136, 136, 107, 0.7) " + percent + "%, \
        rgba(136, 136, 107, 0.2) " + upper + "%, \
        rgba(245, 241, 191, 0) 100% \
        )"
}*/

function getJulian(date) {
    const daysInYear = 362.25
    
    var a = Math.floor(date.getFullYear() / 100)
    var b = 2 - a + Math.floor(a / 4)

    var e = daysInYear * (date.getFullYear() + 4716)
    var f = 30.6001 * (date.getMonth() + 1)
    return b + date.getDay() + e + f - 1524.5
}

function retMoonName(phaseNum) {
    switch(phaseNum) {
        case(1):
            return 'newMoon.png'
        case(2):
            return 'waxingCrescent.png'
        case(3):
            return 'quarters.png'
        case(4):
            return 'waxingGibbous.png'
        case(5):
            return 'fullMoon.png'
        case(6):
            return 'waxingGibbous.png'
        case(7):
            return 'quarters.png'
        case(8):
            return 'waxingCrescent.png'
    }
}

(function() {
    // Calcaulate moon phase information
    const jdToNewMoon = 2451549.5
    const daysOfCycle = 29.53
    const today = new Date()
    const julian = getJulian(today)
    const sinceNew = julian - jdToNewMoon
    const daysIntoCycle = ((sinceNew / daysOfCycle) - Math.floor(sinceNew / daysOfCycle)) * daysOfCycle
    const percent = (daysIntoCycle / daysOfCycle) * 100

    // Bring in configuration
    const config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json', 'utf8'))
    const dateDDMMYYYY = today.toLocaleDateString()

    // Set background image
    var i = 1
    for(; i <= 8; i++)
        if(percent <= 12.5 * i)
            break;
    const phaseNum = i
    const moonImgName = retMoonName(phaseNum)
    document.getElementById('moonImg').src = __dirname + '/static/assets/' + moonImgName

    console.log(daysIntoCycle, percent)
})()