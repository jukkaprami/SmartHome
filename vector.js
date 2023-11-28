const wind = (uVector, vVector) => {

    // Reset all values
    let windAngle = 0; // Wind blows from opposite direction to vector
    let windSpeed = 0; // Wind speed in vector units (m/s)
    let geographicAngle = 0; // Angle of vector in a map

    // atan2 returns angle in radians. Arguments are in (y,x) order!
    let xyAngleRad = Math.atan2(vVector, uVector); 
    let xyAngleDeg = xyAngleRad * 360 /(2 * Math.PI); // convert radians to degrees
    
    // Convert x-y plane directions to geographic directions
    // There is 90 degrees shift between x-y and map directions
    if (xyAngleDeg > 90) {
    geographicAngle = 360 - (xyAngleDeg -90);
    }

    else {
        geographicAngle = 90 - xyAngleDeg ;
    }
    
    // Wind blows from opposite direction
    if (geographicAngle < 180) {
        windAngle = geographicAngle + 180;
    }

    else {
        windAngle = geographicAngle -180
    }

    // calcultate wind speed according to the Pythagoras theorem
    windSpeed = Math.sqrt(uVector**2 + vVector**2);
    
    // Return all calculated parameters
    return {
            xyAngleRad: xyAngleRad,
            xyAngleDeg: xyAngleDeg,
            geographicAngle: geographicAngle,
            windAngle: windAngle,
            windSpeed: windSpeed
        };
    }

    // Let's make some preliminary tests
console.log('u = 3, v = 4', wind(3, 4));
console.log('u = 3, v = -4', wind(3, -4))
console.log('u = -3, v = 4', wind(-3, 4))
console.log('u = -3, v = -4', wind(-3, -4))

// Important to test cases when a component is 0
console.log('u = 0, v = 4', wind(0, 4))
console.log('u = 4, v = 0', wind(4, 0))
console.log('u = 0, v = 0', wind(0, 0))