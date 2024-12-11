const mongoose = require("mongoose");
const employeeModel = require("../models/employee");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
      const { email, password, role } = req.body;
      console.log(email, password);
      if (!email || !password) {
        return res.status(400).json({ message: "Unsufficient data" });
      }
      const employee = await employeeModel.findOne({ email: email, role: role });
      console.log(employee);
      if (!employee) {
        return res.status(401).json({ message: "Employee not found" });
      }
      // const result = await bcrypt.compare(password, employee.password);
      console.log(employee);
      if(employee.role !== "superAdmin"){
        return res.status(403).json({ message: "Employee Unauthorised" })
      }
      if (password === employee.password) {
        const payload = { id: employee._id, role: employee.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        res
          .status(200)
          .cookie(
            "employee_details",
            { auth_token: `bearer ${token}` },
            { maxAge: 9000000, httpOnly: true }
          );
        return res.status(200).json({ message: "LoggedIn successfully", id: employee._id, name: employee.name, role: employee.role});
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server side error" });
    }
  };

exports.logout = (req, res) => {
  try{
    res.clearCookie('employee_details', {httpOnly: true, secure: true});
    res.status(200).json({message: "Logout Successfully"})
  }catch(error){
    console.log("Error in AuthHandler: ",error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}