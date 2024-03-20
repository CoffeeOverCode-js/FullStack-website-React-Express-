import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AddOrgUnitForm = ({ credData, setCredData, homepageData, token }) => {
    // State to store the available credentials
    const [availableCreds, setAvailableCreds] = useState([]);
    // State to manage the selected credential
    const [credential, setCredential] = useState({
        value: null,
        label: 'Select...'
    });
    // Hook to enable navigation between pages
    const navigate = useNavigate();

    // Fetch available credentials when the component mounts or when homepageData changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const credentialsID = homepageData.credentialsID;
                const collectionName = 'orgUnit';
                
                // Fetch data from the server
                const res = await fetch('http://localhost:8080/availableCreds', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ credentialsID, collectionName })
                });

                if (res.ok) {
                    // Parse and set the available credentials
                    const data = await res.json();
                    setAvailableCreds(data)
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [homepageData.credentialsID])

    // Styles for customizing the appearance of the Select component
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: "transparent",
        }),

        menu: (provided, state) => ({
            ...provided,
            background: "transparent",
            marginTop: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            position: "relative",
        }),
        option: (provided, state) => ({
            ...provided,
            '&:hover': {
                backgroundColor: 'black',
                color: 'white',
            },
            '&:not(:hover)': {
                backgroundColor: 'transparent',
                color: 'white',
            },
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: 'white'
        }),
    };

    // Handles change when a credential is selected
    const handleCredentialChange = (credential) => {
        const value = credential.value;
        const label = credential.label;
        setCredential({
            value: value,
            label: label
        });
    }

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const credentialsID = homepageData.credentialsID;
            const jwttoken = token;
            const collectionName = 'orgUnit';
            const repoID = credential.value
            
            // Sends a request to add the selected credential
            const res = await fetch('http://localhost:8080/add-credential', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwttoken}`
                },
                body: JSON.stringify({ credentialsID, collectionName, repoID })
            });
            if (res.ok) {
                // Shows an alert if the operation is successful
                const data = await res.text()
                alert(data)
            }
            // Navigates back to the homepage after submission
            navigate('/')
        } catch (e) {
            console.error(e)
        }
    }

    // Renders the components JSX
    return (
        <div>
            <div className="wrapper">
                <form onSubmit={handleSubmit} className="login-form">
                    <h1>Add Credential</h1>
                    <div className="select-box">
                        {/* Renders the Select component with the available credentials and styles */}
                        <Select
                            options={availableCreds}
                            name="repo"
                            value={credential}
                            onChange={handleCredentialChange}
                            styles={customStyles}
                        />
                    </div>
                    {/* Button to submit the form */}
                    <button type="submit" className="custom-btn">Add Credential</button>
                </form>
            </div>
        </div>
    )
}

export default AddOrgUnitForm;