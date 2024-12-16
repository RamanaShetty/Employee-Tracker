const express = require("express");
const Site = require("../models/site");
const Work = require("../models/work");
const mongoose = require("mongoose");
const employeeModel = require("../models/employee");


//CREATE: Add a new site to assignedworks with empty works
exports.assignSite = async (req, res) => {
  const { employeeId } = req.params;
  const { siteId } = req.body;

  try {
    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ error: "Site not found" });

    const employee = await employeeModel.findOneAndUpdate(
      { _id: employeeId },
      { $push: { assignedworks: { siteId, works: [] } } },
      { new: true }
    ).populate("assignedworks.siteId");

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.status(201).json(employee.assignedworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//READ: Get all assignedworks of an employee, populated with site and work details
exports.getassignedtasksbyId = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await employeeModel.findOne({ _id: employeeId })
      .populate({
        path: "assignedworks.siteId",
        select: "_id name location info",
      })
      .populate({
        path: "assignedworks.works.id",
        select: "_id name description",
      });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.status(200).json(employee.assignedworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE: Delete one site from assignedworks
exports.unAssignSite = async (req, res) => {
  const { employeeId, siteId } = req.params;

  try {
    const employee = await employeeModel.findOneAndUpdate(
      { _id: employeeId },
      { $pull: { assignedworks: { siteId } } },
      { new: true }
    );

    if (!employee) return res.status(404).json({ error: "Employee or Site not found" });

    res.status(200).json({ message: "Site removed from assignedworks", assignedworks: employee.assignedworks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  PUT: Add or delete a work in a specific site in assignedworks
exports.updateAssignedWork = async (req, res) => {
  const { employeeId } = req.params;
  const { workId, action, date, siteId } = req.body;
  try {
    const employee = await employeeModel.findOne({ _id: employeeId });

    if (!employee) {console.log("Site not found");return res.status(404).json({ error: "Employee not found" });}

    const siteIndex = employee.assignedworks.findIndex((aw) => {return aw.siteId.toString() === siteId});
    if (siteIndex === -1) {console.log("Site not found");return res.status(404).json({ error: "Site not found in assignedworks" });}

    if (action === "add") {
      const work = await Work.findById(workId);
      if (!work) { console.log("Work not Found");return res.status(404).json({ error: "Work not found" })};
      employee.assignedworks[siteIndex].works.push({ id: workId, assignDate: date });
    }
    else if (action === "delete") {
      employee.assignedworks[siteIndex].works = employee.assignedworks[siteIndex].works.filter(
        (work) => work.id.toString() !== workId
      );
    } else {
      console.log("Invalid Action");
      return res.status(400).json({ error: "Invalid action" });
    }

    await employee.save();

    const updatedEmployee = await employeeModel.findOne({ _id: employeeId })
      .populate({
        path: `assignedworks.siteId`,
        select: "_id name location info",
      })
      .populate({
        path: `assignedworks.works.id`,
        select: "_id name description",
      });

    res.status(200).json(updatedEmployee.assignedworks);
  } catch (error) {
    console.warn("Error in assignServiceHandler: ",error.message);
    res.status(500).json({ error: error.message });
  }
};