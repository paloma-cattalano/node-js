const redis = require('redis')
const {promisify} = require('util')
const accessBdd = redis.createClient()

function sendToRedis(newChambre) {
    let asyncHset = promisify(accessBdd.hset).bind(accessBdd)
    asyncHset(`chambre:${newChambre.identifiantChambre}`,
        'identifiantChambre', newChambre.identifiantChambre,
        'numeroChambre', newChambre.numeroChambre,
        'prix', newChambre.prix,
        'nbLit', newChambre.nbLit,
        'possedeSalleDeBain', newChambre.possedeSalleDeBain,
        'balcon', newChambre.balcon,
        'terrasse', newChambre.terrasse,
        'clim', newChambre.clim,
        'tele', newChambre.tele,
        'petitDejeuner', newChambre.petitDejeuner,
        'prixPetitDejeuner', newChambre.prixPetitDejeuner,
        'accepteAnimaux', newChambre.accepteAnimaux,
        'accepteEnfant', newChambre.accepteEnfant,
        'etage', newChambre.etage,
        'estDisponible', newChambre.estDisponible,
        'litKingSize', newChambre.litKingSize,
        'optionPetalesDeRose', newChambre.optionPetalesDeRose
    ).then((value) => {
        accessBdd.lpush("chambres", newChambre.identifiantClient)
    })
}

async function exist(identifiantChambre) {
    let asyncExist = promisify(accessBdd.exists).bind(accessBdd)

    return Boolean(await asyncExist(`chambre:${identifiantChambre}`))
}

async function isAvailable(identifiantChambre) {
    let asyncHget = promisify(accessBdd.hget).bind(accessBdd)

    if (!await exist(identifiantChambre))
        throw "la chambre demandée n'existe pas"

    return await asyncHget(`chambre:${identifiantChambre}`, 'estDisponible') === 'true'
}

async function deleteFromRedis(numeroChambre) {
    let asyncLrem = promisify(accessBdd.lrem).bind(accessBdd)
    let asyncDel = promisify(accessBdd.del).bind(accessBdd)

    if (!await exist(numeroChambre))
        throw "la chambre spécifiée n'existe pas"

    await asyncLrem("clients", numeroChambre)
    await asyncDel(`client:${numeroChambre}`)

}

function getFromRedis(identifiantChambre) {
    let asyncHgetall = promisify(accessBdd.hgetall).bind(accessBdd)
    return asyncHgetall(`chambre:${identifiantChambre}`)
}


exports.getFromRedis = getFromRedis
exports.sendToRedis = sendToRedis
exports.exist = exist
exports.isAvailable = isAvailable
