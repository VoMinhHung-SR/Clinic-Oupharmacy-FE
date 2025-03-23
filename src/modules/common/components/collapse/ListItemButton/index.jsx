import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import useCollapse from "../hooks/useCollapse";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Loading from "../../Loading";

const CustomCollapseListItemButton = ({title, content, loading, isOpen}) => {
    const {open, handleSetOpen} = useCollapse(isOpen)
    return(
        <>
            <ListItemButton onClick={handleSetOpen} disablePadding >
                <ListItemText primary={title? title: "Title"} disablePadding/>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                {loading ? <Box className="!ou-my-5"><Loading/></Box> 
                : <List component="div" disablePadding>
                <ListItemText sx={{ pl: 4 }}>
                    <ListItemText primary={content? content : "Content"} />
                </ListItemText>
                </List>
                
            }
                   
            </Collapse>
        </>
    )
}

export default CustomCollapseListItemButton;