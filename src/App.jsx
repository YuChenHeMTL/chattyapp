import React, {Component} from 'react';
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.socket = new WebSocket('ws://127.0.0.1:3000');
    this.state = {
        currentUser: {name: "Bob"}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: [
          {
            id: 1,
            username: "Bob",
            content: "Has anyone seen my marbles?",
          },
          {
            id: 2,
            username: "Anonymous",
            content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
          }
        ]
      }
    }

  componentDidMount() {
    const exampleSocket = new WebSocket("ws://localhost:3001", "protocolOne");
  }

  handleChange(e){
    if (e.keyCode === 13){
      let newMessage = {
        id: this.state.messages.length + 1,
        username: this.state.currentUser.name,
        content: e.target.value
      }

      let currentMessages = this.state.messages.concat(newMessage);
      this.setState({messages: currentMessages})
      document.getElementById("contentInput").value = "";
    }
  }

  render() {
    console.log("Rendering <App />")
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