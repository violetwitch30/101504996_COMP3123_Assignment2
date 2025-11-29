// page for viewing employees on the main page
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../App.css";

export default function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [error, setError] = useState("");

    const fetchEmployees = async () => {
        try {
            const res = await API.get("/api/v1/emp/employees");
            setEmployees(res.data);
        } catch (err) {
            setError("Failed to load employees.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;
        try {
            await API.delete(`/api/v1/emp/employees?eid=${id}`);
            setEmployees(prev => prev.filter(e => e._id !== id));
        } catch (err) {
            setError("Failed to delete employee.");
        }
    };

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (department.trim()) params.append("department", department.trim());
            if (position.trim()) params.append("position", position.trim());
            const res = await API.get(`/api/v1/emp/employees/search?${params.toString()}`);
            setEmployees(res.data);
        } catch (err) {
            setError("Search failed.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <div className="page-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Employees</h2>

                <div className="flex-end">
                    <button className="btn btn-blue" onClick={() => navigate("/employee")}>
                        Add Employee
                    </button>
                    <button className="btn btn-red" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            <div className="search-row">
                <input
                    className="input"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />

                <input
                    className="input"
                    placeholder="Position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />

                <button className="btn btn-blue" onClick={handleSearch}>
                    Search
                </button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <table className="table">
                <thead>
                <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Date of Joining</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {employees.map((e) => (
                    <tr key={e._id}>
                        <td>
                            {e.profilePic && (
                                <img
                                    src={e.profilePic.startsWith('http')
                                        ? e.profilePic
                                        : `http://localhost:5000/uploads/${e.profilePic}`}
                                    alt="profile"
                                    style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                                />
                            )}
                        </td>
                        <td>{e.first_name} {e.last_name}</td>
                        <td>{e.email}</td>
                        <td>{e.position}</td>
                        <td>{e.department}</td>
                        <td>${e.salary}</td>
                        <td>{e.date_of_joining ? e.date_of_joining.split("T")[0] : ""}</td>
                        <td>
                            <div className="actions">
                                <button className="btn btn-blue" onClick={() => navigate(`/employee/${e._id}`)}>Edit</button>
                                <button className="btn btn-red" onClick={() => handleDelete(e._id)}>Delete</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}