import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "./services/auth_service";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setRegisterButtonDisabled(true);
      setError(null);

      await registerUser(username, password);
      alert("Registration successful! Please login.");
      navigate("/"); // redirect to Login page
    } catch (err) {
      setError(err.message);
    } finally {
      setRegisterButtonDisabled(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Register to Play</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "10px", fontSize: "18px", marginBottom: "10px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", fontSize: "18px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={handleRegister}
        disabled={registerButtonDisabled}
        style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}
      >
        Register
      </button>
      <br /><br />
      <button
        onClick={() => navigate("/")}
        style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}
      >
        Go to Login
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;
