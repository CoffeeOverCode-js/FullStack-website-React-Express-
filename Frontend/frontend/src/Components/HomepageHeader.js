import { useEffect } from "react";

const Homepage = ({ formData, setFormData, loggedIn, setLoggedIn }) => {

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send a POST request to 'http://localhost:8080/view-credentials'
            const res = await fetch('http://localhost:8080/view-credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': ''
                },
            })
        } catch (error) {
            console.error(error)
        }
    }

    // JSX to render the component
    return (
        <>
            {loggedIn ? <div>
                <h1 className="heading-1">Welcome, {formData.fullName}</h1>
            </div> : <div><p>please log in</p></div>}
        </>

    );
};

export default Homepage;