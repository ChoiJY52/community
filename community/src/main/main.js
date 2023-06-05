import React from 'react';
import {menus} from '../index.js';
import './main.css';

class MainPage extends React.Component { // 각 게시판들을 모은 전체 게시판 컴포넌트
    constructor() {
        super();
        this.menu = menus;
    }
    
    render() {
        return (
            <div id="contents">
                <button><a href='/posting'>글쓰기</a></button>
                {this.menu.map(item=>{
                    return(
                        <Eachboard key={item} board={item}/>
                    );
                })}
            </div>
        );
    }
}

class Eachboard extends React.Component { //각 게시판의 게시글들을 받아 보여주는 컴포넌트
    constructor(props){
        super(props);
        this.state = {data: []};
    }
    componentDidMount(){ // 로딩시 게시글 get요청
        fetch(`http://localhost:5000/get_board/${this.props.board}`)
        .then(response=>response.json())
        .then(response=>{
            this.setState({data: response})
        })
        .catch(err=>console.log(err))
    }
    render(){
        const {data} = this.state;
        return(
            <div className='board_info'>
                <h3>{this.props.board}</h3>
                {data.length===0 ? (<h4>게시글이 없습니다.</h4>) : (data.map(item=>{
                    return(
                        <div key={item.post_id} className='post_info'>
                            <p className='del_post_btn' onClick={()=>del_post(item.post_id)}></p>
                            <h3 className='title'><a href={`http://localhost:3000/post/${item.post_id}`}>제목 : {item.title}</a></h3>
                            <p>내용 : {item.contents}</p>
                        </div>
                    )
                }))}
            </div>
        );
    }
}

function del_post(post_id){ // 게시글 삭제 요청
    fetch(`http://localhost:5000/del_post?id=${post_id}`)
    .then(response=>{if(!response.ok){
        console.log('요청 실패');
    }
    else {
        console.log("요청 성공");
        window.location.href = "http://localhost:3000";
    }})
    .catch(err=>{
        console.log("요청 실패");
        console.log(err);
    })
}

export {MainPage, del_post};