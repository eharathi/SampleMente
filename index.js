var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { Client } = require('pg');
const { Pool } = require('pg');


let database_url = process.env.DATABASE_URL;
if (database_url == null || database_url == "") {
  database_url = 'postgres://postgres:@localhost:5432/postgres';
}
console.log(database_url);
const client = new Client({
  connectionString: database_url,
  ssl:{
  	rejectUnauthorized: false
  }
});
//client.connect();


const pool = new Pool({
  connectionString: database_url,
  ssl: false
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
let rows;
client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err){console.log(err);} else {
  // 	for (let row of res.rows) {
  //   console.log(JSON.stringify(row));
  // }
  rows=res.rows;
  client.end();
  }
  
});
console.log(JSON.stringify(rows))
  response.json({ info: 'Node.js, Express, and Postgres API wonderful'})
})


app.get('/user', async (request, response) => {
	
	
// let rows;
//  client.query('SELECT * from users;', (err, res) => {
//   if (err) console.log(err);
//   // for (let row of res.rows) {
//    console.log(JSON.stringify(res.rows));
//   // }
//   rows = {"resultd":res.rows};

// });
try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM user');
      const results = { 'results': (result) ? result.rows : null};
      response.send( results );
      client.release();
  }
  catch (err){
   console.error(err);
   response.send({ info: 'Node.js, Express, and Postgres API wonderful'})
  }
  //response.json({ info: 'Node.js, Express, and Postgres API wonderful'})
})
app.listen(port);


