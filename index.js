const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { JWT_SECRET, ALGORITHM } = require("./secret");
var { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");

const port1 = 1000;

const myServer = express();
myServer.use(express.json());
myServer.use(cors());
require("dotenv").config();

const uri = process.env.mongoUrl;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

myServer.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).send("Email/password required");
    }
    await client.connect();
    const db = client.db("users");
    const collection = db.collection("credentials");
    const mongodbUser = await collection.findOne({ email });
    if (!mongodbUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = { email: email, password: hashedPassword };
      const data = await collection.insertOne(user);
      const createdUserId = data.insertedId.toString();
      const token = jwt.sign({ id: createdUserId }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ error: "User already registered" });
    }
  } catch (e) {
    res.status(500).json("Error");
  }
});

myServer.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password) {
      res.status(401).json("password required");
      return;
    }
    if (!email) {
      res.status(401).json({ error: "email required!" });
      return;
    }

    await client.connect();
    const db = client.db("users");
    const collection = db.collection("credentials");
    const mongodbUser = await collection.findOne({ email });

    if (!mongodbUser) {
      res.status(401).json({ error: "User not found or wrong user name!" });
      return;
    } else {
      const userPassword = mongodbUser.password;
      const passwordMatch = await bcrypt.compare(password, userPassword);

      if (passwordMatch) {
        const userId = mongodbUser._id.toString();
        const token = jwt.sign({ id: userId }, JWT_SECRET, {
          expiresIn: "24hr",
        });

        res.json({ token }); // or res.json({ token, userId });
        return;
      } else {
        res.status(401).json({ error: "Inccorrect password!" });
        return;
      }
    }
  } catch (error) {
    res.status(401).json({ error: error });
    return;
  }
});

myServer.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);
    const credentials = await client.db("users").collection("credentials");
    const mongodbUser = await credentials.findOne({ email });

    if (!mongodbUser) {
      return res
        .status(401)
        .json({ error: "User not found or not registered" });
    }
    const resetTokenSection = await client.db("users").collection("resetToken");
    const token = jwt.sign({ _id: mongodbUser._id.toString() }, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "2hr",
    });

    const hashedToken = await bcrypt.hash(token, 10);
    resetTokenSection.insertOne({
      userId: mongodbUser._id.toString(),
      token: hashedToken,
    });

    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

myServer.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const data = jwt.verify(token, JWT_SECRET, { algorithm: ["HS256"] });
    await client.connect();
    console.log(data.userId);
    const resetTokenSection = await client
      .db("users")
      .collection("resetToken")
      .findOne({ userId: data._id });
    if (!resetTokenSection) {
      res.status(401).json("YOUR TOKEN DOES NOT EXIST");
      return;
    } else {
      console.log(token, resetTokenSection.token);
      const passwordMatch = await bcrypt.compare(
        token,
        resetTokenSection.token
      );
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const updated = await client
          .db("users")
          .collection("credentials")
          .updateOne(
            { _id: new ObjectId(String(data._id)) },
            { $set: { password: hashedPassword } }
          );

        res.json(updated);
        return;
      } else {
        res.status(401).json("Your token does not match");
        return;
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

myServer.put("/edit/:userId", async (req, res) => {
  try {
    const { userId } = req.body;

    await client.connect();
    const PropertyData = client.db("users").collection("collection");
    const EditedProperty = await PropertyData.findOneAndUpdate(
      { _id: new ObjectId(String(userId)) },
      { $set: { title: updatedProperty } },
      { returnOriginal: false }
    );

    res.json(EditedProperty.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





myServer.use(expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }));

const { createMongoEndpoint } = require("./realtor_mongodb");
const { ConnectionCheckOutFailedEvent } = require("mongodb");

createMongoEndpoint(myServer);

require("./users")(myServer);
require("./posts")(myServer);

myServer.listen(port1, () => {
  console.log("myServer is running OK");
});
