const express = require('express');
const bodyParser = require('body-parser');
let app = express();
const request = require('request')
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

var download = function(url, dest) {
  return new Promise(function (resolve, reject) {
  var file = fs.createWriteStream(dest);
  request(url).pipe(file);
  file.on('finish', () => {
    resolve()
    });
  file.on('error', (r) => {
    reject(r)
    });
  });
}
app.get('/', async function (req, res) {

    let today = new Date();
    let pdfFiles = [];
    let base = 'http://erelego.com/eNewspaper/News/UVANI/MAN/' + today.getFullYear() + '/' + pad(today.getMonth()+1) + '/' + pad(today.getDate()) + '/';
    let filepre =   today.getFullYear() + pad(today.getMonth()+1) + pad(today.getDate()) + '_';
    for (let i = 1; i <= 16; i++) {
        pdfFiles.push('./'+filepre + i + ".PDF");
        await download(base+filepre + i + ".PDF",filepre + i + ".PDF");
    }
    let pdfMerge = PDFMerge(pdfFiles,"newspaper.pdf",function (error) {
            if (error)
                res.end(error + "\n" + error.stack);
            res.sendFile(_dirname + "newspaper.pdf");
            res.end();
        });
});
app.get('/:filename/', async function (req, res) {
    res.sendFile(_dirname+req.params.filename);
    res.end();
    
});

var listener = app.listen(process.env.PORT || 8080, function () {
    console.log('API now running on port: ' + listener.address().port);
});

module.exports = app;
