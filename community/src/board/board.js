import React from 'react';
import './board.css';
import {del_post} from '../main/main.js';

class BoardPage extends React.Component { // 개별 게시판 컴포넌트
    constructor(){
        super();
        this.url = window.location.pathname;
        this.board = this.url.substring(this.url.lastIndexOf('/')+1);
        this.state = {data: []};
    }
    componentDidMount(){ // 페이지가 로드 될 때 서버에 get요청
        fetch(`http://localhost:5000/get_board/${this.board}`)
        .then((response)=>response.json())
        .then((response)=>{
            this.setState({data: response})
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    render(){
        const {data} = this.state;
        return(
            <div id='contents'>
                <button><a href='/posting'>글쓰기</a></button>
                <h3>{this.board}</h3>
                {data.length===0 ? (<h4>게시글이 없습니다.</h4>) : (data.map((item)=>{
                    return(
                        <div key={item.post_id} className='post_info'>
                            <p className='del_post_btn' onClick={()=>del_post(item.post_id)}></p>
                            <h3 className='title'><a href={`http://localhost:3000/post/${item.post_id}`}>{item.title}</a></h3>
                            <p>{item.contents}</p>
                        </div>
                    )
                }))}
            </div>
        )
    }
}

export default BoardPage;