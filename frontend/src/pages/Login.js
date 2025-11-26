import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../App.css";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        try {
            const res = await API.post("/api/v1/user/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/employees");
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-button btn-blue" onClick={handleLogin}>
                Login
            </button>

            <Link className="auth-link" to="/signup">
                Create an account
            </Link>
        </div>
    );
}