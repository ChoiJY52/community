import React from 'react';
import {menus} from '../index';
import './main.css';

class MainPage extends React.Component { //메인페이지 컴포넌트
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
    componentDidMount(){
        fetch(`http://localhost:5000/getboard/${this.props.board}`)
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