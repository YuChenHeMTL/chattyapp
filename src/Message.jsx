import React, {Component} from 'react';

class Message extends Component {
  constructor(props){
    super(props)
    this.state = {
      content: props.content,
      urlArray: []
    }
  }

  componentWillMount(){
    console.log("Rendering <Message />")
    const regex = new RegExp(/(https?:\/\/.*\.(?:png|jpg|gif))/i);
    const textexample = "http://www.publicdomainpictures.net/pictures/30000/velka/the-two-red-roses.jpg";
    const url = this.props.content.match(regex)[0];
    this.state.urlArray.push(url)

    if (url !== null){
      const withoutUrl = this.state.content.replace(url, "");
      this.setState({
        content: withoutUrl
      })
    }
  }

  render() {
    const getImg = this.state.urlArray.map(function (url) {
      if (url !== null){
        return <img key={url} src={url} />
      }
    })

    return (
      <div className="message">
        <span className="message-username" style={this.props.color}>{this.props.username}</span>
        <span className="message-content">
          {this.state.content}
          {getImg}
        </span>
      </div>
    );
  }
}

export default Message;