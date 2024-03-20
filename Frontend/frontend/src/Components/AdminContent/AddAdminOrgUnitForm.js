import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddAdminOrgUnitForm = ({
  credData,
  setCredData,
  homepageData,
  token,
  selectOPT,
  setSelectOPT,
}) => {
  // Initializes state variables using state hooks
  const [availableCreds, setAvailableCreds] = useState([]);
  const [credential, setCredential] = useState({
    value: null,
    label: "Select...",
  });

  // Hooks for navigation
  const navigate = useNavigate();

  // Effect to fetch available credentials on component mount or when homepageData.credentialsID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const credentialsID = homepageData.credentialsID;
        const collectionName = "orgUnit";

        // Fetching available credentials based on credentialsID and collectionName

        const res = await fetch("http://localhost:8080/availableCreds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID, collectionName }),
        });

        // Checking if the fetch was successful

        if (res.ok) {
          const data = await res.json();
          setAvailableCreds(data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [homepageData.credentialsID]);

  // Styling options for the Select component
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "transparent",
    }),

    menu: (provided, state) => ({
      ...provided,
      background: "transparent",
      marginTop: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      position: "relative",
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

  // Function to handle changes when a credential is selected
  const handleCredentialChange = (credential) => {
    const value = credential.value;
    const label = credential.label;
    setCredential({
      value: value,
      label: label,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const credentialsID = homepageData.credentialsID;
      const jwttoken = token;
      const collectionName = "orgUnit";
      const repoID = credential.value;

      // Making a POST request to add the selected credential
      const res = await fetch("http://localhost:8080/add-credential", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwttoken}`,
        },
        body: JSON.stringify({ credentialsID, collectionName, repoID }),
      });
      if (res.ok) {
        const data = await res.text();
        alert(data);
        setSelectOPT("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // JSX to render the component
  return (
    <div className="AdminForms">
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Add Credential</h1>
          <div className="select-box">
            <Select
              options={availableCreds}
              name="repo"
              value={credential}
              onChange={handleCredentialChange}
              styles={customStyles}
            />
          </div>
          <button type="submit" className="custom-btn">
            Add Credential
          </button>
        </form>
      </div>{" "}
    </div>
  );
};

export default AddAdminOrgUnitForm;
