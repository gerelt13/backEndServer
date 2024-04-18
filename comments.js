const { response } = require("express");
const postsJson = require("./posts.json");
const usersJson = require("./users.json");

// const commentsJson = require("./comments.json");
const { getUserPost } = require("./posts");

const fs = require("fs");
module.exports = function (myServer) {
  myServer.get("/comments", (request, response) => {
    response.json(commentsJson);
  });

  myServer.get("/post/:id/comments", (request, response) => {
    const postId = request.params.id;
    const comments = commentsJson.filter((comments) => {
      return comments.postId == userId; //comments.  ?//
    });
    if (comments) {
      response.send(comments);
    } else {
      response.send("No comments");
    }
  });
};
