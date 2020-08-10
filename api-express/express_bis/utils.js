// Le fichier utils (qu'on pourrait renommer functions.js) sert à classer nos fonctions supplémentaires

// fonction qui génère un UUID aléatoire :
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.uuidv4 = uuidv4
