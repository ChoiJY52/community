import React from 'react';
import {menus} from '../index';
import './posting.css';

class PostingPage extends React.Component { // 글쓰기 컴포넌트
    render(){
        return(
            <div id='contents'>
                <form action='http://localhost:5000/write_post' method='post' id='write_post'>
                    <select id='select_board' name='board'>
                        {menus.map(item=>(
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <input className='title_box' name='title' placeholder='제목' type='text' required></input>
                    <textarea className='content_box' name='contents' placeholder='내용' required></textarea>
                    <button id='submit_btn' type='submit'>등록</button>
                </form>
            </div>
        );
    }
}


export default PostingPage;