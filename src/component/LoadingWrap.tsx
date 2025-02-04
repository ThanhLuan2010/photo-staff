import React from "react";
import {Box,Backdrop,CircularProgress } from "@mui/material"
interface LoadinWrapProps {
  active: boolean;
  children: any;
}
const LoadingWrap: React.FC<LoadinWrapProps> = ({
  active,
  children,
}): React.JSX.Element => {
  return (
    <Box>
        {children}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={active}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};
export default LoadingWrap;
