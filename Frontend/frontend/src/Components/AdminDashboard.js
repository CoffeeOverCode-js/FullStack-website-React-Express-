import { useState } from "react";
import Select from "react-select";
import AdminForm from "./AdminForm";
import AddAdminDivForm from "./AdminContent/AddAdminDivForm";
import AddAdminOrgUnitForm from "./AdminContent/AddAdminOrgUnitForm";
import UpdateForm from "./UpdateForm";
import UpdateUserRole from "./AdminContent/UpdateUserRole";

const AdminDashboard = ({
  usernames,
  token,
  setUsernames,
  managementUser,
  setManagementUser,
  selectOPT,
  setSelectOPT
}) => {

  // State to manage the selected user
  const [selectedUser, setSelectedUser] = useState({
    value: null,
    label: "Select...",
  });

  // State to manage homepage data
  const [homepageData, setHomepageData] = useState({
    credentialsID: null,
    roleName: "",
  });

  // State to manage update data
  const [updateData, setUpdateData] = useState({
    token: token,
    collectionName: "",
    oldUnitID: null,
    newUnitID: null,
    credentialsID: null,
  });

  // State to manage loaded state
  const [loaded, setLoaded] = useState("");
  
  // State to manage user data
  const [userData, setUserData] = useState({});
  const [credData, setCredData] = useState({});
  const [submitClicked, setSubmitClicked] = useState(false);

  // State to manage role data
  const [roleData, setRoleData] = useState({
    credentialsID: null,
    oldRole: null,
    newRole: null,
  });

  // Styles for customizing the appearance of the Select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      width: "400px",
      marginLeft: "100px",
    }),

    menu: (provided, state) => ({
      ...provided,
      background: "transparent",
      marginTop: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "relative",
      marginLeft: "100px",

    }),
    option: (provided, state) => ({
      ...provided,
      "&:hover": {
        backgroundColor: "black",
        color: "white",
      },
      "&:not(:hover)": {
        backgroundColor: "transparent",
        color: "white",
      },
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "white",
    }),
  };

  // Handles change when a username is selected
  const handleUsernameChange = (username) => {
    const value = username.value;
    const label = username.label;
    setSelectedUser({
      value: value,
      label: label,
    });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const credentialsID = selectedUser.value;

      // Fetches user data
      const userRes = await fetch("http://localhost:8080/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialsID }),
      });
      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data);
      }

      // Fetches credential data
      const credsRes = await fetch("http://localhost:8080/getSingleCred", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credentialsID }),
      });
      if (credsRes.ok) {
        const data = await credsRes.json();
        setCredData(data);

        const roleName = data.role;

        // Sets the homepage data
        setHomepageData({
          credentialsID: credentialsID,
          roleName: roleName,
        });
      }

      // Sets the update data
      setUpdateData({
        token: token,
        collectionName: "",
        oldUnitID: null,
        newUnitID: null,
        credentialsID: credentialsID,
      });
      setLoaded("loaded");
      setSubmitClicked(true);
    } catch (error) {
      console.error("Error occurred while fetching data", error);
    }
  };

  // Handles role update
  const handleRoleUpdate = (e) => {
    e.preventDefault();
    const roleName = homepageData.roleName;
    let oldRole = null;
    if (roleName === "Admin User") {
      oldRole = 3;
    } else if (roleName === "Management User") {
      oldRole = 2;
    } else {
      oldRole = 1;
    }
    
    // Sets role data
    setRoleData({
      credentialsID: homepageData.credentialsID,
      oldRole: oldRole,
      newRole: null,
    });
    setSelectOPT("updateUserRole");
  };

  // Renders the component JSX
  return (
    <div className="admin-container">
      <div className="admin-leftside">
        <h1>Admin Dashboard</h1>
        {/* Select component for choosing a username */}
        <Select
          options={usernames}
          name="username"
          value={selectedUser}
          onChange={handleUsernameChange}
          styles={customStyles}
        />

        {/* Button to submit the selected username */}
        <button
          className="btn btn-dark admin-Submit-Btn"
          onClick={handleSubmit}
        >
          Submit
        </button>

        {/* Button to update the role if the user is not a management user */}
        {!managementUser && submitClicked ? (
          <button
            className="btn btn-danger admin-UpdateRole-Btn"
            onClick={handleRoleUpdate}
          >
            Update Role
          </button>
        ) : null}
      </div>
      {/* Right side of the admin dashboard */}
      <div className="admin-rightside">
      {/* Conditional rendering based on user selection and operation */}
        {loaded !== "" ? (
          <>
            {selectOPT === "" && (
             // Display AdminForm for general admin operations
              <>
                <AdminForm
                  homepageData={homepageData}
                  setHomepageData={setHomepageData}
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  usernames={usernames}
                  setUsernames={setUsernames}
                  credData={credData}
                  setCredData={setCredData}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "divisionADD" && (
                // Display AddAdminDivForm for adding division
              <>
                <AddAdminDivForm
                  credData={credData}
                  setCredData={setCredData}
                  homepageData={homepageData}
                  token={token}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "divisionUPDATE" && (
            // Display UpdateForm for updating division
              <>
                <UpdateForm
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  homepageData={homepageData}
                  token={token}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "orgUnitADD" && (
            // Display AddAdminOrgUnitForm for adding organizational units
              <>
                <AddAdminOrgUnitForm
                  credData={credData}
                  setCredData={setCredData}
                  homepageData={homepageData}
                  token={token}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "orgUnitUPDATE" && (
            // Display UpdateForm for updating orginizational unit
              <>
                <UpdateForm
                  updateData={updateData}
                  setUpdateData={setUpdateData}
                  homepageData={homepageData}
                  token={token}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                />
              </>
            )}
            {selectOPT === "updateUserRole" && (
            // Display UpdateUserRole for updating user role
              <>
                <UpdateUserRole
                  roleData={roleData}
                  token={token}
                  selectOPT={selectOPT}
                  setSelectOPT={setSelectOPT}
                  homepageData={homepageData}
                  setHomepageData={setHomepageData}
                />
              </>
            )}
          </>
        ) : (
        // Display message when no user is selected
          <h1>No User has been selected...</h1>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
