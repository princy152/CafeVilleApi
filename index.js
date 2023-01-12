const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");
const nodeCron = require("node-cron");
dotenv.config();

console.log(process.env.DB_CONNECT);

mongoose
  .connect(process.env.DB_CONNECT)
  .then((connectioninfo) => console.log("connected to db"))
  .catch((err) => console.log("Error connecting database:", err));

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//import routes
const userRoutes = require("./routes");

//middlewares
app.use(express.json()); //for body parser

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: "application/*+json" }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: "application/vnd.custom-type" }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: "text/html" }));

//cors
app.use(cors());
//route middlewares
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("hello there");
});

const server = app.listen(process.env.PORT, () =>
  console.log("server is running on Port ::: " + process.env.PORT)
);
