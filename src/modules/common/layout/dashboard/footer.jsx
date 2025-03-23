import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://github.com/VoMinhHung-SR/OUPharmacy">
          OUPharmacy
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }