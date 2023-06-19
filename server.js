const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const server = express();
const {MongoClient} = require('mongodb');
const port = 5000;

const mongoURL = 'mongodb://127.0.0.1:27017'; // mongodb 연결 URL (여기서 host번호를 localhost로 하면 안됨 - 이유 모름)
const client = new MongoClient(mongoURL);
const dbName = 'post_db';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/Users/Choi/Desktop/SNS/image/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const ImgUpLoad = multer({storage});
const upload = multer();

const sql = mysql.createConnection({ //데이터베이스 접근을 위한 정보
  host: 'localhost',
  user: 'root',
  password: 'Wjddyd@0215',
  database: dbName,
})

sql.connect(); // MySQL과 연결

const corsOptions = { // cors 이슈 해결을 위한 옵션
  origin: 'http://localhost:3000',
}


server.post('/write_image', cors(corsOptions), ImgUpLoad.fields([{name: 'img'}, {name: 'post_id'}]), async (req,res)=>{
  try{
    console.log("연결 중!!!!!");
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('posts');
    console.log('연결 완료!!!');
    console.log(req.body.post_id, req.files.img);
    const result = await collection.insertOne({post_id: req.body.post_id, img: req.files.img});
    
    res.send(result);
  }catch(err){
    console.log(err);
  }
  
})

server.get('/get_image/:post_id', cors(corsOptions), async (req,res)=>{
  try{
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('posts');

    const result = await collection.findOne({post_id: req.params.post_id});
    res.sendFile(result.img[0].destination+result.img[0].filename);
  }catch(err){
    console.log("에러 : ", err);
  }
})

server.post('/write_post', cors(corsOptions), upload.fields([{name: 'text'}, {name: 'title'}, {name: 'board'}]), (req,res)=>{
  const query = `INSERT INTO posts (title, contents, board) VALUES ("${req.body.title}", "${req.body.text}", "${req.body.board}")`;
  sql.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else res.send(result);
  })
})

server.get('/get_post/:post_id', cors(corsOptions), (req, res)=>{ // 게시글 읽기 api
  const query = `SELECT * FROM posts WHERE post_id = "${req.params.post_id}"`;
  sql.query(query, (err,result)=>{
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
  sql.query(query, (err,result)=>{
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
  sql.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      const query = `DELETE FROM comments WhERE post_id=${req.query.id}`
      sql.query(query, (err,result)=>{
        if(err){
          console.log(err);
        }
        else res.send(result);
      })
    }
  })
})

server.post('/write_comment', cors(corsOptions), upload.fields([{name: "post_id"}, {name: "comment"}]), (req, res)=>{ // 댓글 작성 api
  const query = `INSERT INTO comments (post_id, comment) VALUES ("${req.body.post_id}","${req.body.comment}")`
  sql.query(query, (err, result)=>{
    if(err){
      console.log(err);
    }
    else res.redirect(`http://localhost:3000/post/${req.body.post_id}`)
  })
})

server.get('/get_comment/:post_id', cors(corsOptions), (req,res)=>{ //댓글 읽기 api
  const query = `SELECT * FROM comments WHERE post_id="${req.params.post_id}"`
  sql.query(query, (err,result)=>{
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
  sql.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      res.send(result);
    }
  })
})

server.get("/test", cors(corsOptions), (req,res)=>{
  const query = "SELECT images FROM posts"
  sql.query(query, (err,result)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(result);
      res.send(result);
    }
  })
})

server.listen(port, ()=>{
  console.log(`Listing on port ${port}`);
})