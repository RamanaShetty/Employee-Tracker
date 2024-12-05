const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const generateUnique15DigitId = () => {
  const uuid = uuidv4();
  const hash = Math.abs(parseInt(uuid.replace(/-/g, "").slice(0, 15), 16));
  return hash.toString().slice(0, 15);
};

const directoryExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch {
    return false;
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
        req.generatedEmployeeId = generateUnique15DigitId();
      const parentDirectory = path.join(__dirname, "../uploads/employees");
      let employeeId = req.generatedEmployeeId;

      if (!(await directoryExists(parentDirectory))) {
        await fs.mkdir(parentDirectory, { recursive: true });
      }

      let uploadPath = path.join(parentDirectory, employeeId);

      while (await directoryExists(uploadPath)) {
        employeeId = generateUnique15DigitId();
        req.generatedEmployeeId = employeeId;
        uploadPath = path.join(parentDirectory, employeeId);
      }

      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, "");
    }
  },

  filename: (req, file, cb) => {
    try {
      const extension = path.extname(file.originalname);
      const fileName = `${req.generatedEmployeeId}${extension}`;
      req.filename = fileName;
      cb(null, fileName);
    } catch (error) {
      cb(error, "");
    }
  },
});

const uploadEmployee = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadEmployee;
