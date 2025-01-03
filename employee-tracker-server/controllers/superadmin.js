const { Router } = require("express");
// const multer = require("multer");
const superAdminServices = require("../services/superadmin");
const adminServices = require("../services/admin");
const dailyRecordService = require("../services/update-daily-record");
const progressUpload = require("../middlewares/progress-uploads");
const router = Router({ strict: true });
const isAuth = require("../middlewares/isAuth");
const admins = ["siteAdmin", "superAdmin"];
const superAdmin = ["superAdmin"];
const uploadEmployee = require("../middlewares/employee-uploads");
const assignService = require("../services/assignServiceHandler");
const { route } = require("./employee");

// router.post("/login", superAdminServices.login);
router.post("/register", isAuth(superAdmin), superAdminServices.register);
router.get("/employee", /*isAuth(superAdmin)*/ adminServices.getEmployees);
router.post("/employee", uploadEmployee.single("image"), adminServices.postEmployees);
router.put("/employee/:id", adminServices.updateEmployeeDetails)
router.delete("/employee/:id",adminServices.deleteEmployee)
router.get(
  "/employee/role/:role",
  /*isAuth(admins) */ adminServices.getEmployeeByRole
);
router.get(
  "/employee/status/:status",
  /*isAuth(admins) */ adminServices.getEmployeeStatus
);
router.put(
  "/employee/delete/:employeeId",
  /*isAuth(admins) */ superAdminServices.removeEmployee
);
router.post("/site", /*isAuth(superAdmin)*/ superAdminServices.addSite);
router.get("/site", /*isAuth(superAdmin)*/ superAdminServices.getSites);
router.get("/site/id/:siteId",/*isAuth(admins) */ adminServices.getSiteBySiteId);
router.get(
  "/sites/admin/:employeeId",
  /*isAuth(admins) */ adminServices.getSitesBySiteAdminId
);
router.put(
  "/site/:siteId",
  /*isAuth(superAdmin)*/ superAdminServices.updateSiteBasicInfo
);
router.put(
  "/siteadmin/add/:siteId",
  /*isAuth(superAdmin)*/ superAdminServices.addSiteAdminsIntoSite
);
router.put(
  "/siteadmin/delete/:siteId",
  /*isAuth(superAdmin)*/ superAdminServices.deleteSiteAdminsIntoSite
);
router.delete(
  "/site/:siteId",
  /*isAuth(superAdmin)*/ superAdminServices.removeSite
);
router.post("/dailyrecord", /*isAuth(admins) */ adminServices.addDailyRecord);
router.get(
  "/dailyrecord/all",
  /*isAuth(superAdmin)*/ superAdminServices.getAllDailyRecords
);
router.get(
  "/dailyrecord/now",
  /*isAuth(superAdmin)*/ superAdminServices.getTodayDailyRecords
);
router.get(
  "/dailyrecord/lastassigned/:employeeId",
  /*isAuth(admins) */ adminServices.getLastAssignedWoryByEmployeeId
);
router.put(
  "/dailyrecord/:dailyrecordId",
  /*isAuth(admins) */ dailyRecordService.updateDailyRecord
);
router.delete(
  "/dailyrecord/:dailyRecordId",
  /*isAuth(superAdmin)*/ superAdminServices.removeDailyRecord
);
router.post(
  "/progressimage",
  /*isAuth(admins) */ progressUpload.array("photo", 12),
  adminServices.addProgressImage
);
router.get(
  "/progressimage/:siteId",
  /*isAuth(admins) */ adminServices.getProgressBySite
);
router.put(
  "/progressimage/:progressId",
  /*isAuth(admins) */ progressUpload.single("photo"),
  adminServices.updateProgressImage
);
router.delete(
  "/progressimage/:progressId",
  /*isAuth(admins) */ adminServices.deleteProgressImage
);
router.get("/log", /*isAuth(admins) */ adminServices.getAllLogs);
router.get(
  "/log/operation/:operation",
  /*isAuth(admins) */ adminServices.getLogsByOperation
);
router.get(
  "/log/modifier/:modifierId",
  /*isAuth(admins) */ adminServices.getLogsByModifierId
);
router.get("/log/date/:date", /*isAuth(admins) */ adminServices.getLogsByDate);


// "Work" routes
router.post("/work", /* isAuth(superAdmin) */ superAdminServices.addWork)
router.get("/work", /* isAuth(superAdmin) */ superAdminServices.getWorks)
router.delete("/work/:id", /* isAuth(superAdmin) */ superAdminServices.deleteWorkById);
router.patch("/work/:id", /* isAuth(superAdmin) */ superAdminServices.updateWork);
router.get('/assignedtasks', superAdminServices.getAssignedTasks);

// assign routes
router.post("/assignedworks/:employeeId", /* isAuth(superAdmin) */ assignService.assignSite);
router.get("/assignedworks/:employeeId", /* isAuth(superAdmin) */ assignService.getassignedtasksbyId);
router.delete("/assignedworks/:employeeId/:siteId", /* isAuth(superAdmin) */ assignService.unAssignSite);
router.put("/assignedworks/:employeeId/works", /* isAuth(superAdmin) */ assignService.updateAssignedWork);


module.exports = router;
