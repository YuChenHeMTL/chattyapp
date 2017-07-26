import React, {Component} from 'react';
import Message from "./Message.jsx";
import Notification from "./Notification.jsx";

class MessageList extends Component {

  constructor (props){
    super(props);
  }

  render() {
    console.log("Rendering <MessageList />")

    const Messages = this.props.messages.map(function (message) {
      if (message.type === "incomingMessage"){
        return <Message key={message.id} username={message.username} color={message.color} content={message.content} />
      } else {
       return <Notification key={message.id} content={message.content} />
      }
    });

    return(
      <main className="messages">
        {Messages}
      </main>
    );
  }
}

export default MessageList;