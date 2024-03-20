import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const UpdateUserRole = ({
  roleData,
  token,
  selectOPT,
  setSelectOPT,
  homepageData,
  setHomepageData,
}) => {
  // Hooks for navigation
  const navigate = useNavigate();

  // Initializes state variables with state hooks
  const [availableRoles, setAvailableRoles] = useState([]);
  const [newRoleSelection, setNewRoleSelection] = useState({
    value: null,
    label: "Select...",
  });

  // Functiont o be initializes when component first mounts or when the roleData changes
  useEffect(() => {
    try {
      // Predefined roles with values and labels
      const roles = [
        { value: null, label: "None" },
        { value: 1, label: "Normal User" },
        { value: 2, label: "Management User" },
        { value: 3, label: "Admin User" },
      ];

      // Finds the index of the current role in roles array
      const oldRole = roleData.oldRole;
      const roleIndex = roles.findIndex((role) => role.value === oldRole);

      // Removes the current role from availableRoles
      roles.splice(roleIndex, 1);
      setAvailableRoles(roles);
    } catch (error) {
      console.error("Error while fetching data: ", error);
    }
  }, []);

  // Custom styling options for the Select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
      width: "400px",
      marginLeft: "100px",
    }),

    menu: (provided, state) => ({
      ...provided,
      background: "#808080",
      marginTop: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "relative",
      marginLeft: "100px",
      width: "400px",
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

  // Function to handle changes when a new role is selected
  const handleRoleChange = (role) => {
    const newRole = role.value;
    const newLabel = role.label;
    setNewRoleSelection({
      value: newRole,
      label: newLabel,
    });
  };

  // Function to handle form submission for updating user role
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const newRole = newRoleSelection.value;
      const credentialsID = roleData.credentialsID;

      // Makese a POST request to update the user role
      const res = await fetch("http://localhost:8080/updateUserRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newRole, credentialsID }),
      });

      if (res.ok) {
        const data = await res.text();
        alert(data);

        // Updating homepageData with the new role name
        let newHomepageDataObj = homepageData;
        newHomepageDataObj.roleName = newRoleSelection.label;
        setHomepageData(newHomepageDataObj);
        setSelectOPT("");
      }
    } catch (error) {
      console.error("Error occurred while fetching data", error);
    }
  };

  // JSX to render the component
  return (
    <div>
      <h1> </h1>
      <form onSubmit={handleSubmit}>
        <div className="select-box">
          <Select
            options={availableRoles}
            name="roles"
            value={newRoleSelection}
            onChange={handleRoleChange}
            styles={customStyles}
          />
        </div>
        {newRoleSelection.value !== null ? (
          <button type="submit" className="btn btn-dark admin-Submit-Btn">
            submit
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default UpdateUserRole;
