// Objet mère / filles:

class Animal{

  constructor(nom, proprietaire, age, ferocite){
    this.nom = nom;
    this.proprietaire = proprietaire;
    this.age = age;
    this.ferocite = ferocite;
  }
}


class Rat extends Animal {

  constructor(nom, proprietaire, age, ferocite, nourriture, calins){
    super(nom, proprietaire, age, ferocite);
    this.nourriture = nourriture;
    this.calins = calins;
  }
  mord() {
    console.log(`${this.nom} mord.`);
  }
}


class Pangolin extends Animal {

  constructor(nom, proprietaire, age, ferocite, nourriture, habitat){
    super(nom, proprietaire, age, ferocite);
    this.nourriture = nourriture;
    this.habitat = habitat;
  }
  seMetEnBoule() {
    console.log(`${this.nom} se met en boule.`);
  }
}

let lerat = new Rat ("Ratatouille", "Miranda", "4 ans", true, "croquettes", true)
console.log(lerat)
console.log(lerat.mord())

let lepangolin = new Pangolin ("Pingu", "Paul", "2 ans", false, "mouches", "terrier")
console.log(lepangolin)
console.log(lepangolin.seMetEnBoule())
