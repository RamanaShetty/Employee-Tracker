import React from "react";
import { Card, Typography, Avatar, Box, IconButton } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { EditIcon } from "./Icons";
import DeleteBox from "./deleteConfirmationBox";

interface EmployeeCardProps {
  _id:string;
  name: string;
  phone: string;
  // site: string;
  avatarUrl: string;
  skill: string;
  email: string;
  onDelete: (id: string) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  _id,
  name,
  phone,
  // site,
  avatarUrl,
  skill,
  email,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleDelete = () => {
    onDelete(_id);
    handleClose();
  }

  return (
    <Card
      sx={{
        height: "210px",
        width: "400px",
        padding: 2,
        borderRadius: "12px",
        fontFamily: ["Inter", "sans-serif"].join(","),
        boxShadow: "0 2px 8px rgb(203 204 205 / 80%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: "40px",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "20px",
            paddingTop: "5px",
            fontFamily: "inherit",
            color: "#344054",
          }}
        >
          {name}
        </Typography>

        <Avatar
          src={avatarUrl || undefined}
          alt={name}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "200px",
            marginRight: 1,
            marginTop: "5px",
          }}
        >
          {!avatarUrl && name && name[0].toUpperCase()}
        </Avatar>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
        <PhoneIcon sx={{ color: "#6B7280", fontSize: 20, marginRight: 1 }} />
        <Typography
          variant="body1"
          sx={{ color: "#6B7280", fontFamily: "inherit" }}
        >
          {phone}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "12px" }}>
        <EmailOutlinedIcon
          sx={{ color: "#6B7280", fontSize: 20, marginRight: 1 }}
        />
        <Typography
          sx={{
            fontFamily: "inherit",
            color: "#6B7280",
          }}
        >
          {email}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          height: 48,
          marginTop: 5,
          flexDirection: "column",
        }}
      >
        {/* <Typography
          variant="subtitle2"
          sx={{
            color: "#6B7280",
            marginTop: 1,
            fontSize: "13px",
            fontFamily: "inherit",
          }}
        >
          Current Site
        </Typography> */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* <Typography
            variant="h6"
            sx={{
              color: "#026AA2",
              fontWeight: "500",
              fontSize: "20px",
              fontFamily: "inherit",
            }}
          >
            {site}
          </Typography> */}
          <Box
            sx={{
              minWidth: "16px",
              padding: "4px 16px",
              borderRadius: "8px",
              border: "1px solid #D6D6D6",
            }}
          >
            <Typography
              sx={{
                fontFamily: "inherit",
                fontSize: "16px",
                // fontWeight: "500",
                lineHeight: "25px",
                letterSpacing: "-0.03em",
                textAlign: "center",
                color: "#181e6599",
              }}
            >
              {skill}
            </Typography>
          </Box>
          <Box sx={{ float: "right" }}>
            <IconButton sx={{ padding: "5px" }}>
              <EditIcon />
            </IconButton>
            <>
              <IconButton sx={{ padding: "5px" }} onClick={handleOpen}>
                <DeleteOutlinedIcon />
              </IconButton>
              <DeleteBox open={isModalOpen} handleDelete={handleDelete} handleClose={handleClose} />
            </>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default EmployeeCard;
