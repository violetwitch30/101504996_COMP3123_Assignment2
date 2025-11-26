import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Employees from "./pages/Employees";
import EmployeePage from "./pages/EmployeePage";

function App() {
    const token = localStorage.getItem("token"); // check if the user is logged in

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* PROTECTED ROUTES: no token - redirect to login, token - redirect to the employees page */}
                <Route
                    path="/employees"
                    element={token ? <Employees /> : <Navigate to="/" />}
                />
                <Route
                    path="/employee"
                    element={token ? <EmployeePage /> : <Navigate to="/" />}
                />
                <Route
                    path="/employee/:id"
                    element={token ? <EmployeePage /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;