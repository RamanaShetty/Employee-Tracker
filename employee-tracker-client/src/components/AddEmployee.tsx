import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import '../styles/AddEmployee.css';

interface ServerModalProps {
    open: boolean;
    handleClose: () => void;
}

const ServerModal: React.FC<ServerModalProps> = ({ open, handleClose }) => {
    const [employeeName, setEmployeeName] = useState<string>('');
    const [skillName, setSkillName] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('technician');
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);

    // Handle image file input and convert to base64
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission and send data to backend
    const handleAddEmployee = async () => {
        // Validate inputs
        if (!employeeName || !skillName || !mobileNumber || !email || !role) {
            alert('Please fill in all fields.');
            return;
        }

        // Create the form data object to send (with employee details and image)
        const formData = new FormData();
        formData.append('employeeName', employeeName);
        formData.append('email', email);
        formData.append('mobileNumber', mobileNumber);
        formData.append('role', role);
        formData.append('skillName', skillName);
        if (image) {
            formData.append('image', image as string); // Assuming `image` is a base64 string
        }

        try {

            const response = await fetch('http://localhost:4200/employee', {
                method: 'POST',
                body: formData, // Sends the form data (including the image)
            });

            // Handle response
            if (!response.ok) {
                throw new Error('Failed to add employee');
            }

            const result = await response.json();
            console.log('Employee added successfully:', result);

            // Reset the form
            setEmployeeName('');
            setSkillName('');
            setMobileNumber('');
            setEmail('');
            setRole('technician');
            setImage(null);

            // Close the modal
            handleClose();
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Error adding employee. Please try again.');
        }
    };

    return (
        <Modal
            className='add-employee-modal'
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div className='modal-content'>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Add Employee
                    </Typography>
                    <div className='add-employee-form'>
                        <div className='add-employee-formData'>
                            <TextField
                                label="Employee Name"
                                fullWidth
                                margin="normal"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                            />
                            <TextField
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Skill Name"
                                fullWidth
                                margin="normal"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                            />
                            <TextField
                                label="Mobile Number"
                                fullWidth
                                margin="normal"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                            <FormControl fullWidth margin="normal">
                                
                                <Select
                                    labelId="role-label"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <MenuItem value="technician">Technician</MenuItem>
                                    <MenuItem value="siteAdmin">Site Admin</MenuItem>
                                    <MenuItem value="superAdmin">Super Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='add-employee-profile'>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                                <Avatar
                                    alt="Profile Picture"
                                    src={image as string}
                                    sx={{ width: 128, height: 128, marginRight: 2 }}
                                />
                                <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="photo-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    <Button variant="outlined" component="span">
                                        Upload Photo
                                    </Button>
                                    <Typography variant="caption" color="textSecondary">
                                        128 × 128 recommended
                                    </Typography>
                                </label>
                            </Box>
                        </div>
                    </div>
                    <div className='add-employee-actions'>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                            <Button variant="outlined" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" onClick={handleAddEmployee}>
                                Add
                            </Button>
                        </Box>
                    </div>
                </Box>
            </div>
        </Modal>
    );
};

export default ServerModal;
