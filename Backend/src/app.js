// Importes the required modules
const chalk = require("chalk");
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db");
const PORT = process.env.PORT || 8080;
const CORS = require("cors");
const axios = require("axios");
const functions = require("./controller/user.controller");
const jwt = require("jsonwebtoken");
const Credentials = require("./model/credentialsSchema.model");

// Creates an instance of Express
const app = express();
// Enables Cors and parses JSON bodies
// Aswell as enables parsing of URL-encoded bodies
app.use(CORS());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for my Homepage
app.get("/", (req, res) => {
  res.send("Homepage");
});

// Route for fetching data
app.get("/data", (req, res) => {
  const credentials = functions.findCredentials(req, res);
});

// Route for user login
app.post("/login", async (req, res) => {
  try {
    // Extracts the username and password from the body
    const usr = req.body.usr;
    const pwd = req.body.pwd;

    // Finds the users credentials
    const credentials = await functions.findCredentials();
    const validUser = credentials.find(
      (user) => user.username === usr && user.password === pwd
    );

    if (validUser) {
      // Creates a JWT token if the user is valid
      const payload = {
        username: validUser.username,
        password: validUser.password,
        role: validUser.role,
      };
      const token = jwt.sign(JSON.stringify(payload), "jwt-secret", {
        algorithm: "HS256",
      });
      res.json({ jwt: token, credentialsID: validUser._id });
    } else {
      res.status(403).send({ err: "Incorrect login!" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Some error occurred while processing the request" });
  }
});

// Route for user registration
app.post("/register", async (req, res) => {
  try {
    // Extracting user details from the request body
    const credentials = await functions.findCredentials();
    const fullName = req.body.fullName;
    const usr = req.body.username;
    const pwd = req.body.password;
    const role = 1;
    const orgUnits = req.body.orgUnits;
    const divisions = req.body.divisions;
    const credentialsID = credentials.length + 1;

    // Registering user credentials and related information
    await functions.registerUserCredentials(
      fullName,
      usr,
      pwd,
      role,
      orgUnits,
      divisions,
      credentialsID
    );

    await functions.registerDivCredentials(credentialsID, divisions);
    await functions.registerOrgCredentials(credentialsID, orgUnits);

    res.send("User and User credentials was added");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Some error occurred while processing the request" });
  }
});

// Route for viewing credentials
app.post("/view-credentials", (req, res) => {
  // Breaksdown the roken to obtain the data
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";
  try {
    const divisionID = req.body.divisionID;

    // Checks to see if the user has a token
    if (token != "none") {
      const decoded = jwt.verify(token, "jwt-secret");
      const allowedUsers = ["Normal User", "Management User", "Admin User"];

      const role = decoded.role;

      if (allowedUsers.includes(role)) {
        functions.retrieveDivison(res, divisionID);
      } else {
        res.send({
          msg: "You do not have valid permissions to view this endpoint",
        });
      }
    } else {
      res.send({ msg: "You do not have an account or are not logged in" });
    }
  } catch (error) {
    res.status(403).send({
      msg: "Your JWT was verified, but you do not have permission to access this endpoint",
    });
  }
});

// Route for adding credentials
app.post("/add-credential", async (req, res) => {
  const collectionName = req.body.collectionName; //either 1(Division) or 2(OrgUnit)
  const credentialsID = req.body.credentialsID;
  const repoID = req.body.repoID;
  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  try {
  // Checks if token exists
    if (token != "none") {
      const decoded = jwt.verify(token, "jwt-secret");
      const allowedUsers = ["Normal User", "Management User", "Admin User"];

      const role = decoded.role;

      if (allowedUsers.includes(role)) {
        const divisionName = await functions.addCredentials(
          collectionName,
          credentialsID,
          repoID
        );
        res.send({ msg: "Added Credential" });
      } else {
        res.send({
          msg: "You do not have valid permissions  to view this endpoint",
        });
      }
    } else {
      res.send({ msg: "You do not have an account or are not logged in" });
    }
  } catch (error) {
    res.status(403).send({
      msg: "Your JWT was verified, but you do not have permission to access this endpoint",
    });
  }
});

// Route for updating credentials
app.post("/update-credential", async (req, res) => {
  const selection = req.body.selection;
  const credentialsID = req.body.credentialsID;
  const oldUnitID = req.body.oldUnitID;
  const newUnitID = req.body.newUnitID;


  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  // Checks the token
  if (token != "none") {
    const decoded = jwt.verify(token, "jwt-secret");
    const allowedUsers = ["Management User", "Admin User"];
    const role = decoded.role;

    // If user has the included role then it should get the users credentials
    if (allowedUsers.includes(role)) {
      const data = await functions.getUserCredentials(
        req,
        res,
        credentialsID,
        oldUnitID,
        selection
      );

      await functions.updateUserCredentials(
        req,
        res,
        credentialsID,
        oldUnitID,
        newUnitID,
        data,
        selection
      );
    } else {
      res.send({ msg: "You do not have valid permissions to update Users" });
    }
  } else {
    res.send({ msg: "You do not have an account or are not logged in" });
  }
});

// Route for obtaining the Users Information
app.post("/getUser", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const user = await functions.findUser(credentialsID);
  res.json(user);
});

// Route for getting a single Credential
app.post("/getSingleCred", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const userCred = await Credentials.find({ _id: credentialsID });
  res.json(userCred[0]);
});

// Route for obtaining Credentials
app.post("/getCredentials", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const userCreds = await functions.findCredentials(credentialsID);
  res.json(userCreds);
});

// Route for obtaining the Role
app.post("/getRole", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const user = await functions.findUser(credentialsID);
  const roleID = user.role;
  const roleName = await functions.getRole(roleID);
  res.send(roleName);
});

// Route for obtaining the Divisions
app.post("/getDivisions", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const divisions = await functions.getUserDivisions(credentialsID);
  res.send(divisions);
});

// Route for obtaining the Organisational Units
app.post("/getOrgUnits", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const orgUnits = await functions.getOrgUnits(credentialsID);
  res.send(orgUnits);
});

// ROute for obtaining the available Credentials
app.post("/availableCreds", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const collectionName = req.body.collectionName;
  const availableCreds = await functions.getAvailableCreds(
    credentialsID,
    collectionName
  );
  res.send(availableCreds);
});

// Route for obtaining the Original Credentials
app.post("/originalCreds", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const collectionName = req.body.collectionName;
  const originalCreds = await functions.getOriginalCreds(
    credentialsID,
    collectionName
  );
  res.send(originalCreds);
});

// Route for retrieving All Users Information
app.get("/retrieveAllUsers", async (req, res) => {
  const usernames = await functions.retrieveAllUsers();
  res.send(usernames);
});

// Route for updating User Role
app.post("/updateUserRole", async (req, res) => {
  const credentialsID = req.body.credentialsID;
  const newRole = req.body.newRole;

  const token = req.headers["authorization"]
    ? req.headers["authorization"].split(" ")[1]
    : "none";

  // Checks to see if the token has the admin role
  if (token != "none") {
    const decoded = jwt.verify(token, "jwt-secret");
    const allowedUser = "Admin User";
    const role = decoded.role;

    if (role === allowedUser) {
      await functions.updateUserRole(credentialsID, newRole);
      res.send("User Role Updated");
    } else {
      res.send({
        msg: "You do not have valid permissions to update Users Roles",
      });
    }
  } else {
    res.send({ msg: "You do not have an account or are not logged in" });
  }
});

// Starts the server on the specified port
app.listen(PORT, () => {
  console.log(chalk.yellow(`Server running on port: ${PORT}`));
});
