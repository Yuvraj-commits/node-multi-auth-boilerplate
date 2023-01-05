const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const authRoute = require("./routes/authRoute");
const { checkPermission } = require("./middleware/checkPermission");

app.get("/", (req, res) => res.send("Working!!!"));
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wjuh1ww.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log("Application Started in Port " + process.env.PORT);
    });
  })
  .catch((err) => console.log(err));

// ROUTES

app.use("/api/auth", authRoute);

// app.use("/api/agent/", checkPermission("AGENT"), agentRoute);
// app.use("/api/customer", checkPermission("CUSTOMER"), customerRoute);
// app.use("/api/admin", adminRoute);
