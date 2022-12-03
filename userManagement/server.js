const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
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
const User = db.user;
const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

/// initiation
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
        addAdmin();
      });
    }
  });
}

function addAdmin() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      const user = new User({
        username: "admindeal",
        password: bcrypt.hashSync("satepadang", 8),
      });

      user.save((err, user) => {
        Role.find(
          {
            name: { $in: "admin" },
          },
          (err, roles) => {
            if (err) {
              return console.log(err);
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                return console.log(err);
              }

              console.log("User was registered successfully!");
            });
          }
        );
      });
    }
  });
}
//routes

//wellcome routes
app.get("/base-user-management", (req, res) => {
  res.json({ message: "Wellcome to deal userManagement backend services!" });
});

//Routes
require("./app/routes/userManagementRoutes")(app);
//Swager routes
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// set port, listen for requests
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(
    `Deal userManagement backend services is running on port ${PORT}.`
  );
});
