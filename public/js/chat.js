//L154--> we will use this file to connect to our server (client side ) using web socket
const socket = io();
console.log("the life is difficult");
socket.on("countUpdated", (count) => {
  // here is to response if this event is emit on the server side so we send data for the client
  console.log("The count has been updated!" + count);
});
document.querySelector('#increment').addEventListener("click", () => {
	console.log("Clicked");
	socket.emit("increment");// to send data from client to server side in real Time
})