const redis = require('redis')
const accessBdd = redis.createClient()

function sendToRedis(newChambre) {
    accessBdd.hset(`chambre:${newChambre.identifiantChambre}`,
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
        'optionPetalesDeRose', newChambre.optionPetalesDeRose,
        (err, res) => {
            if (err)
                throw err
        })
}

function getFromRedis(identifiantChambre, callback) {
    accessBdd.hgetall(`chambre:${identifiantChambre}`, callback)
}
