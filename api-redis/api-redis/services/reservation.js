const redis = require('redis')
const accessBdd = redis.createClient()

function sendToRedis(resaHotel){
    accessBdd.hset(`reservation:${resaHotel.numeroReservation}`,
        "numeroReservation", resaHotel.numeroReservation,
        "dateEntree", resaHotel.dateEntree,
        "dateSortie", resaHotel.dateSortie,
        "identifiantChambre", resaHotel.identifiantChambre,
        "identifiantClient", resaHotel.identifiantClient,
        (err, res) => {
            console.log(err)
            console.log(res)
        })
}

function getFromRedis(numeroReservation, callback) {
    accessbdd.hgetall(`reservation:${numeroReservation}`, callback)
}

exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
