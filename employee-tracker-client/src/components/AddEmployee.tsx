import React, { useState, ChangeEvent, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  Box,
  // IconButton,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import { ProfileIcon } from "./Icons";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import imageCompression from "browser-image-compression";

interface AddEmployeeModalProps {
  open: boolean;
  handleClose: () => void;
}

interface EmployeeData {
  employeeName: string;
  skillName: string;
  mobileNumber: string;
  email: string;
  role: string;
  image: File | null;
}

// const VisuallyHiddenInput = styled("input")`
//   clip: rect(0 0 0 0);
//   clip-path: inset(50%);
//   height: 1px;
//   overflow: hidden;
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   white-space: nowrap;
//   width: 1px;
// `;

const ImagePreviewBox = styled(Box)`
  width: 165px;
  height: 165px;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const BlurredDialog = styled(Dialog)`
  & .MuiBackdrop-root {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
  }

  & .MuiDialog-paper {
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.08);
  }

  & .MuiInputBase-root {
    height: 44px;
  }

  & .MuiInputLabel-root {
    transform: translate(14px, 12px) scale(1);
    &.Mui-focused,
    &.MuiFormLabel-filled {
      transform: translate(14px, -9px) scale(0.75);
    }
  }
`;

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  handleClose,
}) => {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    employeeName: "",
    skillName: "",
    mobileNumber: "",
    email: "",
    role: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string>("");
  // const [base64, setBase64] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
// console.log(typeof(file));

      const options = {
        maxSizeMB: 0.2, // Compress the image to be below 200 KB
        maxWidthOrHeight: 800, // Resize to smaller dimensions
        useWebWorker: true,
      };

      try {
        const compressedBlob = await imageCompression(file, options);
  
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });

        setEmployeeData((prev) => ({
          ...prev,
          image: compressedFile,
        }));

        const preview = URL.createObjectURL(compressedFile);
    
        console.log("Original size (KB):", file.size / 1024);
        console.log("Compressed size (KB):", compressedFile.size / 1024);

        setPreviewUrl(preview);
        setErrors((prev) => ({ ...prev, image: "" }));
      } catch (err) {
        console.error("Error compressing image:", err);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { value } = event.target;

    setEmployeeData((prev) => ({
      ...prev,
      role: value,
    }));

    setErrors((prev) => ({ ...prev, role: "" }));
  };

  const resetFormAndErrors = () => {
    setPreviewUrl("");
    setErrors({});
    setEmployeeData({
      employeeName: "",
      skillName: "",
      mobileNumber: "",
      email: "",
      role: "",
      image: null,
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!employeeData.employeeName.trim())
      newErrors.employeeName = "Employee Name is required.";
    if (!employeeData.skillName.trim())
      newErrors.skillName = "Skill Name is required.";
    if (!/^\d+$/.test(employeeData.mobileNumber))
      newErrors.mobileNumber = "Mobile Number must contain only digits.";
    if (employeeData.mobileNumber.trim().length < 10)
      newErrors.mobileNumber = "Mobile Number must be at least 10 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeData.email.trim()))
      newErrors.email = "Invalid email address.";
    if (!employeeData.role.trim()) newErrors.role = "Role is required.";
    if (!previewUrl) newErrors.image = "Employee photo is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleReaderLoaded = (readerEvt: ProgressEvent<FileReader>) => {
  //   const base64String = readerEvt.target?.result as string;
  //   setBase64(base64String); // Directly set the Base64 string
  // };

  // const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     const file = e.target.files[0];

  //     // Compression options
  //     const options = {
  //       maxSizeMB: 0.2, // Compress the image to be below 200 KB
  //       maxWidthOrHeight: 800, // Resize to smaller dimensions
  //       useWebWorker: true,
  //     };

  //     try {
  //       const compressedFile = await imageCompression(file, options);
  //       const base64 = await imageCompression.getDataUrlFromFile(
  //         compressedFile
  //       );

  //       console.log("Original size (KB):", file.size / 1024);
  //       console.log("Compressed size (KB):", compressedFile.size / 1024);

  //       setBase64(base64);
  //       setPreviewUrl(URL.createObjectURL(compressedFile));
  //       setErrors((prev) => ({ ...prev, image: "" }));
  //     } catch (err) {
  //       console.error("Error compressing image:", err);
  //     }
  //   }
  // };

  const handleSubmit = () => {
    if (validateForm()) {
      const prepareFormData = (employeeData: EmployeeData) => {
        const formData = new FormData();

        (Object.keys(employeeData) as (keyof EmployeeData)[]).forEach((key) => {
          const value = employeeData[key];

          if (value !== undefined && value !== null && value !== "") {
              formData.append(key, value);
          }
        });
        return formData;
      };
      const formData = prepareFormData(employeeData);

      for(const i of formData){
        console.log(i)
        }

      axios({
        method: "post",
        url: "http://localhost:4200/employee",
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' },
      })
        .then(() => {
          alert("Success addition of employee");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <BlurredDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <Box
        sx={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          rowGap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle sx={{ padding: 0, fontWeight: "600" }}>
            Add Employee
          </DialogTitle>
          <CloseIcon
            onClick={() => {
              resetFormAndErrors();
              handleClose();
            }}
            sx={{ cursor: "pointer" }}
          />
        </Box>

        <Box sx={{ display: "flex", columnGap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              name="employeeName"
              label="Employee Name"
              autoComplete="off"
              value={employeeData.employeeName}
              onChange={handleInputChange}
              error={!!errors.employeeName}
              helperText={errors.employeeName}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              name="skillName"
              label="Skill Name"
              autoComplete="off"
              value={employeeData.skillName}
              onChange={handleInputChange}
              error={!!errors.skillName}
              helperText={errors.skillName}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              name="mobileNumber"
              label="Mobile Number"
              autoComplete="off"
              value={employeeData.mobileNumber}
              onChange={handleInputChange}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              sx={{ marginBottom: "15px" }}
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              autoComplete="off"
              value={employeeData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ marginBottom: "15px" }}
            />
            <FormControl fullWidth error={!!errors.role} variant="outlined">
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={employeeData.role}
                name="role"
                onChange={handleSelectChange}
                label="Role"
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="technician">Technician</MenuItem>
                <MenuItem value="superAdmin">Super Admin</MenuItem>
                <MenuItem value="siteAdmin">Site Admin</MenuItem>
              </Select>
              <FormHelperText>{errors.role}</FormHelperText>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #D0D5DD",
              borderRadius: "10px",
              height: "250px",
              minWidth: "160px",
            }}
          >
            <ImagePreviewBox>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <ProfileIcon />
                // <IconButton
                //   component="label"
                //   sx={{ width: "48px", height: "48px" }}
                // >
                //   {/* <CloudUploadIcon sx={{ width: "24px", height: "24px" }} />
                //    */}

                //   <VisuallyHiddenInput
                //     type="file"
                //     accept="image/*"
                //     onChange={handlePhotoUpload}
                //   />
                // </IconButton>
              )}
            </ImagePreviewBox>
            <Box sx={{ padding: "8px 8px", textAlign: "center" }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handlePhotoUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <Box
                sx={{
                  typography: "caption",
                  color: "#344054",
                  fontWeight: 500,
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
                onClick={triggerFileInput}
              >
                Upload photo
              </Box>
              <Box sx={{ typography: "caption", color: "#667085" }}>
                160 × 160 recommended
              </Box>
              {errors.image && (
                <Box
                  sx={{ color: "red", fontSize: "0.75rem", marginTop: "4px" }}
                >
                  {errors.image}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", columnGap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              resetFormAndErrors();
            }}
            sx={{
              width: "100%",
              color: "#344054",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              textTransform: "none",
              height: "40px",
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              width: "100%",
              textTransform: "none",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </BlurredDialog>
  );
};

export default AddEmployeeModal;
