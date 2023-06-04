import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PostPage from './post/post.js';
import MainPage from './main/main.js';
import PostingPage from "./posting/posting.js";
import BoardPage from './board/board.js';
import './index.css';

const menus = ["React", "Node.js", "MySQL", "MongoDB"];

class Root extends React.Component { //전체페이지 컴포넌트
    constructor(){
        super()
    }

    render() {
        return( // 리액트 라우터를 통해 멀티페이지 구현(React는 기본적으로 싱글페이지를 지원)
            <div id='container'>
                <BrowserRouter>
                    <Header/>
                    <main>
                        <Sidebar/>
                        <Routes>
                            <Route path='/' element={<MainPage/>}></Route>
                            <Route path='/board/*' element={<BoardPage/>}></Route>
                            <Route path='/post/*' element={<PostPage/>}></Route>
                            <Route path='/posting' element={<PostingPage/>}></Route>
                        </Routes>
                    </main>
                </BrowserRouter>
            </div>
                
        );
    }
}

class Header extends React.Component { //헤더 컴포넌트
    render() {
        return(
            <header>
                <h1 id="header_logo"><a href='/'>Develop Together</a></h1>
            </header>
        );
    }
}

class Sidebar extends React.Component { //사이드 바 컴포넌트
    constructor(){
        super()
        this.menu = menus;
        this.path = this.menu.map(function(item){  //사이드바의 목록들의 이름을 url로 사용하기 위해 앞에 "/"를 추가
            return "/board/" + item;
        })
    }
    render() {
        return (
            <div id="sidebar">
                {this.menu.map((item, index) => (
                    <li key={item}><a href={this.path[index]}>{item}</a></li>
                ))}
            </div>
        );
    }
}

export {menus};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root/>);