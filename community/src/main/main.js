import React from 'react';
import {menus} from '../index.js';
import './main.css';
import { response } from 'express';

class MainPage extends React.Component { // 전체 게시판 컴포넌트
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

class Eachboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {data: []};
    }
    componentDidMount(){ // 로딩시 게시글 get요청
        fetch(`http://localhost:5000/getboard/${this.props.board}`)
        .then(response=>response.json())
        .then(response=>{
            this.setState({data: response})
        })
        .catch(err=>console.log(err))
    }
    // del_post(post_id){ // 게시글 삭제 요청
    //     fetch(`http://localhost:5000/del_post/`, {
    //         method: 'DELETE',
    //         body: {post_id: post_id}
    //     })
    //     .then(response=>{if(!response.ok){throw new Error('요청 실패')}})
    //     .catch(err=>console.log(err))
    // }
    render(){
        const {data} = this.state;
        return(
            <div className='board_info'>
                <h3>{this.props.board}</h3>
                {data.length===0 ? (<h4>게시글이 없습니다.</h4>) : (data.map(item=>{
                    return(
                        <div key={item.post_id} className='post_info'>
                            <p className='del_btn' onClick={this.del_post(item.post_id)}></p>
                            <h3 className='title'><a href={`http://localhost:3000/post/${item.post_id}`}>제목 : {item.title}</a></h3>
                            <p>내용 : {item.contents}</p>
                        </div>
                    )
                }))}
            </div>
        );
    }
}

export default MainPage;