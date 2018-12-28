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
})()