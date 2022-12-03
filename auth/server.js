const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

const app = express();

let corsOptions = {
  origin: "http:localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// db
const db = require("./app/models");
const dbConfig = require("./app/config/dbConfig");
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

//routes

//wellcome routes
app.get("/base-user-auth", (req, res) => {
  res.json({ message: "Wellcome to deal Auth backend services!" });
});

// user routes

require("./app/routes/authRoutes")(app);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Deal Auth backend services is running on port ${PORT}.`);
});
