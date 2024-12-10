const { Router } = require("express");
const jwt = require("jsonwebtoken");
const employeeModel = require("../models/employee");

const router = Router({strict: true});
ROLES = ["superAdmin", "siteAdmin", "employee"];

const verifyUser = (req, res)=>{
    try {
        const { employee_details } = req.cookies;
        if (!employee_details) {
            return res.status(401).json({ message: "No authorization header" });
        }
        const authorization = employee_details.auth_token;
        if (!authorization) {
            return res.status(401).json({ message: "No authorization header" });
        }
        if (!authorization.startsWith('bearer ')) {
            return res.status(401).json({ message: "Invalid authorization header" });
        }
        jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET, async (error, payload) => {
            if(error) {
                return res.status(401).json({message: "Invalid token"});
            }
            if (ROLES.includes(payload.role)) {
                const employee = await employeeModel.findOne({_id: payload.id});
                if(employee){ 
                    return res.status(200).json({id: employee._id, name: employee.name, role: employee.role});
                }
                return res.status(404).json({ message: "User not found" });
            } else {
                return res.status(401).json({ message: "Unauthorized request" });
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "server side error" });
    }
}

router.get("/verifyUser", verifyUser);

module.exports = router;