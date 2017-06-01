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

app.get('/', function (req, res) {

    let today = new Date();
    let pdfFiles = [];
    let base = 'https://erelego.com/eNewspaper/News/UVANI/MAN/' + today.getFullYear() + '/' + pad(today.getMonth()+1) + '/' + pad(today.getDate()) + '/' + today.getFullYear() + pad(today.getMonth()+1) + pad(today.getDate()) + '_';
    for (let i = 1; i <= 16; i++) {
        pdfFiles.push(base + i + ".PDF");
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
