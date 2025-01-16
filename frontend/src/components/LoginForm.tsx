import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("null");

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("null");
    
        try {
          const response = await axios.post("http://localhost:5182/auth/login", {
            username,
            password,
          });
          
          // Store the token in localStorage or sessionStorage
          localStorage.setItem("token", response.data.token);
          alert("Login successful!");
        } catch {
          setError("Invalid username or password");
        }
      };

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out");
    };
    
      return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            {!localStorage.getItem("token") ? <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "15px" }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ width: "100%", padding: "10px" }}
                />
                </div>
                <div style={{ marginBottom: "15px" }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "10px" }}
                />
                </div>
                <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007BFF",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
                >
                Login
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            </> : <button onClick={handleLogout}>
                logout</button>}
        </div>
      );
    };
    
    export default LoginForm;