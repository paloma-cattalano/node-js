// Dans le fichier model.js on crée nos classes qui vont être envoyées à la BDD Redis
// d'où la communication nécessaire entre _model et _redis

class Chambre {
  constructor(idChambre, numeroChambre, prix, nbLits, possedeSalleDeBain, balcon, terrasse, clim, tele, petitDejeuner, prixPetitDejeuner, accepteAnimaux, accepteEnfants, etage, estDisponible, litKingSize, optionPetaleDeRoses) {
    this.idChambre = idChambre;
    this.numeroChambre = numeroChambre;
    this.prix = prix;
    this.nbLits = nbLits;
    this.possedeSalleDeBain = possedeSalleDeBain;
    this.balcon = balcon;
    this.terrasse = terrasse;
    this.clim = clim;
    this.tele = tele;
    this.petitDejeuner = petitDejeuner;
    this.prixPetitDejeuner = prixPetitDejeuner;
    this.accepteAnimaux = accepteAnimaux;
    this.accepteEnfants = accepteEnfants;
    this.etage = etage;
    this.estDisponible = estDisponible;
    this.litKingSize = litKingSize;
    this.optionPetaleDeRoses = optionPetaleDeRoses;
  }

  isLyndaProof() {
    return this.terrasse === true && this.clim === true && this.litKingSize === true
  }

  estDispo() {
    return this.estDisponible === true
  }

  static fromRedis(data) {
    return Object.assign(new Chambre(), data)
  }
}

exports.Chambre = Chambre
