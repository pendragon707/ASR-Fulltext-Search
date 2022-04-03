'use strict';

const express = require('express');
const path = require('path');
const favicon = require('express-favicon');

const app = express();

app.use(favicon(path.join(__dirname, 'images', 'icon.ico')));

// const htmlPath = path.resolve(__dirname, '..', 'src/index.html')
const htmlPath = path.resolve(__dirname, '..', 'src/html/index.html')
const authPath = path.resolve(__dirname, '..', 'src/html/auth.html')
const regPath = path.resolve(__dirname, '..', 'src/html/reg.html')
const staticPath = path.resolve(__dirname, '..', 'src')
const port = 3000;

app.use('/', express.static(staticPath));

app.route('/index').get(function(req, res) {
     res.sendFile(htmlPath);
});

app.all('/', (req, res) => {
    res.render(authPath);
});

app.route('/').get(function(req, res) {    // ??????????
     res.sendFile(authPath);
});

app.route('/auth').get(function(req, res) {
     res.sendFile(authPath);
});

app.route('/reg').get(function(req, res) {
     res.sendFile(regPath);
});

//app.all('*', (req, res) => {
//    res.sendFile(authPath);
//});

app.listen(port, () => {
    console.log(`Server listening http://localhost:${port}`);
});
