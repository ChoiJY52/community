import React from 'react';
import './post.css';

class PostPage extends React.Component { //개별 게시글 컴포넌트
    constructor(props){
        super(props);
        this.url = window.location.pathname;
        this.post_id = this.url.substring(this.url.lastIndexOf("/")+1);
        this.state = {contents: [], comments: []};
    }
    componentDidMount(){
        fetch(`http://localhost:5000/get_post/${this.post_id}`) // 게시글 내용 요청
        .then((response) => response.json())
        .then((response) => {
            this.setState({contents: response});
        })
        .catch((err) => {
            console.log(err);
        });

        fetch(`http://localhost:5000/get_comment/${this.post_id}`) // 댓글 요청
        .then((response)=>response.json())
        .then((response)=>{
            this.setState({comments: response});
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    render(){
        const {contents} = this.state;
        const {comments} = this.state;
        return(
            <div id='contents'>
                {contents.map(item=>{
                    return(
                        <div key={item.post_id} id='post'>
                            <h2 id='post_title'>제목 : {item.title}</h2>
                            <p id='post_content'>내용 : <br></br> {item.contents}</p>
                        </div>
                    )
                })}
                <form action='http://localhost:5000/write_comment' method='post' id='write_comment'>
                    <textarea name='comment' placeholder='내용' type='text' required></textarea>
                    <button id='submit_btn' type='submit'>등록</button>
                    <input type='hidden' name='post_id' value={this.post_id}></input>
                </form>
                {comments.map((item, index)=>{
                    return(
                        <div key={index} className='comments'>
                            <p className='del_comment_btn' onClick={()=>del_comment(item.comment_id, item.post_id)}></p>
                            <p>{item.comment}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}

function del_comment(comment_id, post_id){ // 댓글 삭제 요청
    fetch(`http://localhost:5000/del_comment/${comment_id}`)
    .then((response)=>{
        if(response.ok){
            window.location.href = `http://localhost:3000/post/${post_id}`;
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}

export default PostPage;