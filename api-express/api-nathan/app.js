const app = require('express')();
const server = require('http').createServer(app);
const {JsonDB} = require('node-json-db');
// const test = require('node-json-db').JsonDB;
const {Config} = require('node-json-db/dist/lib/JsonDBConfig');
const bodyParser = require('body-parser');
const path = require('path');

// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
let db = new JsonDB(new Config("myDataBase2", true, false, '/'));

app.use(bodyParser.json({limit: '10MB'}));       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

app.get('/', (req, res) => {
	res.sendFile(path.join( __dirname, "index.html"))
});


app.post('/product', (req, res) => {
	console.log(req.body);
	if (req.body.id && req.body.name && req.body.desc) {
		db.push("/" + req.body.id, {name: req.body.name,desc: req.body.desc});
		return res.send("insertion ok");
	} else return res.status(401).send('bad request parameters');
})

app.get('/product/:id', (req, res) => {
	try {
		let data = db.getData("/" + req.params.id);
		res.send(data);
	} catch(e) {
		res.status(404).send('product missing');
	};
})

app.delete('/product/:id', (req, res) => {
	db.delete("/" + req.params.id);
	res.status(200).send('=)');
})





server.listen(8080);