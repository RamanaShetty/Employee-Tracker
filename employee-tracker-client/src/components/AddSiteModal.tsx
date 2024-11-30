import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  styled,
} from "@mui/material";
import axios from "axios";

interface AddSiteModalProps {
  open: boolean;
  handleClose: () => void;
}

interface SiteData {
  name: string;
  siteAdmins: string;
  info: string;
  location: string;
}

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

const AddSiteModal: React.FC<AddSiteModalProps> = ({ open, handleClose }) => {
  const [siteData, setSiteData] = useState<SiteData>({
    name: "",
    siteAdmins: "",
    info: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [admins, setAdmins] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch the admins from the backend
    axios
      .get("http://localhost:4200/employee")
      .then((response) => {
        // Transform and filter the data
        const filteredAdmins = response.data
          .filter((employee: { role: string }) => employee.role === "siteAdmin")
          .map((admin: { _id: string; name: string }) => ({
            id: admin._id,
            name: admin.name,
          }));

        setAdmins(filteredAdmins);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!siteData.name.trim()) newErrors.name = "Site Name is required.";
    if (!siteData.siteAdmins.trim())
      newErrors.siteAdmins = "Site Admin is required.";
    if (!siteData.info.trim()) newErrors.info = "Site Info is required.";
    if (!siteData.location.trim())
      newErrors.location = "Site Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      axios({
        method: "post",
        url: "http://localhost:4200/site",
        data: siteData,
        headers: { "Content-Type": "application/json" },
      })
        .then(() => {
          alert("Site added successfully");
          window.location.reload();
        })
        .catch((err) => {
          console.error("Error adding site:", err);
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
        <DialogTitle sx={{ padding: 0, fontWeight: "600" }}>
          Add Site
        </DialogTitle>
        <Box>
          <TextField
            fullWidth
            name="name"
            label="Site Name"
            autoComplete="off"
            value={siteData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            name="siteAdmins"
            label="Site Admins"
            select
            value={siteData.siteAdmins} // Use the ID directly
            onChange={(e) => {
              setSiteData((prev) => ({
                ...prev,
                siteAdmins: e.target.value, // Store the selected ID
              }));
            }}
            error={!!errors.siteAdmins}
            helperText={errors.siteAdmins}
            sx={{ marginBottom: "15px" }}
          >
            {admins.map((admin) => (
              <MenuItem key={admin.id} value={admin.id}>
                {admin.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            name="info"
            label="Site Info"
            autoComplete="off"
            value={siteData.info}
            onChange={handleInputChange}
            error={!!errors.info}
            helperText={errors.info}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            fullWidth
            name="location"
            label="Site Location"
            autoComplete="off"
            value={siteData.location}
            onChange={handleInputChange}
            error={!!errors.location}
            helperText={errors.location}
          />
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

export default AddSiteModal;
