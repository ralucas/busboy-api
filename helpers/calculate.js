//function for calculating distance
exports.calculateDistance = function (lat, lon, stops) {
    var distanceFrom = Number,
        R = 3959, // m
        latitude = parseInt(lat, 10),
        longitude = parseInt(lon, 10),
        output = [];
    console.log('len: ', stops.length);
    _.each(stops, function(stop) {
        var stopLat = parseInt(stop['stop_lat'], 10),
            stopLon = parseInt(stop['stop_lon'], 10),
            dLat = (stopLat - latitude).toRad(),
            dLon = (stopLon - longitude).toRad();
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latitude.toRad()) *
            Math.cos(stopLat.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        stop['distance'] = Math.round(d*100)/100;
        if( stop['distance'] <= currentPlaceObj['distanceFrom'] ) {
            output.push(stop);
        }
   });
    return output;
};
