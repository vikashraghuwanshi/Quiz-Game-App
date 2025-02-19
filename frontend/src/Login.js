import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./services/auth_service";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoginButtonDisabled(true);
      setError(null);

      const token = await loginUser(username, password);
      localStorage.setItem("token", token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoginButtonDisabled(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login to Play</h2>
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
        onClick={handleLogin}
        disabled={loginButtonDisabled}
        style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer" }}
      >
        Login
      </button>
      <br /><br />
      <button
        onClick={() => navigate("/register")}
        style={{ padding: "8px 16px", fontSize: "16px", cursor: "pointer" }}
      >
        Register
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
