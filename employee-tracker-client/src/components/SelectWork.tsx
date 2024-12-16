import { Box, Button, Checkbox, ListItemText, Menu, MenuItem, Select } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import WorkCheckList from "./WorkCheckList";


interface Work {
  id: {_id: string;
  name: string;
  description: string;
  }
}

interface Site {
  _id: string;
  name: string;
}

interface AssignedWork {
  siteId: Site;
  works: Work[];
}


const SelectWork: React.FC<{ employee_id: string, assignedTasks: AssignedWork[], fetchEmployees: () => void }> = ({ employee_id, assignedTasks, fetchEmployees }) => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    fetchEmployees();
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
  };

  const handleSubMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    site: Site,
  ) => {
    event.stopPropagation();
    setSubMenuAnchorEl(event.currentTarget);
    setSelectedSite(site);
  };

  const handleSubMenuClose = () => {
    setSelectedSite(null);
    setSubMenuAnchorEl(null);
  };


  
  



  return (
    <div>
      <Button variant="text" onClick={handleOpenMenu} sx={{ color: "black", textDecoration: "none" }}>
        Assign Work {(anchorEl) ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {assignedTasks.length > 0 && assignedTasks.map((site) => (
          <MenuItem
            key={site.siteId._id}
            onMouseEnter={(event) => { console.log(site); event.stopPropagation(); handleSubMenuOpen(event, site.siteId) }}
            onMouseLeave={handleSubMenuClose}
          >
            {site.siteId.name}
            <ArrowRightIcon />
            <Menu
              anchorEl={subMenuAnchorEl}
              open={selectedSite?._id === site.siteId._id}
              onClose={handleSubMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <WorkCheckList worksSelected={site.works.map((work)=>work.id._id)} employee_id={employee_id} siteId={site.siteId._id} key={site.siteId._id}/>
              {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
                {works && works.map((work) => (
                  <Box key={work._id} sx={{ padding: "5px", display: "flex", justifyContent: "left", alignItems: "center", width: "100%" }}>
                    <Checkbox
                      // type="checkbox"
                      id={work._id}
                      value={work._id}
                      name={work.name}
                      checked={selectedWorks.includes(work._id)}
                      onChange={(e) => { manageWorkAssignment(e, work._id) }}
                    />
                    <label htmlFor={work._id}>{work.name}</label>
                  </Box>
                ))}
              </Box> */}
            </Menu>
          </MenuItem>
        ))}{assignedTasks.length === 0 && <MenuItem>No Site Assigned</MenuItem>}
      </Menu>
    </div>
  );
}

export default SelectWork;