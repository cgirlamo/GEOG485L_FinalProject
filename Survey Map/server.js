var http = require('http');
var fs = require('fs').promises;
            
var $ = jQuery = require('jquery')(window);
const hostname = '127.0.0.1';
const port = 3000;




const requestListener = function (req, res) {
    fs.readFile(__dirname + '/index.html')
    .then(contents => {
        res.setHeader('Content-Type','text/html')
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
};

const server = http.createServer(requestListener);
server.listen(port,hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
    $("button3").on('click' , function(e) {
        json = $('#geocode').val();
        fs.writeFileSync('geocode.json',json);

    })

});
