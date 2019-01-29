var lune = require('lune')
var dateFormat = require('dateformat');
var currentPhase = lune.phase()

function retMoonName(phaseNum) {
    switch(phaseNum) {
        case(0):
            return 'New Moon'
        case(1):
            return 'Waxing Crescent'
        case(2):
            return 'Quarter'
        case(3):
            return 'Waxing Gibbous'
        case(4):
            return 'Full Moon'
        case(5):
            return 'Waning Gibbous'
        case(6):
            return 'Last Quarter'
        case(7):
            return 'Waning Crescent'
    }
}

const moonName = retMoonName(parseInt(currentPhase.phase * 8))

var dateString = dateFormat(new Date(), "dS mmmm, yyyy, HH:MM:ss tt")

module.exports = {
    currentPhase,
    moonName,
    dateString
}