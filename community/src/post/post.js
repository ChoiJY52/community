import React from 'react';
import './post.css';

class PostPage extends React.Component { //개별 게시글 컴포넌트
    constructor(props){
        super(props);
        this.url = window.location.pathname;
        this.post_id = this.url.substring(this.url.lastIndexOf("/")+1);
        this.state = {data: []};
    }
    componentDidMount(){
        fetch(`http://localhost:5000/getpost/${this.post_id}`)
        .then((response) => response.json())
        .then((response) => {
            this.setState({data: response});
        })
        .catch((err) => {
            console.log(err);
        });
    }
    render(){
        const {data} = this.state;

        return(
            <div id='contents'>
                {data.map(item=>{
                    return(
                        <div key={item.post_id} id='post'>
                            <h2 id='post_title'>제목 : {item.title}</h2>
                            <p id='post_content'>내용 : <br></br> {item.contents}</p>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default PostPage;