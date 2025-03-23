import { CircularProgress } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";


const BackdropLoading = () => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoading ;
