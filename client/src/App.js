import React from 'react';
import './App.css';
import config from './config';
import io from 'socket.io-client';
import BottomBar from './BottomBar';

class App extends React.Component{
  constructor(props){
    super(props);

    this.state={
      chat:[],
      content:'',
      name:'',
    };
  }

  componentDidMount(){
    this.socket = io(config[process.env.NODE_ENV].endpoint);

    //load last 10 msgs in window
    this.socket.on('init', (msg) => {
      let msgReversed = msg.reverse();
      this.setState((state) => ({
        chat: [...state.chat, ...msgReversed],
      }), this.scrollToBottom);
    });

    //update chat if new msg
    this.socket.on('push', (msg) => {
      this.setState((state) => ({
        chat: [...state.chat, msg],
      }), this.scrollToBottom);
    });
  }
  
  //save msg that user is typing
  handleContent(e){
    this.setState({
      content: e.target.value,
    });
  }
  
  //show name
  handleName(e){
    this.setState({
      name: e.target.value,
    });
  }

  handleSubmit(e){
    //prevent form from reload current page
    e.preventDefault();

    //send new msg to server
  this.socket.emit('message', {
    name: this.state.name,
    content: this.state.content,
    
  });

  this.setState((state)=>{
    //update chat with users new msg and remove current
    return{
      chat: [...state.chat, {
        name: state.name,
        content: state.content,
      }],
      content:'',
      
    };
  },this.scrollToBottom);
  }

  //Scroll window to last msg
  scrollToBottom(){
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }
  
  render(){
    return(
      <div>
        <section id="chat">
          {this.state.chat.map((elm, i) => {
            return(
              <div key={i}>
                <p>{elm.name}</p>
                <p>{elm.content}</p>

              </div>
            )
          })}
        </section>
        <BottomBar content={this.state.content}
        handleContent={this.handleContent.bind(this)}
        handleName={this.handleName.bind(this)}
        handleSubmit={this.handleSubmit.bind(this)}
        name={this.state.name}
        />
      </div>
    )
  }
}

export default App;
