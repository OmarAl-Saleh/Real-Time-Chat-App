//L154--> we will use this file to connect to our server (client side ) using web socket
const socket = io();
socket.on("WelcomeMessage", (message) => {
  console.log(message);
});
const form = document.querySelector("form");
const message = document.querySelector("input");
form.addEventListener("submit", (e) => {
	e.preventDefault();
	//const m=e.target.elements.message.value // this is another way to git our message inside the input form and its better
	// socket.emit("sendMessage",m); // know we can replace the next function
});
document.querySelector("#send").addEventListener("click", () => {
  console.log("submitted");
  socket.emit("sendMessage", message.value);
});
 socket.on("sendMessage", (message) => {
    console.log(message);
  });
///* for L155 counter server
// console.log("the life is difficult");
// socket.on("countUpdated", (count) => {
//   // here is to response if this event is emit on the server side so we send data for the client
//   console.log("The count has been updated!" + count);
// });
// document.querySelector('#increment').addEventListener("click", () => {
// 	console.log("Clicked");
// 	socket.emit("increment");// to send data from client to server side in real Time
// })
