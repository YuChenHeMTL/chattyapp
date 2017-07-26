// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require("uuid/v4");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
var colors = ["blue", 'green','purple', 'red'];

wss.on('connection', (ws) => {
  console.log('Client connected');
  var randomNumber = Math.floor(Math.random() * colors.length);
  const clientColor = colors[randomNumber];
  const colorIndex = colors.indexOf(clientColor);
  colors.splice(colorIndex, 1);

  console.log(colors)
  console.log(clientColor, colors.length);


  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({
        type: "userNumber",
        userNumber: wss.clients.size
      }));
    }
  });

  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type){
      case "postMessage":
        console.log(`User ${parsedMessage.username} said ${parsedMessage.content}`);

        const newMessage = {
          type: "incomingMessage",
          color: {color: clientColor},
          id: uuidv4(),
          username: parsedMessage.username,
          content: parsedMessage.content
        }

        wss.clients.forEach(function each(client) {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
        break;

      case "postNotification":
        console.log(parsedMessage.content)
        const newNotification = {
          type: "incomingNotification",
          id: uuidv4(),
          content: parsedMessage.content
        }

        wss.clients.forEach(function each(client) {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(newNotification));
          }
        });

        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + data.type);
    }
  });
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')

    colors.splice(colorIndex, 0, clientColor);

    wss.clients.forEach(function each(client) {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: "userNumber",
          userNumber: wss.clients.size
        }));
      }
    });
  });
});