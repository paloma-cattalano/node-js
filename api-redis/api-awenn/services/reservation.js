const redis = require('redis')
const {promisify} = require('util')
const accessBdd = redis.createClient()

function sendToRedis(reservation) {
    accessBdd.hset(`reservation:${reservation.numeroReservation}`,
        'numeroReservation', reservation.numeroReservation,
        'dateEntree', reservation.dateEntree,
        'dateSortie', reservation.dateSortie,
        'identifiantChambre', reservation.identifiantChambre,
        'identifiantClient', reservation.identifiantClient,
        (err, res) => {
            if (err)
                throw err
        }
    )
}

function getFromRedis(numeroReservation, callback) {
    accessBdd.hgetall(`reservation:${numeroReservation}`, callback)
}

exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
