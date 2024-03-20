// Importing React hooks and components
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

// Functional component AddCredForm
const AddCredForm = ({ credData, setCredData, homepageData, token }) => {

  // State variables using the useState hook
  const [availableCreds, setAvailableCreds] = useState([]);
  const [credential, setCredential] = useState({
    value: null,
    label: "Select...",
  });
  const navigate = useNavigate();

  // Fetch available credentials when the homepageData.credentialsID changes
  // or when component first renders
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract credentialsID and collectionName
        const credentialsID = homepageData.credentialsID;
        const collectionName = "division";
        
        // Fetch available credentials from the server
        const res = await fetch("http://localhost:8080/availableCreds", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID, collectionName }),
        });

        // If the fetch is successful, update the availableCreds state
        if (res.ok) {
          const data = await res.json();
          setAvailableCreds(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Calls the fetchData function
    fetchData();
  }, [homepageData.credentialsID]);
  
  // Custom styles for the Select component
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

  // Handle credential change when selecting an option from the dropdown
  const handleCredentialChange = (credential) => {
    const value = credential.value;
    const label = credential.label;
    setCredential({
      value: value,
      label: label,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extracts necessary data for the API request
      const credentialsID = homepageData.credentialsID;
      const jwttoken = token;
      const collectionName = "division";
      const repoID = credential.value;

      // Makes a request to add the credential
      const res = await fetch("http://localhost:8080/add-credential", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwttoken}`,
        },
        body: JSON.stringify({ credentialsID, collectionName, repoID }),
      });

      // If the request is successful, shosw an alert and navigate to the homepage
      if (res.ok) {
        const data = await res.text();
        alert(data);
      }

      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  // JSX structure for the AddCredForm component
  return (
    <div>
      <div className="wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Add Credential</h1>
          <div className="select-box">
            {/* Select component for choosing available credentials */}
            <Select
              options={availableCreds}
              name="repo"
              value={credential}
              onChange={handleCredentialChange}
              styles={customStyles}
            />
          </div>
          {/* Button to submit the form */}
          <button type="submit" className="custom-btn">
            Add Credential
          </button>
        </form>
      </div>{" "}
    </div>
  );
};

export default AddCredForm;
