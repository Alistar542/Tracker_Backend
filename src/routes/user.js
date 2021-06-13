require("dotenv").config();
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const connection = require("../../connection/connection");
const USER_QUERY = require("../constants/userquery");
var HashMap = require("hashmap");

router.route("/login").post(async (req, res) => {
  let queryPrefix = USER_QUERY.LOGIN_USER_QUERY;
  let queryLoginValues = [];
  queryLoginValues.push(req.body.userName);
  queryLoginValues.push(req.body.officeCode.toUpperCase());
  let user = {};
  connection.query(queryPrefix, queryLoginValues, async (err, rows) => {
    if (err) {
      console.log("ERROR CONNECTING TO USER : " + err);
      res.status(500).send("ERROR CONNECTING");
    }
    user = rows[0];
    if (user === null) {
      return res.status(400).send("USER NOT FOUND");
    }
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const userJwt = {
          userName: user.userName,
          userType: user.userType,
          officeCode: user.officeCode,
        };
        const accessToken = jwt.sign(userJwt, process.env.ACCESS_SECRET_TOKEN);
        res.json({
          accessToken: accessToken,
          userName: user.userName,
          userType: user.userType,
          officeCode: user.officeCode,
        });
      } else {
        res.status(403).send("INCORRECT PASSWORD");
      }
    } catch {
      res.status(500).send("USER DOES NOT EXISTS");
    }
  });
});

router.route("/create").post(async (req, res) => {
  let loginQueryPrefix = USER_QUERY.LOGIN_USER_QUERY;
  let queryLoginValues = [];
  queryLoginValues.push(req.body.userName);
  queryLoginValues.push(req.body.officeCode.toUpperCase());

  connection.query(loginQueryPrefix, queryLoginValues, async (err, rows) => {
    if (err) {
      console.log("ERROR CONNECTING TO USER : " + err);
      res.status(500).send("ERROR CONNECTING");
    }
    user = rows[0];
    if (user != null) {
      return res.status(400).send("UserName already in use");
    }
    let queryPrefix = USER_QUERY.CREATE_USER_QUERY;
    let queryCreateValues = [];
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      queryCreateValues.push(req.body.userName);
      queryCreateValues.push(hashedPassword);
      queryCreateValues.push(req.body.userType);
      queryCreateValues.push(req.body.officeCode.toUpperCase());
      connection.query(queryPrefix, queryCreateValues, (err, rows) => {
        err ? console.log("ERROR CONNECTING TO USER : " + err) : rows;
      });
      res.status(201).send();
    } catch {
      res.status(500).send();
    }
  });
});

router.route("/listusers").get(async (req, res) => {
  let queryPrefix = USER_QUERY.LIST_USER_QUERY;
  let queryFilterValues = [];
  let user = {};
  connection.query(queryPrefix, queryFilterValues, async (err, rows) => {
    err ? console.log("ERROR GETTING USER DETAILS: " + err) :
    mapUsersResponse(res, rows);  
  });
});

const mapUsersResponse = (res,rows) => {
    
  return res.json(rows);
}

module.exports = router;
