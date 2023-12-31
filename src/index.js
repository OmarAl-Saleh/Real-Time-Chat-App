express = require("express");
// L154
// we need to refactoring the way we set the server by using the http the server constant to enable us to us socket.io
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server); // to configure our socket io library to work with our server for that we make the server
const port = process.env.PORT || 3000;
const path = require("path");
const Filter = require("bad-words"); // an npm module that detect the bad and profane word
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
const { generateMessage, generateLocation } = require("./utils/message");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

// server(emit)--> client(received)--countUpdated
// client(emit) --> server(emit) --increment
io.on("connection", (socket) => {
  //L154 --> to the socketio work whenever we have a new connection to our server
  // to work we need also to define the socketio on the client side file such as the html files
  // L155 --> the socket parameter is an object that come from the each client separately so if we have 5 client the function will run 5 times and so on
  console.log("New WebSocket connection");

  // socket.emit("message", generateMessage("Welcome to our server !"));
  // socket.broadcast.emit("message", generateMessage(" A new user has joined")); // we use broadcast to send this message to all users except the socket object
  //L67
  socket.on("join", ({ username, room }, callback) => {
    //L170
    const { error, user } = addUser({
      id: socket.id /*unique identifier come by default by socket */,
      username,
      room,
    });
    // here we can use spread operator like this if we not destructuring the username and room and make them an object called option
    //const {error,user}=addUser{id:socket.id,...options};

    if (error) {
      return callback(error); // Remember: we use return to stop the code running
    }

    // we user user.room instead of only room because we customize it in users.js
    socket.join(user.room); // this is a build in function to join a room
    socket.emit("message", generateMessage("Welcome to our server !"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined`)); // we use broadcast to send this message to all users except the socket object
    // L172
    // we define a new event to customize te sidebar
    io.to(user.room).emit("roomData", {
      room: user.room,
      users:getUsersInRoom(user.room),
    })
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(message)) return callback("Profanity is not allowed ");
    io.to(user.room).emit("message", generateMessage(message, user.username));
    //L159 acknowledgement
    callback("Delivered!");
  });
  socket.on("send-location", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "send-location",
      generateLocation(user.username, location)
    );
    callback();
  });

  socket.on("disconnect", () => {
    // a build in event if the socket user is leave the server (close the page )
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage(`${user.username} has left!`)

      );
      //L172
      io.to(user.room).emit("roomData", {
        room: user.room,
        users:getUsersInRoom(user.room),
      })
    }
  });
});

server.listen(port, () => {
  console.log("Server is up on port " + port);
});

//*first commit the counter
// let count = 0;
// server(emit)--> client(received)--countUpdated
// client(emit) --> server(emit) --increment
//io.on("connection", (socket) => {
//L154 --> to the socketio work whenever we have a new connection to our server
// to work we need also to define the socketio on the client side file such as the html files
// L155 --> the socket parameter is an object that come from the each client separately so if we have 5 client the function will run 5 times and so on
//   console.log("New WebSocket connection");
//   socket.emit(
//     "countUpdated",
//     count /* will the callback parameter on the client side */
//   ); // this function to send an event from the server to the client side so to chat.js file
//   socket.on("increment", () => {
// to receive data from the client side
//count++;
//socket.emit("countUpdated", count);// to send the new count to the server
// this will send the emit to only the socket parameter client
// 	  io.emit("countUpdated", count);// this will send the emit to all client on the server not only the owner of socket object

//   });
// });
