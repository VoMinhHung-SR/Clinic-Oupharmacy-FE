import { Box, Button, Fade } from "@mui/material";
import { useState } from "react";

const ExpandCloseComponent = (props) => {

    const content = props.expanded ? (
        <div>
            <Box className="ou-flex ou-justify-center !ou-items-center">
                {props.children}
                {props.disableButtonOff ? <></> : <Button onClick={props.toggleExpanded} className="!ou-ml-3" >{props.closeIcon ? props.closeIcon : "Close"}</Button> }
                
            </Box>

        </div>
      ) : (
          <Button onClick={props.toggleExpanded} >{props.openIcon ? props.openIcon : "Open"}</Button>
      );
    return (
        <div>
          {content}
        </div>
    );

}

export default ExpandCloseComponent