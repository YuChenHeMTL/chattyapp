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

  //On open connection, attach a color out of 4 available colors and takes it out of the color pool.
  var randomNumber = Math.floor(Math.random() * colors.length);
  const clientColor = colors[randomNumber];
  const colorIndex = colors.indexOf(clientColor);
  colors.splice(colorIndex, 1);

  //On open connection, send the number of open clients to every client.
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({
        type: "userNumber",
        userNumber: wss.clients.size
      }));
    }
  });

  //Handle the messages of the clients
  ws.on('message', function incoming(message) {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type){

      //If the message is a user's message,
      //it attaches the color of the user, their name and the content to the message and sends it to every client.
      case "postMessage":

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

      //If the message is a notification,
      //it attaches the content and sends it to every client.
      case "postNotification":
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

    //On close connection, reattach the client color to the color pool.
    colors.splice(colorIndex, 0, clientColor);;
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