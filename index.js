const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mofim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("JdmLighting");
    const servicesCollection = database.collection("services");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("review");

    // get api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific id");
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // Post Api
    app.post("/order", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      const result = await ordersCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // Get all data
    app.get("/order", async (req, res) => {
      const cursor = ordersCollection.find({});
      const order = await cursor.toArray();
      res.send(order);
    });
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });

    // Post Api for review
    app.post("/review", async (req, res) => {
      const review = req.body;
      console.log("hit the post api", review);

      const result = await reviewsCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });
    // Get all data of Reviews
    app.get("/review", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Jdm server");
});

app.listen(port, () => {
  console.log("Running jdm lighting server on port", port);
});
