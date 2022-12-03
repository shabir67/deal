const db = require("../models");
const { user: User, role: Role } = db;
const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }

              res.send({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        });
      }
    });
    if (!user.username && !user.password) {
      res
        .status(400)
        .send({ message: "Username & Password can not be empty!" });
      return;
    } else if (await User.findOne({ username: user.username })) {
      res.send({
        message: 'Username "' + user.username + '" is already taken',
      });
    } else {
      res.status(201).send(user);
    }
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the User.",
    });
  }
};
exports.findAll = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await User.findById(id);
    if (!users)
      res.status(404).send({ message: "Not found User with id " + id });
    else res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!",
      });
    }
    const user = await User.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    if (!user) {
      res.status(404).send({
        message: `Cannot update User with id=${id}. Maybe User was not found!`,
      });
    } else res.send({ message: "User was updated successfully." });
  } catch (error) {
    res.status(500).send({
      message: "Could not delete User with id=" + id,
    });
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      res.status(404).send({
        message: `Cannot delete User with id=${id}. Maybe User was not found!`,
      });
    } else {
      res.send({
        message: "User was deleted successfully!",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete User with id=" + id,
    });
  }
};
