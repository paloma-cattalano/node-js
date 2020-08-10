const redis = require('redis')
const {promisify} = require('util')
const clientService = require('./client')
const chambreService = require('./chambre')
const accessBdd = redis.createClient()

async function sendToRedis(reservation) {

    let asyncHset = promisify(accessBdd.hset).bind(accessBdd)

    if (!await clientService.exist(reservation.identifiantClient))
        throw "le client spécifié n'existe pas."
    if (!await chambreService.exist(reservation.identifiantChambre))
        throw "la chambre spécifié n'existe pas."
    if (!await chambreService.isAvailable(reservation.identifiantChambre))
        throw "la chambre spécifiée est déjà réservée."

    await asyncHset(`reservation:${reservation.numeroReservation}`,
        'numeroReservation', reservation.numeroReservation,
        'dateEntree', reservation.dateEntree,
        'dateSortie', reservation.dateSortie,
        'identifiantChambre', reservation.identifiantChambre,
        'identifiantClient', reservation.identifiantClient,
    ).then((value) => {
        accessBdd.lpush("reservations", reservation.numeroReservation)
    })
}

async function exist(identifiantReservation) {
    let asyncExist = promisify(accessBdd.exists).bind(accessBdd)

    return Boolean(await asyncExist(`reservation:${identifiantReservation}`))
}

async function deleteFromRedis(numeroReservation) {
    let asyncLrem = promisify(accessBdd.lrem).bind(accessBdd)
    let asyncDel = promisify(accessBdd.del).bind(accessBdd)

    if (!await exist(numeroReservation))
        throw "la réservation spécifiée n'existe pas"

    await asyncLrem("reservations", numeroReservation)
    await asyncDel(`reservation:${numeroReservation}`)

}

function getFromRedis(numeroReservation) {
    let asyncHgetall = promisify(accessBdd.hgetall).bind(accessBdd)
    return asyncHgetall(`reservation:${numeroReservation}`)
}

exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
exports.exist = exist
