const express = require('express');
const bodyParser = require('body-parser');
let app = express();
let PDFMerge = require('pdf-merge');

app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/', function (req, res) {

    let today = new Date();
    let pdfFiles = [];
    let base = 'https://erelego.com/eNewspaper/News/UVANI/MAN/' + today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear() + today.getMonth() + today.getDate() + '_';
    for (let i = 1; i <= 16; i++) {
        pdfFiles.push(base + i + ".pdf");
    }
    let pdfMerge = new PDFMerge(pdfFiles,"/app/bin/pdftk");
    pdfMerge
        .asBuffer()
        .merge(function (error, buffer) {
            if (error)
                res.end(error + "\n" + error.stack);
            res.end(buffer);
        });
});

var listener = app.listen(process.env.PORT || 8080, function () {
    console.log('API now running on port: ' + listener.address().port);
});

module.exports = app;
