import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";
import Select from "react-select";

const UpdateForm = ({
  updateData,
  setUpdateData,
  homepageData,
  token,
  selectOPT,
  setSelectOPT,
}) => {

  // Initializes State using state hooks
  const [availableCreds, setAvailableCreds] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [selectedCred, setSelectedCred] = useState({
    value: null,
    label: "Original...",
  });
  const [updateCred, setUpdateCred] = useState({
    value: null,
    label: "Update...",
  });

  // Hook for navigation
  const navigate = useNavigate();

  // Fetch available and original credentials when homepageData.credentialsID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const credentialsID = homepageData.credentialsID;
        const collectionName = updateData.collectionName;

        // Fetch available credential
        const availableCredRes = await fetch(
          "http://localhost:8080/availableCreds",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credentialsID, collectionName }),
          }
        );

        if (availableCredRes.ok) {
          const data = await availableCredRes.json();
          setAvailableCreds(data);
        }

        // Fetch original credentials
        const originalCredRes = await fetch(
          "http://localhost:8080/originalCreds",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credentialsID, collectionName }),
          }
        );
        if (originalCredRes.ok) {
          const data = await originalCredRes.json();
          setCredentials(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [homepageData.credentialsID]);

  // Styles for the custom Select component
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

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCred.value !== null && updateCred.value !== null) {

        const credentialsID = homepageData.credentialsID;
        const jwttoken = token;
        const selection = updateData.collectionName;
        const oldUnitID = selectedCred.value;
        const newUnitID = updateCred.value;

        // Makes a request to update the credential
        const res = await fetch("http://localhost:8080/update-credential", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            credentialsID,
            selection,
            oldUnitID,
            newUnitID,
          }),
        });
        if (res.ok) {
          const data = await res.text();
          alert(data);

          // Navigate back to the homepage or reset selectOPT
          if (selectOPT === "") {
            navigate("/");
          } else {
            setSelectOPT("");
          }
        }
      } else {
        alert("Please fill in both Select Boxes");
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Function to handle the change in the selected credential for update
  const handleUpdateChange = (credential) => {
    const value = credential.value;
    const label = credential.label;

    setUpdateCred({
      value: value,
      label: label,
    });
  };

  // Function to handle the change in the selected original credential
  const handleOriginalChange = (credential) => {
    const value = credential.value;
    const label = credential.label;
    setSelectedCred({
      value: value,
      label: label,
    });
  };

  // JSX to render the component
  return (
    <div>
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Update Credential({updateData.collectionName})</h1>
          <div className="select-box">
            <Select
              required
              options={credentials}
              name="originalCred"
              value={selectedCred}
              onChange={handleOriginalChange}
              styles={customStyles}
            />
          </div>
          <div className="select-box">
            <Select
              required
              options={availableCreds}
              name="updateCred"
              value={updateCred}
              onChange={handleUpdateChange}
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

export default UpdateForm;
