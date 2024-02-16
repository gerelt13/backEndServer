const postsJson = require("./posts.json");

module.exports = function (myServer) {
    myServer.get("/users/:id/posts", (req, res) => {
    const userId = req.params.id;
    const userPosts = postsJson.filter((value) => value.owner == userId);
    res.send(userPosts);
});

myServer.get("/posts/:id", (req, res) => {
    const postId = req.params.id;
    const post = postsJson.filter((value) => value.id == postId);
    res.send(post);
});
};