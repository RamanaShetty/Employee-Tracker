import { Box, Button, Dialog, DialogTitle, MenuItem, styled, TextField } from "@mui/material";
import axios from "axios";
import React, { ChangeEvent, useEffect, useState } from "react";

interface AddWorkModalProps {
    open: boolean;
    handleClose: () => void;
}

interface WorkData {
    name: string,
    description: string,
    siteId: string,
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

const AddWorkModal: React.FC<AddWorkModalProps> = ({ open, handleClose }) => {
    const [ workData, setWorkData ] = useState<WorkData>({
        name: "",
        description: "",
        siteId: "",
    })
    const [ errors, setErrors ] = useState<Record<string, string>>({});
    const [ sites, setSites ] = useState<{ id: string, name: String }[]>([])

    useEffect(() => {
        fetchSites("http://localhost:4200/site");
      }, []);
    
      const fetchSites = (endpoint: string) => {
        axios
          .get(endpoint)
          .then((response) => {
            if (Array.isArray(response.data)) {
              const allSites = response.data
                .map((site: {_id: string; name: string}) => ({
                    id: site._id,
                    name: site.name,
                }))
              setSites(allSites);
            } else {
              console.error("Expected an array but received:", response.data);
              setSites([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching employees:", error);
            setSites([]);
          });
      };

      const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWorkData((prev)=>({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      };

      const validateWorkForm = () => {
        const newErrors: Record<string, string> = {};
        if(!workData.name.trim()) newErrors.name = "Work name is required";
        if(!workData.description.trim()) newErrors.description = "Work description is requried";
        if(!workData.siteId.trim()) newErrors.siteId = "Select a site";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      }

      const handleSubmit = () => {
        if (validateWorkForm()) {
          axios({
            method: "post",
            url: "http://localhost:4200/work",
            data: workData,
            headers: { "Content-Type": "application/json" },
          })
            .then(() => {
              alert("Work added successfully");
              window.location.reload();
            })
            .catch((err) => {
              console.error("Error adding work:", err);
            });
        }
      };
    return (
        <BlurredDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Box
                sx={{ padding: "24px", display: "flex", flexDirection: "column", rowGap: 2, }}
            >
                <DialogTitle sx={{ padding: 0, fontWeight: "600" }} >Add New Work</DialogTitle>
                <Box>
                <TextField
                    fullWidth
                    name="name"
                    label="Work Name"
                    autoComplete="off"
                    value={workData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ marginBottom: "15px" }}
                />
                <TextField
                  fullWidth
                  id="outlined-multiline-flexible"
                  label="Work Description"
                  multiline
                  minRows={1}
                  maxRows={4}
                  name="description"
                  value={workData.description}
                  onChange={handleInputChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  sx={{ marginBottom: "15px" }}
                />

                <TextField
                    fullWidth
                    name="siteId"
                    label="Site"
                    select
                    value={workData.siteId}
                    onChange={(e) => {
                      setWorkData((prev) => ({
                        ...prev,
                        siteId: e.target.value,
                      }));
                    }}
                    error={!!errors.siteId}
                    helperText={errors.siteId}
                    sx={{ marginBottom: "15px" }}
                >     
                    {sites.map((site) => (
                      <MenuItem key={site.id} value={site.id}>
                        {site.name}
                      </MenuItem>
                    ))}
                </TextField>
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
    )
}

export default AddWorkModal;