//L154--> we will use this file to connect to our server (client side ) using web socket
const socket = io();

// L160 --> Elements: we want customize the buttons and form to be more practical
// we want enable and disable the buttons and so on
// we conventionally using dollar sign to know that is a dom we wanna use it
///*Elements
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("#send");
const $sendLocation = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");
//*Templates
//const messageTemplate = document.querySelector("#message-template").innerHTML; // to access the html code inside the script template code
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

///*Options
// L167 --> we will use the query string to get the username and room name
//this code will return the query strings f that object
// location.search--> this command if you log it it will return the query string for the url that will begin with question mark
// we use ignore:true to remove the question mark and only access the pure query string

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
}); // we will emit this variable in bottom of the file

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    // this is a mustache object to render our variables
    // we can here access the variables in dynamic
    username: message.username,
    message: message.text,
    // here we use moment script that we loaded in index.html to customize the time
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("send-location", (location) => {
  console.log(location);
  const html = Mustache.render(locationTemplate, {
    // this is a mustache object to render our variables
    //we can here access the variables in dynamic
    username: location.username,
    url: location.link,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});
//const form = document.querySelector("form");
//const message = document.querySelector("input");
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //L160--> disable the button
  $messageFormButton.setAttribute("disabled", "disabled"); // an attribute to disable the button
  //const m=e.target.elements.message.value // this is another way to git our message inside the input form and its better
  // socket.emit("sendMessage",m); // know we can replace the next function
});
$messageFormButton.addEventListener("click", () => {
  console.log("submitted");
  socket.emit("sendMessage", $messageFormInput.value, (error) => {
    //L160--> enable the button
    $messageFormButton.removeAttribute("disabled"); // an attribute to enable the button after the process ends
    $messageFormInput.value = ""; // to remove the previous input
    $messageFormInput.focus(); // to focus on the input after the process ends by the cursor
    // L59 acknowledgement
    if (error) return console.log(error);
    console.log("Message Delivered");
  });
});
$sendLocation.addEventListener("click", () => {
  if (!navigator.geolocation)
    // this is an built in API for sharing location the api website is in bookmarks
    return alert("geolocation is not supported by your browser ");
  $sendLocation.setAttribute("disabled", "disabled");
  navigator.geolocation.getCurrentPosition((position) => {
    // console.log(position.coords.latitude);
    let location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("send-location", location, () => {
      $sendLocation.removeAttribute("disabled");
      console.log("location shared");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/"; // to redirect the user to the home page
    //* we also can use it as disconnect button
  }
}); // here we will process it in back-end

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
