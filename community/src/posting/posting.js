import React from 'react';
import {menus} from '../index';
import './posting.css';

class PostingPage extends React.Component { // 글쓰기 컴포넌트
    handleSubmit(event){
        // event.preventDefault();

        const text = document.querySelector(".text");
        const title = document.querySelector('.title_box');
        const board = document.querySelector("#select_board");
        const image = document.querySelector('#img').files[0];
        const formData = new FormData();
        const imgData = new FormData();

        const string = JSON.stringify(image);
        const blob = new Blob([string]);
        console.log(blob);

        imgData.set("img", blob);
        imgData.set("post_id", board.value);
        formData.set("text", text.textContent);
        formData.set("title", title.value);
        formData.set("board", board.value);
        
        fetch("http://localhost:5000/write_post", {method: "POST", body: formData, enctype: "multipart/form-data"})
        .then((response)=>{
            if(response.ok){
                window.location.href = "http://localhost:3000";
            }
        })
        fetch("http://localhost:5000/write_image", {method: "POST", body: imgData, enctype: "multipart/form-data"})
        .then((response)=>{
            if(!response.ok){
                console.log("이미지 전송 오류");
            }
        })
    }
    handleImgChange(event){
        console.log(event.target.files[0]);
        const imgURL = URL.createObjectURL(event.target.files[0]);
        const contents_box = document.querySelector('#contents_box');
        const element = document.createElement('img');
        element.src = imgURL;
        element.className = 'image';
        element.alt = '';
        contents_box.appendChild(element);
    }
    
    render(){
        return(
            <div id='contents'>
                <select id='select_board' name='board'>
                    {menus.map(item=>(
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
                <input type='file' id='img' name='img' onChange={this.handleImgChange.bind(this)}></input>
                <input className='title_box' name='title' placeholder='제목' type='text' required></input>
                <ContentBox/>
                <button id='submit_btn' type='submit' onClick={this.handleSubmit.bind(this)}>등록</button>
            </div>
        );
    }
}

class ContentBox extends React.Component{  //게시글의 주요내용(글, 그림등) 컴포넌트
    handleFocus(event){
        if(event.target.textContent === '내용을 입력하세요.'){
            event.target.textContent = '';
        }
    }
    handleBlur(event){
        if(event.target.textContent === '' && !event.target.nextElementSibling){
            event.target.textContent = '내용을 입력하세요.'
        }
    }
    handleKeyDown(event){
        const target = event.target;
        if(event.key === 'Enter' && target.nextElementSibling){
            event.preventDefault();
            const contents_box = document.querySelector('#contents_box')
            const element = document.createElement('p');
            element.className = 'text';
            element.contentEditable = 'true';
            element.onKeyDown = this.handleBackspace.bind(this);
            contents_box.appendChild(element);
            console.log(target.nextElementSiblingSibling);
            target.nextElementSibling.focus();
        }
        else if(target.textContent === '' && event.keyCode === 8 && !(target.className === 'text first-line')){
            if(target.previousSibling){
                target.previousSibling.focus();

                const range = document.createRange();
                const selection = window.getSelection();

                range.selectNodeContents(target.previousSibling);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                event.preventDefault();
                target.remove();
            }

        }
    }
    handleBackspace(event){
        if((event.target.textContent === '') && (event.keyCode === 8)){
            console.log(event.target);
            event.target.remove();

            const Sibling = event.target.previousSibling;
            if(Sibling){
                Sibling.focus();
            }
        }
    }
    render(){
        return(
            <div id='contents_box' onKeyDown={this.handleKeyDown.bind(this)}>
                <p className='text first-line' contentEditable='true' onFocus={this.handleFocus.bind(this)} onBlur={this.handleBlur.bind(this)}><span contentEditable>내용을 입력하세요.</span></p>
            </div>
        );
    }
}

export default PostingPage;