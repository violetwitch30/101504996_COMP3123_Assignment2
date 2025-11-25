const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/EmployeeModel');
const router = express.Router();
const auth = require("../middleware/auth");

// 3. GET /api/v1/emp/employees
// get all employees
router.get('/employees', auth, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 4. POST /api/v1/emp/employees
// create new employee
router.post('/employees',
    [
        body('first_name').notEmpty().withMessage('First Name is required'),
        body('last_name').notEmpty().withMessage('Last Name is required'),
        body('email').isEmail().withMessage('Email is required'),
        body('position').notEmpty().withMessage('Position is required'),
        body('salary').isNumeric().withMessage('Salary should be a number'),
        body('date_of_joining').notEmpty().withMessage('Date of joining is required'),
        body('department').notEmpty().withMessage('Department is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newEmp = new Employee(req.body);
            await newEmp.save();
            res.status(201).json({ message: 'Employee created successfully.', employee_id: newEmp._id });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
);

// GET /api/v1/emp/employees/search?department=&position=
// search employees by department or position
router.get('/employees/search', async (req, res) => {
    try {
        const { department, position } = req.query;
        const filter = {};
        if (department) filter.department = { $regex: department, $options: 'i' };
        if (position) filter.position = { $regex: position, $options: 'i' };
        const results = await Employee.find(filter);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. GET /api/v1/emp/employees/:eid
// get employee by id
router.get('/employees/:eid', async (req, res) => {
    try {
        const emp = await Employee.findById(req.params.eid);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        res.status(200).json(emp);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6. PUT /api/v1/emp/employees/:eid
router.put('/employees/:eid', async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee details updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. DELETE /api/v1/emp/employees?eid=xxx
router.delete('/employees', async (req, res) => {
    try {
        const eid = req.query.eid;
        if (!eid) {
            return res.status(400).json({ message: 'Employee ID required' });
        }

        const deleted = await Employee.findByIdAndDelete(eid);
        if (!deleted) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // i deleted returning a message as status code 204 returns an empty body
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;