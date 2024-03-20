import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddAdminDivForm from './AdminContent/AddAdminDivForm'

const AdminForm = ({
  homepageData,
  setHomepageData,
  updateData,
  setUpdateData,
  usernames,
  setUsernames,
  credData,
  setCredData,
  selectOPT,
  setSelectOPT
}) => {
  // Stores state using state hooks
  const [divisions, setDivisions] = useState([]);
  const [orgUnits, setOrgUnits] = useState([]);
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  // useEffect to fetch divisions, organizational units, and usernames based on user role
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch divisions for the current user
        const credentialsID = homepageData.credentialsID;
        const divRes = await fetch("http://localhost:8080/getDivisions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID }),
        });

        // Fetch organizational units for the current user
        const orgUnitRes = await fetch("http://localhost:8080/getOrgUnits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credentialsID }),
        });
        
        // Update state with fetched divisions
        if (divRes.ok) {
          const divisions = await divRes.json();
          setDivisions(divisions);
        }
        // Update state with fetched organizational units
        if (orgUnitRes.ok) {
          const orgUnits = await orgUnitRes.json();
          setOrgUnits(orgUnits);
        }
        // Fetch all usernames if the current user is an admin or management user
        if (homepageData.roleName === "Admin User" || homepageData.roleName === "Management User") {
          const usernamesRes = await fetch(
            "http://localhost:8080/retrieveAllUsers",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          // Update state with fetched usernames
          if (usernamesRes.ok) {
            const usernames = await usernamesRes.json();
            setUsernames(usernames);
          }
        }
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };

    fetchData();

  }, [reload, homepageData.credentialsID]);

  // JSX rendering of the AdminForm component
  return (
    <div className="adminForm-rightside">
      <h3>User Role: {homepageData.roleName}</h3>
      <div className="divisions-box">
        <h5>Credentials:</h5>
        <ul>
          {divisions.map((division, index) => (
            <li key={index}>{division}</li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setUpdateData((prevState) => ({
            ...prevState,
            collectionName: "division",
          }));
          setSelectOPT("divisionUPDATE")
        }}
      >
        Update
      </button>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setSelectOPT("divisionADD")
        }}
      >
        Add
      </button>
      <div className="orgUnits-box">
        <h5>Org Units</h5>
        <ul>
          {orgUnits.map((orgUnit, index) => (
            <li key={index}>{orgUnit}</li>
          ))}
        </ul>
      </div>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setUpdateData((prevState) => ({
            ...prevState,
            collectionName: "orgUnit",
          }));
          setSelectOPT("orgUnitUPDATE")
        }}
      >
        Update
      </button>
      <button
        className="btn btn-dark"
        onClick={(e) => {
          e.preventDefault();
          setSelectOPT("orgUnitADD")
        }}
      >
        Add
      </button>
    </div>
  );
};

export default AdminForm;
