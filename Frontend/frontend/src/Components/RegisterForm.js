import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ formData, setFormData }) => {
  // Hook for navigation
  const navigate = useNavigate();
  // State to manage loading state during registration
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Destructuring formData object
    const fullName = formData.fullName;
    const usr = formData.username;
    const pwd = formData.password;

    // Set loading to true to indicate registration process
    setLoading(true);

    // Simulate asynchronous registration process
    setTimeout(() => {
      // Navigate to the credentials page after 2000 ms
      navigate("/credentials");
    }, 2000);
  };

  // JSX to render the component
  return (
    <div className="wrapper">
      {/* Registration form */}
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Register</h1>
        <div className="input-box">
          {/* Full Name input */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
        </div>
        <div className="space-input"></div>
        <div className="input-box">
          {/* Username input */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
        </div>
        <div className="space-input"></div>
        <div className="input-box">
          {/* Password input */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
            required
          />
        </div>
        <div className="space"></div>
        {/* Button to submit the form, displays "Loading..." during registration */}
        <button type="submit" className="custom-btn">
          {loading === true ? "Loading..." : "Register"}
        </button>
        <div className="register-link">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
