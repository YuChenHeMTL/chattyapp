import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.socket= new WebSocket("ws://localhost:3001", "protocolOne")
    this.state = {
        currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
    }

  handleChange(e){
    if (e.keyCode === 13 ){
      let currentName = document.getElementById("userInput").value;
      if (currentName !== this.state.currentUser.name){
        let newMessage = {
          type: "postNotification",
          newName: currentName,
          oldName: this.state.currentUser.name
        }
      } else {
        let newMessage = {
          type: "postMessage",
          username: document.getElementById("userInput").value,
          content: e.target.value
        }
      }
      this.setState({currentUser: {name: currentName}})
      this.socket.send(JSON.stringify(newMessage));
      document.getElementById("contentInput").value = "";
    }
  }

  componentDidMount(){
    this.socket= new WebSocket("ws://localhost:3001")

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {
        case "incomingMessage":
          // handle incoming message
          const receivedMessage = {
            id: data.id,
            username: data.username,
            content: data.content
          }

          const allMessages = this.state.messages.push(receivedMessage)
          this.setState({
            message: allMessages
          })
          break;
        case "incomingNotification":
          // handle incoming notification
          const receivedNotification = {
            newName: data.newName,
            oldName: data.oldName
          }

          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
    }
  };

  render() {
    console.log("Rendering <App />");
    return (
      <div className="body">
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
        </nav>

        <MessageList messages={this.state.messages} />
        <ChatBar state={this.state} handleChange={this.handleChange.bind(this)} />
      </div>
    );
  }
}

export default App;