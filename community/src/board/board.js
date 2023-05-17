import React from 'react';
import './board.css';

class BoardPage extends React.Component {
    constructor(){
        super();
        this.url = window.location.pathname;
        this.board = this.url.substring(this.url.lastIndexOf('/')+1);
        this.state = {data: []};
    }
    componentDidMount(){
        fetch(`http://localhost:5000/getboard/${this.board}`)
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