const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const server = express();
const port = 5000;

const database = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Wjddyd@0215',
  database: 'post_db',
})

database.connect();

const corsOptions = {
  origin: 'http://localhost:3000',
}
server.use(bodyparser.json());
server.use(bodyparser.urlencoded({extended: true}));

server.post('/write_post', cors(corsOptions), (req, res)=>{
  const sqlQuery = `INSERT INTO posts (title, contents, board) VALUES ("${req.body.title}","${req.body.contents}", "${req.body.board}")`;
  database.query(sqlQuery, (err)=>{
    if(err) {
      res.send("에러");
    }
    else res.redirect('http://localhost:3000');
  });
})

server.get('/getpost/:post_id', cors(corsOptions), (req, res)=>{
  const query = `SELECT * FROM posts WHERE post_id = "${req.params.post_id}"`;
  database.query(query, (err,result)=>{
    if(err) {
      console.log(err);
    }
    else {
      console.log(result);
      res.send(result);
    }
  });
})

server.get('/getboard/:board', cors(corsOptions), (req, res)=>{
  const query = `SELECT * FROM posts WHERE board="${req.params.board}"`;
  database.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else {
      res.send(result);
    }
  })
})

server.listen(port, ()=>{
  console.log(`Listing on port ${port}`);
})