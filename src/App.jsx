import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.userUpdate = this.userUpdate.bind(this);
    this.socket= new WebSocket("ws://localhost:3001")
    this.state = {
        users: 0,
        currentUser: {name: ""}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: []
      }
    }

  //This functions handles the sudmission of new messages
  //It sends to the server the author and the content of the message
  handleChange(e){
    let withoutSpace = e.target.value.trim();//remove the space before and after the message
    if (e.keyCode === 13 && withoutSpace !== ""){
      const oldName = (this.state.currentUser.name) ? this.state.currentUser.name: "Anonymous";
      //if the name is not determined, it is temporarily "Anonymous"

      let newMessage = {
        type: "postMessage",
        username: oldName,
        content: withoutSpace
      }

      this.socket.send(JSON.stringify(newMessage));
      document.getElementById("contentInput").value = ""; //empty the input space
    }
  }

  //This functions handles the sudmission of change of names
  //It sends a string that contains the previous name and the new name to the server
  userUpdate(e){
    let withoutSpace = e.target.value.trim();//remove the space before and after the message
    const newName = e.target.value;
    const oldName = (this.state.currentUser.name) ? this.state.currentUser.name: "Anonymous";
    //if the name is not determined, it is temporarily "Anonymous"

    if (e.keyCode === 13 && withoutSpace !== ""){
      if (newName !== oldName){ // change the name only if the new name is different than the previous name
        this.socket.send(JSON.stringify({
          type: "postNotification",
          content: `${oldName} changed their name to ${newName}`
        }))

        this.setState({
          currentUser: {name: newName}
        })
        // set the state of username to the new name
      }
    }
  }

  //This component handles the incoming messages from the server
  componentDidMount(){

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch(data.type) {

      //If the message is a user's message,
      //it attaches the color of the user, their name and the content to the message and converts it into an actual message
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

        //If the message is a notification,
        //it attaches the content and converts it to an actual notification
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