const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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
  //tested,working//
  myServer.get("/movieFlix", async (req, res) => {
    await client.connect();
    const MiniiUgsonNer = await client
      .db("sample_mflix")
      .collection("comments");
    const data = await MiniiUgsonNer.find().toArray();
    res.json(data);
  });

  myServer.get("/movieFlix/:id", async (req, res) => {
    //tested,working//
    //find by movie id//
    const movieId = req.params.id;
    await client.connect();
    const MiniiUgsonNer = await client.db("sample_mflix").collection("movies");
    const data = await MiniiUgsonNer.find({
      _id: new ObjectId(String(movieId)),
    }).toArray();
    res.json(data);
  });

  myServer.get("/movieFlix/movies/:title", async (req, res) => {
    //tested,working//
    //find by movie title name//
    try {
      const byTitle = req.params.title;
      await client.connect();
      const MiniiUgsonNer = await client
        .db("sample_mflix")
        .collection("movies");
      const data = await MiniiUgsonNer.find({
        title: byTitle,
      }).toArray();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  myServer.delete("/movieFlix/deletebyid/:id", async (req, res) => {
    //tested,working//
    //delete movie by id//
    const movieId = req.params.id;
    await client.connect();
    const MiniiUgsonNer = await client.db("sample_mflix").collection("movies");
    const deleteMovie = await MiniiUgsonNer.deleteOne({
      _id: new ObjectId(String(movieId)),
    });
    res.json(deleteMovie);
  });

  myServer.delete("/movieFlix/:deletebyname", async (req, res) => {
    //tested,working//
    try {
      const deletebyname = req.params.deletebyname;
      await client.connect();
      const MiniiUgsonNer = client.db("sample_mflix").collection("movies");
      const deleteMovie = await MiniiUgsonNer.deleteOne({
        name: deletebyname,
      });
      res.json(deleteMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // myServer.post("/movieFlix/movie/create/", async (req, res) => {
  //   const createMovie = req.body;
  //   const { movieTitle, year, genres, rated, runtime } = createMovie;

  //   if (!movieTitle || !year || !genres || !rated || !runtime) {
  //     return res.status(400).json({ error: "title is required." });
  //   } else {
  //     console.log("New movie title created:", createMovie);
  //   }

  //   try {
  //     await client.connect();
  //     const MiniiUgsonNer = await client
  //       .db("sample_mflix")
  //       .collection("movies");
  //     const createMovieData = await MiniiUgsonNer.insertOne(createMovie);

  //     res.json(createMovieData);
  //     createMovie;
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     res.status(500).json({ error: "Internal server error." }); //send iin orond json bsan//
  //   }
  //   res.json(error.message);
  // });

  myServer.post("/movieFlix/create", async (req, res) => {
    //tested,working//
    try {
      const body = req.body;
      const REQUIRED_FIELDS = ["plot", "runtime", "rated", "title", "type"];
      const values = Object.keys(body);
      const missingFields = REQUIRED_FIELDS.filter(
        (value) => !value.includes(value)
      );
      if (missingFields.length > 0) {
        throw new Error(
          `${missingFields.join(", ")} - fields are missing value`
        );
      }
      const { plot, runtime, rated, title, type } = body;
      await client.connect();
      const movies = await client
        .db("sample_mflix")
        .collection("gerelt_movies");
      const data = await movies.insertOne({
        title,
        plot,
        runtime,
        rated,
        type,
      });
      res.json(data);
    } catch (error) {
      res.json({ message: error.message });
    }
  });

  myServer.put("/movieFlix/update/:id", async (req, res) => {
    try {
      const movieId = req.params.id;
      const updatedTitle = req.body.title;

      await client.connect();
      const MiniiUgsonNer = client.db("sample_mflix").collection("movies");
      const updatedMovie = await MiniiUgsonNer.findOneAndUpdate(
        { _id: new ObjectId(String(movieId)) },
        { $set: { title: updatedTitle } },
        { returnOriginal: false }
      );

      res.json(updatedMovie.value);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

module.exports = { createMongoEndpoint };
