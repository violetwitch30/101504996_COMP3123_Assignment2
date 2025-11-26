import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "../App.css";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setError("");

        try {
            await API.post("/api/v1/user/signup", {
                username,
                email,
                password
            });
            navigate("/");
        } catch (err) {
            setError("Error creating account.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Create Account</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <input
                className="auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

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

            <button className="auth-button btn-blue" onClick={handleSubmit}>
                Sign Up
            </button>

            <Link className="auth-link" to="/">
                Already have an account? Login
            </Link>
        </div>
    );
}