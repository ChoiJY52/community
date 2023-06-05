const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bodyparser = require('body-parser');
const server = express();
const port = 5000;

const database = mysql.createConnection({ //데이터베이스 접근을 위한 정보
  host: 'localhost',
  user: 'root',
  password: 'Wjddyd@0215',
  database: 'post_db',
})

database.connect(); // 데이터베이스와 연결

const corsOptions = { // cors 이슈 해결을 위한 옵션
  origin: 'http://localhost:3000',
}
server.use(bodyparser.json()); // post요청 시 req.body의 데이터를 읽기 위한 처리
server.use(bodyparser.urlencoded({extended: true})); // url인코딩 위한 처리

server.post('/write_post', cors(corsOptions), (req, res)=>{ // 게시글 작성 api
  const sqlQuery = `INSERT INTO posts (title, contents, board) VALUES ("${req.body.title}","${req.body.contents}", "${req.body.board}")`;
  database.query(sqlQuery, (err)=>{
    if(err) {
      console.log(err);
    }
    else res.redirect('http://localhost:3000');
  });
})

server.get('/get_post/:post_id', cors(corsOptions), (req, res)=>{ // 게시글 읽기 api
  const query = `SELECT * FROM posts WHERE post_id = "${req.params.post_id}"`;
  database.query(query, (err,result)=>{
    if(err) {
      console.log(err);
    }
    else {
      res.send(result);
    }
  });
})

server.get('/get_board/:board', cors(corsOptions), (req, res)=>{ // 특정 게시판 전체 게시글 읽기 api
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

server.get('/del_post/', cors(corsOptions), (req, res)=>{ // 게시글 삭제 요청 api
  const query = `DELETE FROM posts WHERE post_id=${req.query.id}`
  database.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else res.send(result);
  })
})

server.post('/write_comment', cors(corsOptions), (req, res)=>{ // 댓글 작성 api
  const query = `INSERT INTO comments (post_id, comment) VALUES ("${req.body.post_id}","${req.body.comment}")`
  database.query(query, (err, result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.redirect(`http://localhost:3000/post/${req.body.post_id}`);
    }
  })
})

server.get('/get_comment/:post_id', cors(corsOptions), (req,res)=>{ //댓글 읽기 api
  const query = `SELECT * FROM comments WHERE post_id="${req.params.post_id}"`
  database.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  })
})

server.get("/del_comment/:comment_id", cors(corsOptions), (req,res)=>{
  const query = `DELETE FROM comments WHERE comment_id="${req.params.comment_id}"`
  database.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  })
})

server.listen(port, ()=>{
  console.log(`Listing on port ${port}`);
})