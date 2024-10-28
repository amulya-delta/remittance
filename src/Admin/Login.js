
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RACF_ID: username,
          password: password,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);  // Save token
        localStorage.setItem("user", username); // Save username
        onLogin(username);
        navigate("/admin-Home");
      } else {
        setError("Login failed: Invalid username or password");
      }
    } catch (error) {
      setError("Error during login: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 id="hh">Admin Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
        <div>
          <p className="E">
            <Link to={`/forgot-password`} className="R">
              Forgot password
            </Link>
          </p>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
