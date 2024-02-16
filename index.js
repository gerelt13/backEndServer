const express = require("express");
const usersJson = require("./users.json");
require("./mongodb");

const port = 1000;

const fs = require("fs");
const myServer = express();

require("./users")(myServer);
require("./posts")
(myServer);


myServer.use(express.json());


myServer.listen(port, () => {
  console.log("myServer running !");
});
