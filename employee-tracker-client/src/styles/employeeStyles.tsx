import "./imports.css";


export const tableStyles = {
  minWidth: 650,
};

export const tableHeaderStyles = {
  padding: "18px 16px",
  fontFamily: ["Inter", "sans-serif"].join(","),
  fontSize: "12px",
  fontWeight: "700",
  borderRight: "1px solid #ddd",
  borderLeft: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
  borderTop: "1px solid #f5f5f5",
  color: "#344054",
};
export const tableBodyStyles = {
  padding: "18px 16px",
  fontFamily: ["Inter", "sans-serif"].join(","),
  fontSize: "14px",
  alignItems: "center",
  borderLeft: "1px solid #ddd",
  borderRight: "1px solid #ddd",
  borderBottom: "1px solid #ddd",
  color: "#344054",
};

export const tableHeadStyles = {
  backgroundColor: "#f5f5f5",
};

export const topNavStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "15px",
  paddingBottom: "15px",
  backgroundColor: "#FDFDFD",
  // marginLeft: "10px"
  // borderBottom: "1px solid #ddd",
};

export const tabsContainerStyles = {
  display: "inline-flex",
  border: "1px solid #D0D5DD",
  borderRadius: "8px",
  overflow: "hidden",
};

export const tabStyles = {
  fontSize: "14px",
  fontWeight: "bold",
  minWidth: "auto",
  padding: "6px 14px",
  color: "#D0D5DD",
  textTransform: "none",
  "&.Mui-selected": {
    color: "#667085",
    backgroundColor: "#f4f6f8",
    fontWeight: "400",
  },
  "&:not(.Mui-selected)": {
    backgroundColor: "#fff",
    fontWeight: "300",
  },
  "&:not(:last-child)": {
    borderRight: "1px solid #D0D5DD",
  },
};

export const searchContainerStyles = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "4px 8px",
  backgroundColor: "#fff",
};

export const searchInputStyles = {
  flex: 1,
  fontSize: "14px",
  marginLeft: "8px",
  "&::placeholder": {
    color: "#999",
  },
};

export const addButtonStyles = {
  border: "1px solid #D0D5DD",
  borderRadius: "10px",
  padding: "6px 14px",
  color: "#344054",
  fontSize: "14px",
  fontWeight: "600",
  textTransform: "none",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
};

export const addButtonIconStyles = {
  marginRight: "3px",
  fontSize: "18px",
};
