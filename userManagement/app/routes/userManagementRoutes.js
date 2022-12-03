const userManagementController = require("../controllers/userManagementController");
const { authJwt } = require("../middlewares/index");

module.exports = (app) => {
  app.post(
    "/usermanagement/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    userManagementController.create
  );

  // Retrieve all Users
  app.get(
    "/usermanagement/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    userManagementController.findAll
  );

  // Retrieve a single User with id
  app.get(
    "/usermanagement/users/:id",
    authJwt.verifyToken,
    userManagementController.findOne
  );

  // Update a User with id
  app.put(
    "/usermanagement/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userManagementController.update
  );

  // Delete User with id
  app.delete(
    "/usermanagement/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    userManagementController.delete
  );
};
