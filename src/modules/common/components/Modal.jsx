import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import clsx from "clsx"

const CustomModal = (props) => {
    const {title, content, open, onClose, actions, 
        isClosingDropOutside = true, className} = props

    const handleDialogClose = (event, reason) => {
        if (!isClosingDropOutside && reason === 'backdropClick') {
            return; 
        }
        if (onClose) {
            onClose(event, reason); 
        }
    };  
    return (
        <Dialog 
          maxWidth={"md"}
          open={open}
          sx={{
            '& .MuiDialog-paper': {
              width: {
                xs: '95%',      
                sm: '80%',      
                md: '70%',      
                lg: '60%',      
                xl: '50%'       
              },
              maxWidth: {
                xs: '400px',    
                sm: '600px',    
                md: '800px',    
                lg: '1000px',   
                xl: '1200px'   
              }
            }
          }}
          onClose={handleDialogClose}>
            <DialogTitle className={clsx('',className)}>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>{actions}</DialogActions>
        </Dialog>
    )

}
export default CustomModal