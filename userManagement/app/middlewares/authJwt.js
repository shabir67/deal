const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
const config = require("../config/authConfig");
const ROLES = "admin";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  let token = parseJwt(req.headers["x-access-token"]);
  if (token.roles !== ROLES) {
    return res.status(401).send({ message: "Unauthorized!" });
  } else {
    return next();
  }
};

const authJwt = {
  catchError,
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
