const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const employeeModel = require("../models/employee");
const siteModel = require("../models/site");
const dailyRecordModel = require("../models/dailyrecord");
const workModel = require("../models/work");
const logService = require("./log");
const jwt = require("jsonwebtoken");


// exports.login = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     console.log(email, password);
//     if (!email || !password) {
//       return res.status(400).json({ message: "Unsufficient data" });
//     }
//     const employee = await employeeModel.findOne({ email: email, role: role });
//     console.log(employee);
//     if (!employee) {
//       return res.status(401).json({ message: "Employee not found" });
//     }
//     // const result = await bcrypt.compare(password, employee.password);
//     console.log(employee);
//     if(employee.role !== "superAdmin"){
//       return res.status(403).json({ message: "Employee Unauthorised" })
//     }
//     if (password === employee.password) {
//       const payload = { id: employee._id, role: employee.role };
//       const token = jwt.sign(payload, process.env.JWT_SECRET);
//       res
//         .status(200)
//         .cookie(
//           "employee_details",
//           { auth_token: `bearer ${token}` },
//           { maxAge: 9000000, httpOnly: true }
//         );
//       return res.status(200).json({ message: "LoggedIn successfully", id: employee._id, name: employee.name, role: employee.role});
//     } else {
//       return res.status(401).json({ message: "Invalid password" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Server side error" });
//   }
// };

exports.register = async (req, res) => {
  const employee = req.body;
  const { password } = employee;
  if (!password) {
    return res.status(400).json({ message: "Password field is empty" });
  }
  employee.password = bcrypt.hashSync(password, 10);
  try {
    const newEmployee = await employeeModel.create(employee);
    await logService({
      modifierId: req.cookies.employee_details.id,
      employeeId: newEmployee._id,
      operation: "createdEmployee",
      message: "Created new employee",
    });
    res.status(201).json({ message: "Employee registered successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Bad Request: Validation failed",
        details: error.message,
      });
    } else if (error.code === 11000) {
      res.status(409).json({
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

exports.removeEmployee = async (req, res) => {
  try {
    const result = await employeeModel.findByIdAndUpdate(
      req.params.employeeId,
      { activeStatus: 0 },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee removed successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Bad Request: Invalid employee ID" });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};

exports.addSite = async (req, res) => {
  console.log(req.body);
  try {
    const { name, location, info, siteAdmins } = req.body;

    const site = {
      name,
      location,
      info,
      siteAdmins: [siteAdmins],
    };

    const newSite = await siteModel.create(site);

    await logService({
      // modifierId: req.cookies.employee_details.id,
      siteId: newSite._id,
      operation: "createdSite",
      message: "Created new site",
    });

    res.status(201).json({ message: "Site added successfully", site: newSite });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).json({
        message: "Bad Request: Validation failed",
        details: error.message,
      });
    } else {
      console.log(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};

exports.getSites = async (req, res) => {
  try {
    const result = await siteModel.find({}).populate({
      path: "siteAdmins",
      select: "name",
    });

    const formattedResult = result.map((site) => {
      return {
        _id: site._id,
        name: site.name,
        location: site.location,
        info: site.info,
        siteAdmins: site.siteAdmins.map((admin) => admin.name),
      };
    });

    res.status(200).json(formattedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error. Could not fetch resources." });
  }
};

exports.updateSiteBasicInfo = async (req, res) => {
  try {
    const { siteId } = req.params;
    const newSiteDetails = req.body;
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (!newSiteDetails) {
      return res.status(400).json({ message: "No data in request body" });
    }
    delete newSiteDetails.siteAdmins;
    const result = await siteModel.findByIdAndUpdate(siteId, newSiteDetails, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ messsage: "Site Id not found" });
    }
    await logService({
      modifierId: req.cookies.employee_details.id,
      siteId: result._id,
      operation: "updatedSite",
      message: "Updated site details",
    });
    return res
      .status(200)
      .json({ message: "Successfully updated site details" });
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

exports.addSiteAdminsIntoSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { siteAdmins } = req.body;
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (!siteAdmins) {
      return res
        .status(400)
        .json({ message: "No siteadmins data in the request body" });
    }
    const result = await siteModel.findByIdAndUpdate(
      siteId,
      {
        $push: {
          siteAdmins: {
            $each: siteAdmins,
          },
        },
      },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Site Id not found" });
    }
    await logService({
      modifierId: req.cookies.employee_details.id,
      siteId: result._id,
      operation: "addedAdmin",
      message: "Added site admins",
    });
    return res
      .status(200)
      .json({ message: "Site admins added successfully into site" });
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

exports.deleteSiteAdminsIntoSite = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { siteAdmins } = req.body;
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    if (!siteAdmins) {
      return res
        .status(400)
        .json({ message: "No siteadmins data in the request body" });
    }
    const result = await siteModel.findByIdAndUpdate(
      siteId,
      {
        $pull: {
          siteAdmins: {
            $in: siteAdmins,
          },
        },
      },
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).json({ message: "Site Id not found" });
    }
    await logService({
      modifierId: req.cookies.employee_details.id,
      siteId: result._id,
      operation: "deletedAdmin",
      message: "Deleted site admins",
    });
    return res
      .status(200)
      .json({ message: "Site admins deleted successfully from site" });
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

exports.removeSite = async (req, res) => {
  try {
    const result = await siteModel.deleteOne({ _id: req.params.siteId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Site not found" });
    }
    res.status(200).json({ message: "Site removed successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Bad Request: Invalid site ID" });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};

exports.getAllDailyRecords = async (req, res) => {
  try {
    const results = await dailyRecordModel.find({});
    // await setCheckinImagesIfExist(results);
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error. Could not fetch resources." });
  }
};

exports.getTodayDailyRecords = async (req, res) => {
  try {
    const results = await dailyRecordModel.find({
      date: {
        $gte: new Date().setUTCHours(0, 0, 0, 0),
      },
    });
    await setCheckinImagesIfExist(results);
    res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error. Could not fetch resources." });
  }
};

exports.removeDailyRecord = async (req, res) => {
  try {
    const result = await dailyRecordModel.deleteOne({
      _id: req.params.dailyRecordId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record removed successfully" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Bad Request: Invalid record ID" });
    } else {
      res
        .status(500)
        .json({ message: "Internal Server Error", details: error.message });
    }
  }
};

// Create "Work"
exports.addWork = async (req, res) => {
  try {
    const work = req.body;
    const newWork = await workModel.create(work)
    await logService({
      modifierId: req.cookies.employee_details.id,
      operation: "createWork",
      message: `Created new work ${newWork.name}`
    });
  } catch (error) {
    console.log(error);
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
        message: "Error occured while creating new work",
        details: error.message,
      })
    }
  }
}

// Read "Work"
exports.getWorks = async (req, res) => {
  try {
    const result = await workModel.find({})

    res.status(200).json(result)
  } catch (error) {
    console.log(`Error in getWorks service: ${error.message}`)
    res.status(500)
    .json({message: "Server error. Could not fetch resources."})
  }
}

// Delete Work
exports.deleteWorkById = async (req, res) => {
  try{
    const id = req.params.id;
    const work = await workModel.findOne({_id: id});
    if(work){
      await workModel.deleteOne({_id: id});
      res.status(200).json("Work Deleted successfully");
    }else{
      res.status(404).json("The requested work canot be found.");
    }
  }catch(error){
    console.log("Error in deleteWorkById function: ", error.message);
    res.status(500).json("Internal server error.");
  }
}

// Update Work
exports.updateWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Both name and description are required." });
    }
    const updatedWork = await workModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!updatedWork) {
      return res.status(404).json({ message: "Work not found." });
    }
    res.status(200).json({ message: "Work updated successfully.", work: updatedWork });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Read all Assigned Tasks
exports.getAssignedTasks = async (req, res) => {
  try{
    const response = await employeeModel.find({role: 'technician'}).select('assignedworks');
    res.status(200).json(response);
  }catch(error){
    console.warn("Error in AssignedTask service of superAdmin: ",error.message);
    res.status(500).json({message: "Internal server error"})
  }
}


const setCheckinImagesIfExist = async (results) => {
  const dailyRecords = await Promise.all(
    results.map(async (result) => {
      if (result.checkin) {
        const checkin = await Promise.all(
          result.checkin.map(async (entry) => {
            const imageData = await fs.readFile(entry.imageUrl);
            const ext = path.extname(entry.imageUrl);
            const mimeType = getMimeType(ext);
            const base64Image = Buffer.from(imageData).toString("base64");
            const obj = {
              image: `data:${mimeType};base64,${base64Image}`,
              location: entry.location,
              timestamp: entry.timestamp,
            };
            return obj;
          })
        );
        result.checkin = checkin;
      }
      return result;
    })
  );
  return dailyRecords;
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
