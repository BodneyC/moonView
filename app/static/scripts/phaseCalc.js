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

// Based on: https://gist.github.com/endel/dfe6bb2fbe679781948c
function getPercent(today) {
    var day = today.getDay();
    var month = today.getMonth();
    var year = today.getFullYear();

    if (month < 3) {
      year--;
      month += 12;
    }

    ++month;
    var c = 365.25 * year;
    var e = 30.6 * month;
    var jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    var b = parseInt(jd); // int(jd) -> b, take integer part of jd
    jd -= b; // subtract integer part to leave fractional part of original jd

    return jd;
}

(function() {
    // Bring in configuration
    const config = JSON.parse(require('fs').readFileSync(__dirname + '/config/config.json', 'utf8'))

    // Calcaulate moon phase information
    const percent = getPercent(new Date());

    phase = Math.round(percent * 8); // scale fraction from 0-8 and round
    if(phase >= 8)
        phase = 0
    
    const moonName = retMoonName(phase);
})()