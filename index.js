// index.js
var express = require('express');
var cors = require('cors');
const mysql = require('mysql2');
const ejs = require('ejs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

var app = express();

app.use(cors());

// Set the view engine to use EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Define route for homepage
app.get('/', function(req, res, next){
    // Query to get attractions from database
    pool.query('SELECT * FROM attractions', function(err, results) {
        if (err) throw err;
        // Render the 'index' view with the attractions data
        res.render('index', { attractions: results });
    });
});

function getAttractionById(attractionId, callback) {
    // Query to get attraction details by ID
    pool.query('SELECT * FROM attractions WHERE id = ?', [attractionId], function(err, results) {
        if (err) throw err;
        // Call the callback function with the attraction data
        callback(results[0]);
    });
}

app.get('/attraction/:id', (req, res) => {
    const attractionId = req.params.id;
    // Call getAttractionById function with the attractionId
    getAttractionById(attractionId, function(attraction) {
        res.render('attraction', { attraction });
    });
});


app.listen(3000, function() {
    console.log('web server listening on port 3000');
});
