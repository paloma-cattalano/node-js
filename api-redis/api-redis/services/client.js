const redis = require('redis')
const accessBdd = redis.createClient()

function sendToRedis(clientHotel)
{
    accessBdd.hset(`client:${clientHotel.identifiantClient}`,
        "identifiantClient", clientHotel.identifiantClient,
        "nom", clientHotel.nom,
        "prenom", clientHotel.prenom,
        "addresse", clientHotel.addresse,
        "email", clientHotel.email,
        (err, res) => {
            console.log(err)
            console.log(res)
        })
}

function getFromRedis(identifiantClient, callback) {
    accessBdd.hgetall(`client:${identifiantClient}`, callback)
}

exports.sendToRedis = sendToRedis
exports.getFromRedis = getFromRedis
