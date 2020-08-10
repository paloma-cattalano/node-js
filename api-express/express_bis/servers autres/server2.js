// Ce fichier n'est pas valable sans dossier ejs dans node_modules et sans fichiers correspondant en .ejs

let express = require('express');
let app = express();

// à quoi correspond le set ?
// la variable de config view engine va prendre la valeur ejs et l'utiliser comme moteur de rendu
// ejs correspond à un module installé dans node_modules
// .ejs = module qui permet de faire des templates : préset de pages
// chaque .ejs correspond à un fichier à part entière
// permet d'afficher dynamiquement les variables
app.set('view engine', 'ejs')
// différence entre .send et .render ?
// = sors-moi ce fichier pour m'afficher, render correspond à la fonction de view engine
app.get('/', function(req, res){
  // c'est quoi l'extension .ejs ?
  res.render('salut.ejs')
})

// les :etagenum correspondent à un numéro, ou identifiant, ou nom > renvoi spécifique à une page
app.get('/etage/:etagenum/chambre', function(req, res) {
    // on donne ce paramètre de page spécifique avec req.params
    res.render('chambre.ejs', {etage: req.params.etagenum});
});

app.get('/compte/:nombres', function(req, res){
  res.render('nombres.ejs', {compteur: req.params.nombres})
})

app.get('/syndrome/tourette', function(req, res){
  res.render('tourette.ejs')
})

// setHeader ?? Donne le type de réponse envoyé mais encore ?
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain')
    res.status(404).send('Page introuvable !')
})


app.listen(8080, console.log('le serv est ouvert sur le port 8080 '))
