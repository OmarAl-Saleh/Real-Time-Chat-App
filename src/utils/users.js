//L168
// addUser , removeUser , getUser, getUsersInRoom
const users = [];
const addUser = ({ id, username, room }) => {
  //Clean the data
  // using trim to remove the left added spaces and lowercase to make the user not case sensitive (AnDrew=andrew) the same user
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate the data
  if (!username || !room)
    return {
      error: "Username and room are required!",
    };
  // check for existing user
  // if we have an existing user in the room so we can't add the new user to it
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser)
    return {
      error: "Username is in use! ",
    };

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1)
    return users.splice(index, 1 /*number of items we wanna remove */)[0]; // to remove it from the array by it index and we return the removed user
  // we use [0] because it will return an array of the items removed so we only the return the first index
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => {
    return user.room === room;
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
// testing
// addUser({
//   id: 22,
//   username: "Andrew",
//   room: "   south Philly",
// });

// addUser({
//   id: 24,
//   username: "omar",
//   room: "   south Philly",
// });

// addUser({
//   id: 23,
//   username: "Andrew",
//   room: "Center city",
// });
//console.log(users);
// const res = addUser({
// 	id: 33,
// 	username: 'Andrew',
// 	room:"south Philly "
// })
// console.log(res)
// const removedUser = removeUser(22);
// console.log(removedUser);
// console.log(users);
// const user = getUser(421);
// const use = getUser(23);
// console.log(user);
// console.log(use);
// const userList = getUsersInRoom("south Philly");
// console.log("user list in the south philly ", userList);
