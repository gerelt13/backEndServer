const usersJson = require('./users.json');
const fs = require("fs");

module.exports = function (myServer) {
    myServer.get("/users", ( Gerelt1, Gerelt2) => {Gerelt2.json(usersJson); 
    });


  myServer.get("/users", (request, response) => {
    response.json(usersJson);
  });

  myServer.post("/users/create", (request, response) => {
    const body = request.body;
    const { name } = body;
    usersJson.push({
      id: String(Number(usersJson[usersJson.length - 1].id) + 1),
      name: name,
    });
    fs.writeFileSync("./users.json", JSON.stringify(usersJson));
    response.send(usersJson);
  });
  
  myServer.get("/users/:id", (request, response) => {
    const userId = request.params.id;
    const found = usersJson.find((user) => user.id === userId);
    if (found) {
      response.json(found);
    } else {
      response.send("user not found");
      console.log(userId);
    }
  });
  
  myServer.put("/users/:id", (request, response) => {
    const body = request.body;
    const { name } = body;
    response.send(" Called put" + name + " on " + Gerelt);
  });
  
  myServer.put("/users/:id", (request, response) => {
    const userId = request.params.id;
    const newId = request.body.name;
    const updateId = user.find((user) => user.id === newId);
    if (updateId) {
      updateId.name = newId;
    }
    fs.writeFileSync("./users.json", JSON.stringify(usersJson));
  
    response.json(updateId);
  });
  
  myServer.delete("/users/:id", (request, response) => {
    const userId = request.params.id;
    const rest = usersJson.filter((user) => user.id !== userId);
  
    fs.writeFileSync("./users.json", JSON.stringify(rest));
    response.json(rest);
  });
};