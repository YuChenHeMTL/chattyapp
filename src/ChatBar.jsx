import React, {Component} from 'react';

class Chatbar extends Component {
  constructor (props){
    super(props);
  }

  render() {
    console.log("Rendering <ChatBar />");
    return (
        <footer className="chatbar">
          <input className="chatbar-username" placeholder="Your Name (Optional)" defaultValue={this.props.state.currentUser.name} onKeyUp={this.props.userUpdate} id="userInput" />
          <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyUp={this.props.handleChange} id="contentInput"/>
        </footer>
    );
  }
}

export default Chatbar;