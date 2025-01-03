const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
const progressModel = require("../models/progress");
const dailyRecordModel = require("../models/dailyrecord");
const employeeModel = require("../models/employee");
const siteModel = require("../models/site");
const logService = require("./log");
const logModel = require("../models/log");
const { v4: uuidv4 } = require("uuid");
const uploadEmployee = require("../middlewares/employee-uploads");
const log = require("../models/log");
const multer = require("multer");

const upload = multer();

exports.getEmployees = async (req, res) => {
  try {
    const results = await employeeModel.find({ activeStatus: 1 }).populate({
      path: "assignedworks.siteId",
      select: "_id name location info",
    })
    .populate({
      path: "assignedworks.works.id",
      select: "_id name description",
    });
    const employees = results.map((result) => {
      const { _id, name, email, mobile, role, skill, status, employeeId, profilePhoto } = result;

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      let imageUrl = profilePhoto?.imageUrl ? `${baseUrl}${profilePhoto.imageUrl}` : null;
        imageUrl = imageUrl.replace('/uploads', '');
      return { _id, name, email, mobile, role, skill, status, employeeId, profilePhoto: imageUrl };
    });

    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error. Could not fetch resources." });
  }
};

    exports.postEmployees = async (req, res) => {
      try {
        // Access uploaded file and text fields
        const { file, body } = req;

        console.log(body);
        console.log(req.file);
    
        // Ensure file and necessary fields are provided
        if (!file) {
          return res.status(400).json({ message: "File upload is required." });
        }
        const { email, employeeName, mobileNumber, role, skillName } = body;
    
        // Check if an employee with the same email exists
        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) {
          return res.status(400).json({ message: "Email already exists." });
        }
    
        // Save the new employee record
        const newEmployee = new employeeModel({
          name: employeeName,
          email: email,
          password: "123456", // Example password, replace with a secure one
          mobile: mobileNumber,
          role: role,
          skill: skillName,
          status: "Incomplete",
          profilePhoto: {
            imageUrl: `/uploads/employees/${req.generatedEmployeeId}/${file.filename}`,
          },
          activeStatus: 1,
          employeeId: req.generatedEmployeeId,
        });
    
        const savedEmployee = await newEmployee.save();
    
        return res.status(201).json({
          message: "Employee created successfully.",
          employee: savedEmployee,
        });
      } catch (error) {
        console.error("Error in postEmployees:", error.message);
        res.status(500).json({ message: "Internal server error." });
      }
    };

exports.updateEmployeeDetails = async (req, res) =>{
  try {
    const id = req.params.id
    const userExist = await employeeModel.findOne({employeeId: id})
    if(!userExist){
      return res.status(404).json({message: "User doesn't exist"})
    }
    const updateUserDetails = await employeeModel.findByIdAndUpdate(id, req.body, {new:true})
    res.status(200).json(updateUserDetails)
  } catch (error) {
    res.status(500).json({error : "Internal server error"})
  }
}

exports.deleteEmployee = async(req, res)=>{
  console.log("hhh")
  try {
    // console.log(req)
    const id = req.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid employee ID" });
    }

    // Attempt to delete the employee
    const deletedEmployee = await employeeModel.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.getEmployeeByRole = async (req, res) => {
  try {
    const results = await employeeModel.find(
      { role: req.params.role },
      { activeStatus: 1 }
    );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `Employee with role ${req.params.role} not found` });
    }
    const employees = results.map((result) => {
      const { _id, name, email, mobile, role, skill, status } = result;
      return { _id, name, email, mobile, role, skill, status };
    });
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error occurred. Please try again later." });
  }
};

exports.getEmployeeStatus = async (req, res) => {
  try {
    const results = await employeeModel.find(
      { status: req.params.status },
      { activeStatus: 1 }
    );
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `No one with status ${req.params.status}` });
    }
    const employees = results.map((result) => {
      const { _id, name, email, mobile, role, skill, status } = result;
      return { _id, name, email, mobile, role, skill, status };
    });
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error occurred. Please try again later." });
  }
};

exports.getLastAssignedWoryByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const dailyRecord = await dailyRecordModel
      .find({
        employeeId: employeeId,
      })
      .sort({
        date: -1,
      })
      .limit(1);
    return res.status(200).json({ result: dailyRecord });
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.getSiteBySiteId = async (req, res) => {
  try {
    const { siteId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const site = await siteModel.findById(siteId);
    if (site) {
      return res.status(200).json(site);
    } else {
      return res.status(404).json({ message: "Site Id not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.addDailyRecord = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const dailyRecord = req.body;
    dailyRecord.date = new Date();
    await dailyRecordModel.create(dailyRecord);
    await employeeModel.findByIdAndUpdate(
      dailyRecord.employeeId,
      { status: "assigned" },
      { new: true, runValidators: true }
    );
    await session.commitTransaction();
    session.endSession();
    await logService({
      modifierId: req.cookies.employee_details.id,
      employeeId: dailyRecord.employeeId,
      operation: "assignedWork",
      message: "Assigned work to",
    });
    res.status(201).json({ message: "Record added successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Bad Request: Validation failed",
        details: error.message,
      });
    } else if (error.code === 11000) {
      return res.status(409).json({
        message: "Conflict: Duplicate key error",
        details: error.message,
      });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};

exports.getSitesBySiteAdminId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const sites = await siteModel.find({
      siteAdmins: employeeId,
    });
    return res.status(200).json({ sites: sites });
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.addProgressImage = async (req, res) => {
  try {
    req.body.data = JSON.parse(req.body.data);
    const filepath = path.join(__dirname, `../uploads/progress`);
    await createDirIfNotExists(filepath, req);
    await moveFiles(filepath, req);
    res.status(200).json({ message: "image upload successful" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Bad Request: Validation failed",
        details: error.message,
      });
    }
    res.status(500).json({
      message: "Error occured while uploading image",
      details: error.message,
    });
  }
};

exports.updateProgressImage = async (req, res) => {
  try {
    req.body.data = JSON.parse(req.body.data);
    const progress = req.body.data;
    const targetImagePath = progress.imageUrl;
    const filepath = path.join(__dirname, `../uploads/progress`);
    const files = await fs.readdir(`${filepath}/temporary`);
    const sourceImagePath = `${filepath}/temporary/${files[0]}`;
    await fs.copyFile(sourceImagePath, targetImagePath);
    await fs.unlink(`${filepath}/temporary/${files[0]}`);
    res.status(200).json({ message: "Updated progress image successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Bad Request: Validation failed",
        details: error.message,
      });
    } else if (error.code === 11000) {
      return res.status(409).json({
        message: "Conflict: Duplicate key error",
        details: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error occured while uploading image",
        details: error.message,
      });
    }
  }
};

const formatDate = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();

  return `${day}-${month}-${year}`;
};

const createDirIfNotExists = async (filepath, req) => {
  await fs.mkdir(`${filepath}/${req.body.data.siteId}`, { recursive: true });
  await fs.mkdir(`${filepath}/${req.body.data.siteId}/${formatDate()}`, {
    recursive: true,
  });
};

const moveFiles = async (filepath, req) => {
  const files = await fs.readdir(`${filepath}/temporary`);

  for (const file of files) {
    const oldPath = path.join(`${filepath}/temporary`, file);
    const newPath = path.join(
      `${filepath}/${req.body.data.siteId}/${formatDate()}`,
      file
    );
    const progress = req.body.data;
    progress.imageUrl = newPath;
    progress.date = formatDate();
    await progressModel.create(progress);
    await fs.rename(oldPath, newPath);
  }
};

exports.getProgressBySite = async (req, res) => {
  try {
    const results = await progressModel.find({ siteId: req.params.siteId });
    if (results.length === 0) {
      return res.status(404).json({
        message: "No progress foound with siteId " + req.params.siteId,
      });
    }
    const progressImages = await Promise.all(
      results.map(async (result) => {
        const imageData = await fs.readFile(result.imageUrl);
        const ext = path.extname(result.imageUrl);
        const mimeType = getMimeType(ext);
        const base64Image = Buffer.from(imageData).toString("base64");
        const progressImage = `data:${mimeType};base64,${base64Image}`;

        const { siteId, name, comments, date } = result;
        return { siteId, name, comments, date, progressImage };
      })
    );

    res.status(200).json(progressImages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

function getMimeType(ext) {
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

const getLogsByCondition = async (res, condition) => {
  const logs = await logModel
    .find(condition)
    .populate("modifierId")
    .populate("employeeId")
    .populate("siteId");
  return res.status(200).json({ logs });
};

exports.getAllLogs = (req, res) => {
  try {
    getLogsByCondition(res, {});
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.getLogsByOperation = (req, res) => {
  try {
    const { operation } = req.params;
    getLogsByCondition(res, { operation });
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.getLogsByModifierId = (req, res) => {
  try {
    const { modifierId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(modifierId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    getLogsByCondition(res, { modifierId });
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.getLogsByDate = (req, res) => {
  try {
    const { date } = req.params;
    const formatedDate = new Date(date);
    if (formatedDate === "Invalid Date") {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const nextFormattedDate = new Date(formatedDate);
    nextFormattedDate.setDate(nextFormattedDate.getDate() + 1);
    const timeStamps = {
      timeStamps: {
        $gte: formatedDate,
        $lt: nextFormattedDate,
      },
    };
    console.log(timeStamps);
    getLogsByCondition(res, timeStamps);
  } catch (error) {
    return res.status(500).json({ message: "Server side error" });
  }
};

exports.deleteProgressImage = async (req, res) => {
  try {
    const progress = await progressModel.find({ _id: req.params.progressId });
    if (!progress) {
      return res.status(404).json({ message: "Progress Id not found" });
    }
    await fs.unlink(progress.imageUrl);
    const result = await progressModel.deleteOne({
      _id: req.params.progressId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Progress image deleted successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Bad Request: Invalid ID" });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};
