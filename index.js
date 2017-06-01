const express = require('express');
const bodyParser = require('body-parser');
let app = express();
let PDFMerge = require('easy-pdf-merge');

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
var http = require('http');
var fs = require('fs');

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);
    });
  });
}
let dp = function(url, dest){
    return new Promise(function(resolve, reject) {
        download(url,dest,resolve);
    });
}
app.get('/', async function (req, res) {

    let today = new Date();
    let pdfFiles = [];
    let base = 'http://erelego.com/eNewspaper/News/UVANI/MAN/' + today.getFullYear() + '/' + pad(today.getMonth()+1) + '/' + pad(today.getDate()) + '/';
    let filepre =   today.getFullYear() + pad(today.getMonth()+1) + pad(today.getDate()) + '_';
    for (let i = 1; i <= 16; i++) {
        pdfFiles.push(filepre + i + ".PDF");
        await dp(base+filepre + i + ".PDF",filepre + i + ".PDF");
    }
    let pdfMerge = PDFMerge(pdfFiles,"newspaper.pdf",function (error) {
            if (error)
                res.end(error + "\n" + error.stack);
            res.sendfile("newspaper.pdf");
            res.end();
        });
});

var listener = app.listen(process.env.PORT || 8080, function () {
    console.log('API now running on port: ' + listener.address().port);
});

module.exports = app;
