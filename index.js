var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { Client } = require('pg');


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});



var app = express();

app.use(session({
    secret: 'randomkeyForSession',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/dashboard', function(request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.get('/', (request, response) => {
	client.connect();
let row1;
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
row1 = row;
  }
  client.end();
});

  response.json({ info: 'Node.js, Express, and Postgres API wonderful'})
})
app.listen(port);


