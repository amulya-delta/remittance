import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import "./LoginUser.css";

const LoginUser = ({ onUserLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleUserLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/user_login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ RACF_ID: username, password })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("empuser", username); // Save empuser
        localStorage.setItem("racfId", username); // Save RACF_ID
        onUserLogin(username);
        navigate("/user-Home");
      } else {
        setError(data.message || "Login failed: Invalid username or password");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Employee Login</h2>
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
        <button type="button" onClick={handleUserLogin}>
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

export default LoginUser;
