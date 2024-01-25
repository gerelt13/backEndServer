const express = require("express");

const port = 1000;
const myServer = express();

myServer.get("/", (request, response) => {
  response.send("hello manaihaeeeean!");
});

// myServer.get("/about", (request, response) => {
//   response.send("This is about route");
// });

// myServer.get("/about/:id", (request, response) => {
//     const {id} = request.params;
//     response.send("This is about route " + id);
// });

// myServer.get("/about/:id/:name", (request, response) => {
//     const {id} = request.params;
//     console.log ( request.body );
//     response.send("This is about route " + id);
// });


myServer.listen(port, () => {
  console.log("myServer running greatly!");
});
