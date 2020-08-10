class BienImmobilier{

  constructor(prix, type, proprietaire){
    this.prix = prix
    if (type === ""){
      throw "Erreur, le type est vide."
    }
    this.type = type
    this.proprietaire = proprietaire
  }

  estAVendre(){
      return this.prix > 0 && this.proprietaire === undefined
  }

}

class Immeuble extends BienImmobilier{

  constructor(prix, type, proprietaire, nbALouer, nbAVendre, nbEtages){
    super(prix, type, proprietaire)
    this.nbALouer = nbALouer
    this.nbAVendre = nbAVendre
    this.nbEtages = nbEtages
  }
}

class Maison extends BienImmobilier{

  constructor(prix, type, proprietaire, nombre_chambre, possedeCuisine){
    super(prix, type, proprietaire);

    this.nombre_chambre = nombre_chambre
    this.possedeCuisine = possedeCuisine
  }

  estAVendre(){
    return this.prix > 0 && this.proprietaire === undefined
  }

}



let immeuble = new Immeuble(100000, "appartement", "moi", undefined, undefined, 10, 20, 30)
let immeubleAVendre = new Immeuble(100000, "appartement")
let maison = new Maison(100000, "maison", undefined, 3, true)
console.log(immeuble.estAVendre())
console.log(immeubleAVendre.estAVendre())
