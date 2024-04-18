const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");

const app = express();
const port = 1000;

require("dotenv").config();

const uri = process.env.mongoUrl;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const createMongoEndpoint = (myServer) => {
  myServer.get("/properties", async (req, res) => {
    await client.connect();
    console.log("testing");
    const RealtorProperty = await client
      .db("sample_realtor")
      .collection("properties");
    const data = await RealtorProperty.find().toArray();
    // console.log(data);
    res.json(data);
  });

  myServer.post("/properties/create", async (req, res) => {
    //tested &  working//
    try {
      const body = req.body;
      const {
        address,
        city,
        zip_code,
        brokers,
        price,
        bedrooms,
        bathrooms,
        sqft,
        description,
        image_url,
        latitude,
        longitude,
      } = body;
      await client.connect();
      const realtor = await client
        .db("sample_realtor")
        .collection("properties");
      const data = await realtor.insertOne({
        address,
        city,
        zip_code,
        brokers,
        price,
        bedrooms,
        bathrooms,
        sqft,
        description,
        image_url,
        latitude,
        longitude,
      });
      console.log(data);
      res.json(data);
    } catch (error) {
      res.json({ message: error.message });
    }
  });

  myServer.get("/properties/:id", async (req, res) => {
    //find by property id//
    //tested,working//
    const propertyId = req.params.id;
    await client.connect();
    const RealtorProperty = await client
      .db("sample_realtor")
      .collection("properties");
    const data = await RealtorProperty.find({
      _id: new ObjectId(String(propertyId)),
    }).toArray();
    console.log(data);
    res.json(data);
  });

  myServer.get("/properties/address/:address", async (req, res) => {
    //findby address, tested,working//
    try {
      const body = req.body;
      const byAddress = req.params.address;
      await client.connect();
      const RealtorProperty = await client
        .db("sample_realtor")
        .collection("properties");
      const address = await RealtorProperty.find({
        address: byAddress,
      }).toArray();
      console.log(address);
      res.json(address);
    } catch (error) {
      res.json({ error: error.message });
    }
  });

  myServer.get("/properties/city/:city", async (req, res) => {
    //tested&working//
    try {
      const findbycity = req.params.city;
      await client.connect();
      const RealtorProperty = await client
        .db("sample_realtor")
        .collection("properties");
      const city = await RealtorProperty.find({
        city: findbycity,
      }).toArray();
      console.log(findbycity);
      res.json(city);
    } catch (error) {
      res.json({ error: error.message });
    }
  });

  myServer.get("/properties/bedrooms/:bedroom", async (req, res) => {
    try {
      const findbybedroom = req.params.bedroom;
      await client.connect();
      const RealtorProperty = await client
        .db("sample_realtor")
        .collection("properties");
      const bedroom = await RealtorProperty.find({
        bedrooms: Number(findbybedroom),
      }).toArray();
      console.log(bedroom);
      res.json(bedroom);
    } catch (error) {
      res.json({ error: error.message });
    }
  });

  myServer.delete("/properties/deletebyid/:id", async (req, res) => {
    //tested&working//
    const deletebyId = req.params.id;
    await client.connect();
    const RealtorProperty = await client
      .db("sample_realtor")
      .collection("properties");
    const deleteProperty = await RealtorProperty.deleteOne({
      _id: new ObjectId(String(deletebyId)),
    });
    res.json(deleteProperty);
  });

  myServer.delete("/properties/:deletebyaddress", async (req, res) => {
    try {
      const deletebyaddress = req.params.deletebyname;
      await client.connect();
      const RealtorProperty = client
        .db("sample_realtor")
        .collection("properties");
      const deleteAddress = await RealtorProperty.deleteOne({
        address: deletebyaddress,
      });
      res.json(deleteAddress);
    } catch (error) {
      res.json({ error: error.message });
    }
  });

  myServer.put("/properties/update/:id", async (req, res) => {
    //tested,working, updating by each field @ a time //
    try {
      const updatebyID = req.params.id;
      const updateFields = req.body;
      const fieldToUpdate = Object.keys(updateFields)[0];
      const ALLOWED_FIELDS = [
        "address",
        "city",
        "zip_code",
        "brokers",
        "price",
        "bedrooms",
        "bathrooms",
        "sqft",
        "description",
        "image_url",
      ];

      if (!ALLOWED_FIELDS.includes(fieldToUpdate)) {
        throw new Error(`${fieldToUpdate} is not a valid field to update.`);
      }
      await client.connect();
      const RealtorProperty = client
        .db("sample_realtor")
        .collection("properties");

      const updateObject = { $set: {} };
      updateObject.$set[fieldToUpdate] = updateFields[fieldToUpdate];

      const updatedProperty = await RealtorProperty.updateOne(
        { _id: new ObjectId(String(updatebyID)) },
        updateObject,
        { returnOriginal: false }
      );
      res.json(updatedProperty);
    } catch (error) {
      res.json({ error: error.message });
    }
  });
};
module.exports = { createMongoEndpoint };
