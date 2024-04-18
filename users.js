const usersJson = require("./users.json");
// const postsJson = require("./posts.json");


const fs = require("fs");
const postsJson = require("./posts.json");
const comments = require("./comments");

const getUserPosts = (userId) => {
  return postsJson.filter((value) => value.owner == userId);
};

module.exports = function (myServer) {
  myServer.get("/users", (request, response) => {
    const users = [];
    usersJson.map((user) => {
      users.push(user);
    });
    response.json(users);
  });

  myServer.get("/users/:id", (request, response) => {
    const userId = request.params.id;
    for (let i = 0; i < usersJson.length; i++) {
      if (usersJson[i].id == userId) {
        const posts = getUserPosts(userId);
        response.json({
          ...usersJson[i],
          posts: posts,
        });
      }
    }
    response.send("User not found!");
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





  myServer.put("/users/:id", (request, response) => {
    const userId = request.params.id;
    const body = request.body;
    const { name, posts } = body
    // console.log(body, usersJson);
    const user = usersJson.find((user) => user.id == userId);
    user.name = name;
    fs.writeFileSync("./users.json", JSON.stringify(usersJson));

    posts.map((post) => {
      const userPost = postsJson.find((postFile) => postFile.id == post.id);
      userPost.name = post.name;
      userPost.comment = post.comment;
      userPost.created = post.created;
      userPost.likes = post.likes;

      fs.writeFileSync("./posts.json", JSON.stringify(postsJson));
    });

    for (let i = 0; i < usersJson.length; i++) {
      if (usersJson[i].id == userId) {
        const posts = getUserPosts(userId);
        response.json({
          ...usersJson[i],
          posts: posts,
        });
      }
    }
    response.send("User not found");
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
