import { Box, Button, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"
import { addButtonIconStyles, addButtonStyles, searchContainerStyles, searchInputStyles, tableBodyStyles, tableHeaderStyles, tableHeadStyles, tableStyles, tabsContainerStyles, topNavStyles } from "../styles/employeeStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddWorkModal from "../components/AddWorkModal";
import DeleteIcon from '@mui/icons-material/Delete';

interface Work {
    _id: string,
    name: string,
    description: string,
}

const Works = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [workNameInput, setworkNameInput] = useState<string>("");
    const [workDescriptionInput, setworkDescriptionInput] = useState<string>("");
    const [editableWork, setEditableWork] = useState<string | null>(null);

    useEffect(() => {
        fetchWorks();
    }, [])

    const fetchWorks = () => {
        axios
            .get("http://localhost:4200/work")
            .then((response) => {
                if (Array.isArray(response.data)) {
                    const allWorks = response.data;
                    setWorks(allWorks);
                } else {
                    console.error("Expected an array but received: ", response.data)
                    setWorks([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching employees: ", error);
                setWorks([]);
            });
    }

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        fetchWorks();
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`http://localhost:4200/work/${id}`, { withCredentials: true });
            fetchWorks();
            console.log("deleted successfully")
        } catch (error: any) {
            console.log("Error while deleting: ", error.message);
        }
    }

    const handlePatch = async () => {
        try {
            if (editableWork && workNameInput && workDescriptionInput) {
                await axios({
                    method: "patch",
                    url: `http://localhost:4200/work/${editableWork}`,
                    data: { name: workNameInput, description: workDescriptionInput }
                })
                cancelEdit();
                fetchWorks();
            } else {
                console.log("Please type name and description correctly");
            }
        } catch (error: any) {
            console.log("Error updating work: ", error.message);
        }
    }

    const makeEditable = (id: string, name: string, description: string) => {
        setworkNameInput(name);
        setworkDescriptionInput(description);
        setEditableWork(id);
    }

    const cancelEdit = () => {
        setEditableWork(null);
        setworkNameInput("");
        setworkDescriptionInput("");
    }

    const filteredWorks = works.filter((work) => work.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

    return (
        <Box>
            <Box sx={topNavStyles}>
                <Tabs
                    sx={{ ...tabsContainerStyles, visibility: "hidden" }}
                    TabIndicatorProps={{
                        style: {
                            display: "none",
                        }
                    }}
                >
                </Tabs>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        onClick={openModal}
                        sx={addButtonStyles}
                        startIcon={<AddIcon sx={addButtonIconStyles} />}
                    >Work</Button>
                    <Box sx={searchContainerStyles} >
                        <InputBase
                            placeholder="Search by work name."
                            sx={searchInputStyles}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value) }}
                        />
                        <SearchIcon />
                    </Box>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={tableStyles} >
                    <TableHead sx={tableHeadStyles} >
                        <TableRow>
                            <TableCell sx={{ ...tableHeaderStyles, textAlign: "center" }} >S NO</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Work Name</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Description</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredWorks.map((work, index) => (
                            <TableRow key={index} >
                                <TableCell sx={{ ...tableBodyStyles, textAlign: "center"}} >{index + 1}</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "700", color: "#101828"}} >
                                    {(editableWork && editableWork == work._id) ?
                                        <TextField
                                            fullWidth
                                            name="name"
                                            label="Work Name"
                                            autoComplete="off"
                                            value={workNameInput}
                                            onChange={(e) => { setworkNameInput(e.target.value) }}
                                            sx={{ marginBottom: "15px" }}
                                        />
                                        :
                                        work.name
                                    }
                                </TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} >
                                    {(editableWork && editableWork == work._id) ?
                                        <TextField
                                            fullWidth
                                            id="outlined-multiline-flexible"
                                            label="Work Description"
                                            multiline
                                            minRows={1}
                                            maxRows={4}
                                            name="description"
                                            value={workDescriptionInput}
                                            onChange={(e) => { setworkDescriptionInput(e.target.value) }}
                                            sx={{ marginBottom: "15px" }}
                                        />
                                        :
                                        work.description
                                    }
                                </TableCell>
                                <TableCell
                                    sx={{
                                        ...tableBodyStyles,
                                        textAlign: "center",
                                        cursor: "pointer",
                                    }}
                                >
                                    {editableWork !== work._id &&
                                        <Box sx={{display: "flex", gap:"10px", justifyContent: "center", alignItems: "center"}}>
                                            <div onClick={() => { handleDelete(work._id) }}><DeleteIcon sx={{color:"#ff7066"}}/></div>
                                            <div onClick={() => { makeEditable(work._id, work.name, work.description) }}><svg xmlns="http://www.w3.org/2000/svg" fill="#007bff" id="Outline" viewBox="0 0 24 24" width="18" height="18"><path d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z" /><path d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z" /></svg></div>
                                        </Box>}
                                    {editableWork && editableWork === work._id &&
                                        <Box sx={{display: "flex", gap:"10px", justifyContent: "center", alignItems: "center"}}>
                                            <Button variant="contained" color="error" onClick={cancelEdit}>Cancel</Button>
                                            <Button variant="contained" onClick={handlePatch}>Save</Button>
                                        </Box>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddWorkModal open={isModalOpen} handleClose={closeModal} />
        </Box>
    )
}

export default Works;