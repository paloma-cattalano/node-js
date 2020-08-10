class Chambre {
    constructor(identifiantChambre, numeroChambre, prix, nbLit, possedeSalleDeBain, balcon, terrasse, clim, tele, petitDejeuner, prixPetitDejeuner, accepteAnimaux, accepteEnfant, etage, estDisponible, litKingSize, optionPetalesDeRose) {
        this.identifiantChambre = identifiantChambre
        this.numeroChambre = numeroChambre
        this.prix = prix
        this.nbLit = nbLit
        this.possedeSalleDeBain = possedeSalleDeBain
        this.balcon = balcon
        this.terrasse = terrasse
        this.clim = clim
        this.tele = tele
        this.petitDejeuner = petitDejeuner
        this.prixPetitDejeuner = prixPetitDejeuner
        this.accepteAnimaux = accepteAnimaux
        this.accepteEnfant = accepteEnfant
        this.etage = etage
        this.estDisponible = estDisponible
        this.litKingSize = litKingSize
        this.optionPetalesDeRose = optionPetalesDeRose
    }

    isLyndaProof() {
        return this.clim && this.optionPetalesDeRose
    }

    static fromRedis(data) {
        return Object.assign(new Chambre(), data)
    }
}

exports.Chambre = Chambre
