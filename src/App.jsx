import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.userUpdate = this.userUpdate.bind(this);
    this.socket= new WebSocket("ws://localhost:3001", "protocolOne")
    this.state = {
        users: 0,
        currentUser: {name: ""}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
    }

  handleChange(e){
    if (e.keyCode === 13){
      const oldName = (this.state.currentUser.name) ? this.state.currentUser.name: "Anonymous";

      let newMessage = {
        type: "postMessage",
        username: oldName,
        content: e.target.value
      }

      this.socket.send(JSON.stringify(newMessage));
      document.getElementById("contentInput").value = "";
    }
  }

  userUpdate(e){
    const newName = e.target.value;
    const oldName = (this.state.currentUser.name) ? this.state.currentUser.name: "Anonymous";
    if (e.keyCode === 13 && e.target.value !== ""){
      if (newName !== oldName){
        this.socket.send(JSON.stringify({
          type: "postNotification",
          content: `${oldName} changed their name to ${newName}`
        }))

        this.setState({
          currentUser: {name: newName}
        })
      }
    }
  }

  componentDidMount(){

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {
        case "incomingMessage":
          // handle incoming message
          const receivedMessage = {
            type: "incomingMessage",
            id: data.id,
            color: data.color,
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
            type: "incomingNotification",
            id: data.id,
            content: data.content
          }

          const allNotifications = this.state.messages.concat(receivedNotification);
          this.setState({
            messages: allNotifications
          })
          break;
        case "userNumber":
          this.setState({
            users: data.userNumber
          })
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
    }
  };

  render() {
    return (
      <div className="body">
        <nav className="navbar">
          <a href="/" className="navbar-brand">Chatty</a>
          <div className="userNumber">{this.state.users} users online</div>
        </nav>

        <MessageList messages={this.state.messages} />
        <ChatBar state={this.state} handleChange={this.handleChange.bind(this)} userUpdate={this.userUpdate.bind(this)} />
      </div>
    );
  }
}

export default App;