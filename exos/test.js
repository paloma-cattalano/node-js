console.log('saucisse')

let http = require('http');
let url = require('url');
let server = http.createServer((request, response) => {
    page = url.parse(request.url).pathname
    console.log(page)
    response.writeHead(200, {"Content-Type": "text/plain"});
    if (page == '/') {
        response.write('Vous êtes à l\'acceuil');
    } else if (page == '/endessous') {
        response.write('Vous êtes en dessous');
    } else if (page == '/endessous/endessousdudessous') {
        response.write('Vous êtes en dessous du dessous');
    } else {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write('404 error');
    }
    response.end();
});
server.listen(8080);
