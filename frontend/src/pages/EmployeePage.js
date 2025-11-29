// page for adding/editing employees
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/api';
import"../App.css";

export default function EmployeePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        department: "",
        salary: "",
        date_of_joining: ""
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            API.get(`/api/v1/emp/employees/${id}`)
                .then(res => {
                    const emp = res.data;
                    const formattedDate = emp.date_of_joining ? new Date(emp.date_of_joining).toISOString().split("T")[0] : ""; // formatted date
                    setEmployee({ ...emp, date_of_joining: formattedDate });
                })
                .catch(() => setError("Failed to load employee"));
        }
    }, [id]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            Object.keys(employee).forEach(key => {
                if (key !== "profilePic") {
                    formData.append(key, employee[key]);
                }
            });

            if (employee.profilePic instanceof File) {
                formData.append("profilePic", employee.profilePic);
            }

            if (id) {
                await API.put(`/api/v1/emp/employees/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await API.post("/api/v1/emp/employees", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            navigate("/employees");
        } catch (err) {
            setError("Failed to save employee");
        }
    };

    return (
        <div className="box">
            <h2>{id ? "Edit Employee" : "Add Employee"}</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="row">
                <input
                    className="input"
                    name="first_name"
                    placeholder="First Name"
                    value={employee.first_name}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    name="last_name"
                    placeholder="Last Name"
                    value={employee.last_name}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    name="email"
                    placeholder="Email"
                    value={employee.email}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    name="position"
                    placeholder="Position"
                    value={employee.position}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    name="department"
                    placeholder="Department"
                    value={employee.department}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    name="salary"
                    placeholder="Salary"
                    value={employee.salary}
                    onChange={handleChange}
                />
                <input
                    className="input"
                    type="date"
                    name="date_of_joining"
                    placeholder="Date of Joining"
                    value={employee.date_of_joining || ""}
                    onChange={handleChange}
                />
            </div>

            <div className="profile-pic-container">
                <label htmlFor="profilePic" className="profile-pic-label">
                    {employee.profilePic ? (
                        <img
                            src={typeof employee.profilePic === "string"
                                ? employee.profilePic.startsWith('http')
                                    ? employee.profilePic
                                    : `http://localhost:5000/uploads/${employee.profilePic}`
                                : URL.createObjectURL(employee.profilePic)}
                            alt="preview"
                            className="profile-pic-preview"
                        />
                    ) : (
                        <div className="profile-pic-placeholder">Upload</div>
                    )}
                </label>
                <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEmployee({ ...employee, profilePic: e.target.files[0] })}
                    style={{ display: "none" }}
                />
            </div>

            <div className="flex-end">
                <button className="btn-blue" onClick={handleSubmit}>
                    {id ? "Update" : "Add"} Employee
                </button>
                <button className="btn-red" onClick={() => navigate("/employees")}>
                    Cancel
                </button>
            </div>
        </div>
    );
}