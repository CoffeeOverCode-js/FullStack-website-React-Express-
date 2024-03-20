import { useState } from "react";
import Select from 'react-select';
import { useNavigate } from "react-router-dom";


const CredentialsForm = ({ formData, setFormData }) => {

    const navigate = useNavigate()
    const [orgUnits, setOrgUnits] = useState([]);
    const [divisions, setDivisions] = useState([]);

    // Custom styles for the Select components
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            background: "transparent"
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
    };
    // Options for organizational units
    const orgUnitsOptions = [
        { value: 1, label: 'News management' },
        { value: 2, label: 'Software reviews' },
        { value: 3, label: 'Hardware reviews' },
        { value: 4, label: 'Opinion publishing' }
    ]
    // Options for divisions
    const divisionsOptions = [
        { value: 1, label: 'Finances ' },
        { value: 2, label: 'IT' },
        { value: 3, label: 'Writing' },
        { value: 4, label: 'Development' },
        { value: 5, label: 'Software Developement' },
        { value: 6, label: 'Network Administration' },
        { value: 7, label: 'Content Writer' },
        { value: 8, label: 'Human Resources' },
        { value: 9, label: 'Customer Support' },
        { value: 10, label: 'Quality Assurance' }
    ]

    // Handles the change in selected organizational units
    const handleOrgUnitsChange = (orgUnits) => {
        setOrgUnits(orgUnits);
        setFormData({ ...formData, orgUnits: orgUnits.map(option => option.value) })
    }
    // Handles the change in selected divisions
    const handleDivisionsChange = (divisions) => {
        setDivisions(divisions);
        setFormData({
            ...formData, divisions: divisions.map(option =>
                option.value)
        })
    }

    // Submits the form data for user registration and credential addition
    const postState = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                fullName: formData.fullName,
                username: formData.username,
                password: formData.password,
                orgUnits: formData.orgUnits,
                divisions: formData.divisions
            };
            // Send a POST request to register and add credentials
            const res = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(postData)
            });
            // Display success message or log an error
            if (res.ok) {
                const data = await res.text();
                alert(data)
                } else {
                console.error('Failed to post data:', res.statusText);
            }
            // Navigate to the login page
            navigate('/login')
        } catch (error) {
            console.error(error);
        }
    };

    // JSX rendering of the CredentialsForm component
    return (
        <div className="wrapper">
                <form onSubmit={postState} className="login-form">
                <h1>Credentials</h1>
                <div className="select-box"
                >
                    <Select
                        options={orgUnitsOptions}
                        name="orgUnits"
                        isMulti
                        value={orgUnits}
                        onChange={handleOrgUnitsChange}
                        styles={customStyles}
                    />
                </div>
                    <div className="select-space"/>
                <div className="select-box">
                    <Select
                        options={divisionsOptions}
                        name="divisions"
                        isMulti
                        value={divisions}
                        onChange={handleDivisionsChange}
                        styles={customStyles}
                    />
                </div>
                <button type="submit" className="custom-btn">Add Credentials</button>
                <div className="register-link">
                    <p>Don't have an account? <a href='#'>Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default CredentialsForm;