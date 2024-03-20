// Importing required modules
const db = require("./../db");
const mongoose = require("mongoose");
const User = require("../model/userSchema.model");
const Credentials = require("../model/credentialsSchema.model");
const Roles = require("./../model/roleSchema.model");
const Division = require("../model/divisionSchema.model");
const OrgUnit = require("./../model/orgUnitsSchema.model");

// Function to find all credentials
const findCredentials = async () => {
  try {
    const data = await Credentials.find({});
    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Error occurred while retrieving data");
  }
};

// Function to get the role name based on role ID
const getRole = async (roleID) => {
  try {
    const data = await Roles.findOne({ _id: roleID });
    const roleName = data.roleName;
    return roleName;
    // return data
  } catch (error) {
    console.error(error);
    throw new Error("Error occured when retrieving data");
  }
};

// Function to find a user based on credentials ID
const findUser = async (credentialsID) => {
  try {
    const user = await User.findOne({ credentialsID: credentialsID });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving user");
  }
};

// Function to register a new user
const registerUser = async (
  fullName,
  usr,
  pwd,
  role,
  orgUnits,
  divisions,
  credentialsID
) => {
  try {
    const newUser = new User({
      fullName: fullName,
      username: usr,
      role: role,
      orgUnits: orgUnits,
      divisions: divisions,
      credentialsID: credentialsID,
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while adding user");
  }
};

// Function to register user credentials and update related credentials
const registerUserCredentials = async (
  fullName,
  usr,
  pwd,
  role,
  orgUnits,
  divisions,
  credentialsID
) => {
  const newUser = await registerUser(
    fullName,
    usr,
    pwd,
    role,
    orgUnits,
    divisions,
    credentialsID
  );

  const user = await findUser(credentialsID);
  const userID = user._id;
  const roleName = await getRole(role);
  try {
    const newCredentials = new Credentials({
      _id: credentialsID,
      fullName: fullName,
      userID: userID,
      username: usr,
      role: roleName,
      password: pwd,
    });

    const savedCredentials = await newCredentials.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error occured while adding credentials");
  }
};

// Function to register divisions for a user
const registerDivCredentials = async (credentialsID, divisions) => {
  try {
    for (let i = 0; i < divisions.length; i++) {
      const divisionId = divisions[i];
      const updatedDivision = await Division.findOneAndUpdate(
        { _id: divisionId },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while updating divisions");
  }
};

// Function to register organizational units for a user
const registerOrgCredentials = async (credentialsID, orgUnits) => {
  try {
    for (let i = 0; i < orgUnits.length; i++) {
      const orgUnitID = orgUnits[i];
      const updatedOrgUnits = await OrgUnit.findOneAndUpdate(
        { _id: orgUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurres while updating orgUnits");
  }
};

// Function to retrieve divisions for a user
const retrieveDivison = async (res, divisionID) => {
  try {
    const division = await Division.findOne({ _id: divisionID });

    const divCredIDs = division.credentialsID;

    const userCreds = [];

    for (let i = 0; i < divCredIDs.length; i++) {
      const userCredentials = await Credentials.findOne({ _id: divCredIDs[i] });
      userCreds.push(userCredentials);
    }
    res.send(userCreds);
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving data");
  }
};

// Function to add credentials to a collection (division or organization unit)
const addCredentials = async (collectionName, credentialsID, repoID) => {
  if (collectionName === "division") {
    try {
      const updatedDivision = await Division.findOneAndUpdate(
        { _id: repoID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $addToSet: { divisions: updatedDivision._id } },
        { returnOriginal: false }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while retrieving data");
    }
  } else {
    try {
      const updatedOrgUnits = await OrgUnit.findOneAndUpdate(
        { _id: repoID },
        { $addToSet: { credentialsID: credentialsID } },
        { returnOriginal: false }
      );
      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $addToSet: { orgUnits: updatedOrgUnits._id } },
        { returnOriginal: false }
      );
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while retrieving data");
    }
  }
};

// Function to retrieve user credentials based on unit type (division or organization unit)
const getUserCredentials = async (
  req,
  res,
  credentialsID,
  oldUnitID,
  selection
) => {
  try {
    let data = {};
    let Repo = selection === "division" ? Division : OrgUnit;

    const userDetails = await User.find({ credentialsID: credentialsID });
    const RepoCredentials = await Repo.find({ _id: oldUnitID });

    const divisions = userDetails[0].divisions;

    // If the unit type is a division
    if (Repo === Division) {
      const divisions = userDetails[0].divisions;
      let index = divisions.indexOf(oldUnitID);

      const divisionsCredIds = RepoCredentials[0].credentialsID;
      const indexToRemove = divisionsCredIds.indexOf(credentialsID);
      data = {
        divisions: divisions,
        index: index,
        divisionsCredIds: divisionsCredIds,
        indexToRemove: indexToRemove,
      };
      return data;
      
      // If the unit type is an organization unit
    } else if (Repo === OrgUnit) {
      const orgUnits = userDetails[0].orgUnits;
      let index = orgUnits.indexOf(oldUnitID);

      const orgUnitsCredIds = RepoCredentials[0].credentialsID;
      const indexToRemove = orgUnitsCredIds.indexOf(credentialsID);
      data = {
        orgUnits: orgUnits,
        index: index,
        orgUnitsCredIds: orgUnitsCredIds,
        indexToRemove: indexToRemove,
      };
      return data;
    } else {
      res.send("No user found with the provided credentialsID");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while retrieving data");
  }
};

// Function to update user credentials based on unit type (division or organization unit)
const updateUserCredentials = async (
  req,
  res,
  credentialsID,
  oldUnitID,
  newUnitID,
  data,
  selection
) => {
  try {
    const Repo = selection === "division" ? Division : OrgUnit;
    if (Repo === Division) {
      let divisions = data.divisions;
      const index = data.index;

      divisions[index] = newUnitID;

      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $set: { divisions: divisions } },
        { new: true }
      );

      const credIDs = data.divisionsCredIds;
      const indexToRemove = data.indexToRemove;
      credIDs.splice(indexToRemove, 1);

      const removedDivision = await Division.findOneAndUpdate(
        { _id: oldUnitID },
        { $set: { credentialsID: credIDs } },
        { new: true }
      );

      const addedDivision = await Division.findOneAndUpdate(
        { _id: newUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { new: true }
      );

      res.send("Division Updated");
    } else {
      let orgUnits = data.orgUnits;
      const index = data.index;

      orgUnits[index] = newUnitID;

      const updatedUser = await User.findOneAndUpdate(
        { credentialsID: credentialsID },
        { $set: { orgUnits: orgUnits } },
        { new: true }
      );

      const credIDs = data.orgUnitsCredIds;
      const indexToRemove = data.indexToRemove;
      credIDs.splice(indexToRemove, 1);

      const removedOrgUnit = await OrgUnit.findOneAndUpdate(
        { _id: oldUnitID },
        { $set: { credentialsID: credIDs } },
        { new: true }
      );

      const addedOrgUnit = await OrgUnit.findOneAndUpdate(
        { _id: newUnitID },
        { $addToSet: { credentialsID: credentialsID } },
        { new: true }
      );
      res.send("OrgUnit Updated");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error occurred while updating data");
  }
};

// Function to retrieve division names associated with a user
const getUserDivisions = async (credentialsID) => {
  const divNames = [];
  const user = await User.find({ credentialsID: credentialsID });

  const divisions = user[0].divisions;

  for (let i = 0; i < divisions.length; i++) {
    const division = await Division.find({ _id: divisions[i] });
    divNames.push(division[0].divisionName);
  }

  return divNames;
};

// Function to retrieve organization unit names associated with a user
const getOrgUnits = async (credentialsID) => {
  const orgUnitNames = [];
  const user = await User.find({ credentialsID: credentialsID });

  const orgUnits = user[0].orgUnits;

  for (let i = 0; i < orgUnits.length; i++) {
    const orgUnit = await OrgUnit.find({ _id: orgUnits[i] });
    orgUnitNames.push(orgUnit[0].OU_Name);
  }

  return orgUnitNames;
};

// Function to get available credentials (division or organization unit) excluding the user's credentials
const getAvailableCreds = async (credentialsID, collectionName) => {
  // If retrieving divisions
  if (collectionName === "division") {
    const availableDivs = [];
    const divObjs = await Division.find({
      credentialsID: { $ne: credentialsID },
    });

    for (let i = 0; i < divObjs.length; i++) {
      const DivObj = {
        value: divObjs[i]._id,
        label: divObjs[i].divisionName,
      };

      availableDivs.push(DivObj);
    }

    return availableDivs;
    // If retrieving organization units
  } else {
    const availableOrgUnits = [];
    const orgUnitObjs = await OrgUnit.find({
      credentialsID: { $ne: credentialsID },
    });
    for (let i = 0; i < orgUnitObjs.length; i++) {
      const OrgUnitObj = {
        value: orgUnitObjs[i]._id,
        label: orgUnitObjs[i].OU_Name,
      };
      availableOrgUnits.push(OrgUnitObj);
    }
    return availableOrgUnits;
  }
};

// Function to get the original credentials (division or organization unit) associated with a user
const getOriginalCreds = async (credentialsID, collectionName) => {
  if (collectionName === "division") {
    const originalCreds = [];
    const originalCredsObjs = await Division.find({
      credentialsID: credentialsID,
    });
    for (let i = 0; i < originalCredsObjs.length; i++) {
      const originalCredsObj = {
        value: originalCredsObjs[i]._id,
        label: originalCredsObjs[i].divisionName,
      };
      originalCreds.push(originalCredsObj);
    }
    return originalCreds;
  } else {
    const originalCreds = [];
    const originalCredsObjs = await OrgUnit.find({
      credentialsID: credentialsID,
    });
    for (let i = 0; i < originalCredsObjs.length; i++) {
      const originalCredsObj = {
        value: originalCredsObjs[i]._id,
        label: originalCredsObjs[i].OU_Name,
      };
      originalCreds.push(originalCredsObj);
    }
    return originalCreds;
  }
};

// Function to get all the Users excluding users with Admin Role
const retrieveAllUsers = async () => {
  const userCreds = await Credentials.find({ role: { $ne: "Admin User" } });
  const usernames = [];

  for (let i = 0; i < userCreds.length; i++) {
    const userNameObj = {
      value: userCreds[i]._id,
      label: userCreds[i].username,
    };
    usernames.push(userNameObj);
  }

  return usernames;
};

const updateUserRole = async (credentialsID, newRole) => {
  let roleName = "";
  const updatedUser = await User.findOneAndUpdate(
    { credentialsID: credentialsID },
    { $set: { role: newRole } },
    { new: true }
  );

  if (newRole === 1) {
    roleName = "Normal User"
  }
  else if (newRole === 2) {
    roleName = "Management User"
  }
  else {
    roleName = "Admin User"
  }

  const updatedCreds = await Credentials.findOneAndUpdate(
    { _id: credentialsID },
    { $set: { role: roleName } },
    { new: true }
  );
};

// Exports all the neccessary functions
module.exports = {
  findCredentials,
  findUser,
  getRole,
  registerUser,
  registerUserCredentials,
  registerDivCredentials,
  registerOrgCredentials,
  retrieveDivison,
  addCredentials,
  getUserCredentials,
  updateUserCredentials,
  getUserDivisions,
  getOrgUnits,
  getAvailableCreds,
  getOriginalCreds,
  retrieveAllUsers,
  updateUserRole
};
