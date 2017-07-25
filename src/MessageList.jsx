import React, {Component} from 'react';
import Message from "./Message.jsx";

class MessageList extends Component {

  constructor (props){
    super(props);
  }

  render() {
    console.log("Rendering <MessageList />")
    function getMessage (props) {
      const Messages = props.map((message) =>
        <Message key={message.id} username={message.username} content={message.content} />
      );
      return Messages;
    }

    return(
      <main className="messages">
        {getMessage(this.props.messages)}
      </main>
    );
  }
}

export default MessageList;