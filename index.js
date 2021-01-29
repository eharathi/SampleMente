var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { Client } = require('pg');
const { Pool } = require('pg');
const { Console } = require('console');



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

app.set('view engine', 'pug')
app.use(session({
    secret: 'randomkeyForSession',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/dashboard', async function(request, response) {
    if (request.session.loggedin) {

      console.log(request.session);
      if(request.session.accounttype == 0){
        
        const client = await pool.connect();
        const resultList = await client.query('SELECT * FROM results WHERE studentid = $1 ', [request.session.userid]);

        const results = { 'result': (resultList) ? resultList.rows : null};
        console.log(results.result);
         response.render('users', { username: request.session.username, CGPA :results.result[0].cgpa,Attendence: results.result[0].attendence });

      }else{
        const client = await pool.connect();
        const resultList = await client.query('SELECT users.name, results.cgpa,results.attendence FROM results INNER JOIN users ON results.studentId=users.loginid where users.accounttype=0');
      const results = { 'result': (resultList) ? resultList.rows : null};
      console.log(results.result);
      response.render('menter', { results: results.result, username:request.session.username});
      }

    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.get('/hello', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
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
      const result = await client.query('SELECT * FROM users');
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

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { error: false });
});

app.post('/login', async(request, response) => {
    var username = request.body.username;
    var password = request.body.password;
    var session = request.session;

    try {
      const client = await pool.connect();
      const usersList = await client.query('SELECT * FROM users WHERE loginid = $1 AND password = $2', [username, password]);
      
      const users = { 'user': (usersList) ? usersList.rows : null};
      console.log(users.user);

      if (users.user.length ==1){
        console.log(users.user[0]);
        request.session.username=users.user[0].name;
        request.session.userid=users.user[0].loginid;
        request.session.loggedin = true;
        request.session.accounttype=users.user[0].accounttype;
        console.log("redirecting"); 
        response.redirect('/dashboard')  
        
        client.release  
    }else{
      response.render('index', { error: true });
      client.release
    }
    
  }
  catch (err){
   console.error(err);
   response.render('index', { error: true });
  }finally {
    client.release;
  }

})

var login =function(user,password){
console.log(user,password)
    if(user==="stu" && password==="admin"){
        return true;
    }
    else{
        return false;
    }
}


// Default every route except the above to serve the index.html
app.get('/htm', function(req, res) {
  res.sendFile(path.join(__dirname + '/sample.html'));
});

app.listen(port);


