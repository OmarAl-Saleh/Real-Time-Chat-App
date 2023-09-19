//* in this file we create functions that will help us in project so we do not need to write it several time
const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(), // this we git the global 1970 time
  };
};
const generateLocation = (location) => {
  let link =
    "https://google.com/maps?q=" + location.latitude + "," + location.longitude;
  return {
    link,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocation,
};
