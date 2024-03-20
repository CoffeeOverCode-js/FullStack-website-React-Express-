import 'boxicons'
import lock from './../Images/lock.png'
import user from './../Images/user.png'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const LoginForm = ({ loggedIn, setLoggedIn, formData, setFormData, homepageData, setHomepageData, token, setToken }) => {

    // State for login form data
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    // Hook for navigation
    const navigate = useNavigate()

    // Function to fetch user data based on credentials ID
    const getUser = async (credentialsID) => {
        const res = await fetch('http://localhost:8080/getUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentialsID })
        })
        if (res.ok) {
            const user = await res.json();
            return user;
        };
    }

    // Function to fetch user role based on credentials ID
    const getRole = async (credentialsID) => {
        const res = await fetch('http://localhost:8080/getRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ credentialsID })
        })
        if (res.ok) {
            const roleData = await res.text();
            return roleData;
        }
    }

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const usr = loginData.username;
        const pwd = loginData.password;

        try {
            // Send a POST request to 'http://localhost:8080/login'
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usr, pwd })
            });
            // Check if the response is successful
            if (response.ok) {
                // Parse the response data
                const data = await response.json();
                const token = data.jwt
                const id = data.credentialsID
                setLoggedIn(true)

                // Fetch user data based on credentials ID
                const user = await getUser(id)
                const fullName = user.fullName;
                const username = user.username;
                const password = pwd;
                const orgUnits = user.orgUnits;
                const divisions = user.divisions;

                // Fetch user role based on credentials ID
                const roleName = await getRole(id)

                // Update form data state
                setFormData({
                    fullName: fullName,
                    username: username,
                    password: password,
                    orgUnits: orgUnits,
                    divisions: divisions
                })

                // Update homepage data state
                setHomepageData({
                    credentialsID: id,
                    roleName: roleName
                    
                });
                // Set the token state
                setToken(token)
                
                // Navigates to homepage
                navigate('/')

            } else {
                const error = await response.text()
                alert(error)
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    // JSX to render the component
    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>
                {/* Username input */}
                <div className="input-box">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                    />

                    <img src={user} alt='user' className='user-lock' />
                </div>
                <div className='space-input'></div>
                <div className="input-box">
                    {/* Password input */}
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Password"
                        required
                    />
                    <img src={lock} alt='lock' className='user-lock' />
                </div>
                <div className='space'></div>

                {/* Login button */}
                <button type="submit" className="custom-btn">Login</button>
                
                {/* Registration link */}
                <div className="register-link">
                    <p>Don't have an account? <a href='/register'>Register</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;