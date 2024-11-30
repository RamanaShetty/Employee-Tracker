import { Box, Button, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"
import { addButtonIconStyles, addButtonStyles, searchContainerStyles, searchInputStyles, tableBodyStyles, tableHeaderStyles, tableHeadStyles, tableStyles, tabsContainerStyles, topNavStyles } from "../styles/employeeStyles";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AddWorkModal from "../components/AddWorkModal";

interface Work {
    _id: String,
    name: String,
    description: String,
    site: String,
}

const Works = () => {
    const [ works, setWorks ] = useState<Work[]>([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ searchQuery, setSearchQuery ] = useState("");

    useEffect(()=>{
        fetchWorks("http://localhost:4200/work");
    },[])

    const fetchWorks = (endpoint: string) => {
        axios
            .get(endpoint)
            .then((response)=>{
                if(Array.isArray(response.data)){
                    const allWorks = response.data;
                    setWorks(allWorks);
                }else{
                    console.error("Expected an array but received: ", response.data)
                    setWorks([]);
                }
            })
            .catch((error)=>{
                console.error("Error fetching employees: ", error);
                setWorks([]);
            });
    }

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    }

    const filteredWorks = works.filter((work)=>work.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()));

    return (
        <Box>
            <Box sx={topNavStyles}>
                <Tabs
                    sx={{...tabsContainerStyles, visibility: "hidden" }}
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
                            onChange={(e)=>{setSearchQuery(e.target.value)}}
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
                            <TableCell sx={{ ...tableHeaderStyles }} >Site</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Description</TableCell>
                            <TableCell sx={{ ...tableHeaderStyles }} >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { filteredWorks.map((work, index)=>(
                            <TableRow key={index} >
                                <TableCell sx={{ ...tableBodyStyles, textAlign: "center"}} >{ index + 1 }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "700", color: "#101828"}} >{ work.name }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} >{ work.site }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} >{ work.description }</TableCell>
                                <TableCell sx={{ ...tableBodyStyles, fontWeight: "500", color: "#667085"}} ></TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </TableContainer>

            <AddWorkModal open={isModalOpen} handleClose={closeModal} />
        </Box>
    )
}

export default Works;