function getJulian(date) {
    const daysInYear = 362.25
    
    var a = Math.floor(date.getFullYear() / 100)
    var b = 2 - a + Math.floor(a / 4)

    var e = daysInYear * (date.getFullYear() + 4716)
    var f = 30.6001 * (date.getMonth() + 1)
    return b + date.getDay() + e + f - 1524.5
}

(function() {
    // Calcaulate moon phase information
    const jdToNewMoon = 2451549.5
    const daysOfCycle = 29.53
    const now = new Date()
    const julian = getJulian(now)
    const sinceNew = julian - jdToNewMoon
    const daysIntoCycle = ((sinceNew / daysOfCycle) - Math.floor(sinceNew / daysOfCycle)) * daysOfCycle
    const percent = Math.floor(daysIntoCycle / daysOfCycle)

    // Bring in configuration
    const config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json', 'utf8'))
    const dateDDMMYYYY = now.toLocaleDateString()

    console.log(daysIntoCycle, dateDDMMYYYY)
})()