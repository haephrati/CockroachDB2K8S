var async = require('async');
var fs = require('fs');
var pg = require('pg');

// Connect to the "bank" database.

var user = process.env.ROACH_USER
var host = process.env.ROACH_HOST
var database = process.env.ROACH_DATABASE
var port = process.env.ROACH_PORT


var config = {
    user: user,
    host: host,
    database: database,
    port: port
};


// Create a pool.
var pool = new pg.Pool(config);

pool.connect(function (err, client, done) {

    // Close communication with the database and exit.
    var finish = function () {
        done();
        process.exit();
    };

    if (err) {
        console.error('could not connect to cockroachdb', err);
        finish();
    }
    async.waterfall([

            function (next) {
                console.log("1. Listing Databases")
                console.log("==================")
                client.query('show databases;', next);

            },
            function (results, next) {
                console.log(results.rows);
                console.log("")
                console.log("2. Create a table 'videos' with a PRIMARY KEY and size in the DB defaultdb")
                console.log("QUERY: CREATE TABLE IF NOT EXISTS videos (id INT PRIMARY KEY, size INT);")
                console.log("=========================================")
                client.query('CREATE TABLE IF NOT EXISTS videos (id INT PRIMARY KEY, size INT);', next);
            },
            function (results, next) {
                console.log("")
                console.log("3. Insert two rows into the 'videos' table")
                console.log("QUERY: INSERT INTO videos (id, size) VALUES (1, 1000), (2, 250);")
                console.log("=========================================")
                client.query('INSERT INTO videos (id, size) VALUES (1, 1000), (2, 250);', next);
            },
            function (results, next) {
                console.log("")
                console.log("4. List out video entries")
                console.log("QUERY: SELECT id, size FROM videos;")
                console.log("=========================")
                client.query('SELECT id, size FROM videos;', next);
            },
            function (results, next) {
                console.log(results.rows);
                client.query(';', next);
            },
            function (results, next) {
                console.log("")
                console.log("5. Drop table 'videos'")
                console.log("QUERY: DROP table videos;")
                console.log("=========================")
                client.query('DROP table videos;', next);
            },
    ],
        function (err, results) {
            if (err) {
                console.error("Error inserting into and selecting from 'videos': ", err);
                finish();
            }
            results.rows.forEach(function (row) {
                console.log(row);
            });

            finish();
        });
});

