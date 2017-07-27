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
    const regex = new RegExp(/(https?:\/\/.*\.(?:png|jpg|gif))/i);
    const url = this.props.content.match(regex);

    if (url !== null){
    this.state.urlArray.push(url[0])
      const withoutUrl = this.state.content.replace(url[0], "");
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