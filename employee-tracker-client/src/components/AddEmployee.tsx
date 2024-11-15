import React, { useState, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  styled,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface AddEmployeeModalProps {
  open: boolean;
  handleClose: () => void;
}

interface EmployeeData {
  name: string;
  skillName: string;
  mobileNumber: string;
  photo: File | null;
}

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const ImagePreviewBox = styled(Box)`
  width: 160px; // Increased width
  height: 160px; // Increased height
  border-radius: 8px;
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
    name: "",
    skillName: "",
    mobileNumber: "",
    photo: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const onSubmit = (employees: EmployeeData) => {
    console.log(employees);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEmployeeData((prev) => ({
        ...prev,
        photo: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit(employeeData);
    handleClose();
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DialogTitle sx={{ padding: 0, fontWeight: "600" }}>
            Add Employee
          </DialogTitle>
          <Box
            sx={{
              display: "flex",
              columnGap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                name="name"
                label="Employee Name"
                autoComplete="none"
                value={employeeData.name}
                onChange={handleInputChange}
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                fullWidth
                name="skillName"
                label="Skill Name"
                autoComplete="none"
                value={employeeData.skillName}
                onChange={handleInputChange}
                sx={{ marginBottom: "20px" }}
              />
              <TextField
                fullWidth
                name="mobileNumber"
                label="Mobile Number"
                autoComplete="none"
                value={employeeData.mobileNumber}
                onChange={handleInputChange}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <IconButton
                    component="label"
                    sx={{
                      width: "48px",
                      height: "48px",
                    }}
                  >
                    <CloudUploadIcon sx={{ width: "24px", height: "24px" }} />
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </IconButton>
                )}
              </ImagePreviewBox>
              <Box
                sx={{
                  padding: "8px 12px",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    typography: "caption",
                    color: "#344054",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  Upload photo
                </Box>
                <Box
                  sx={{
                    typography: "caption",
                    color: "#667085",
                  }}
                >
                  160 × 160 recommended
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", columnGap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              width: "100%",
              color: "#344054",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              textTransform: "none",
              height: "40px",
            }}
          >
            Cancel
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
