import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Box, useTheme, useMediaQuery, Toolbar } from '@mui/material';
import Copyright from './footer';
import NavDashboard from './nav';

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open, setOpen] = useState(!isMobile);
  const toggleDrawer = () => {
      setOpen(!open);
  };

  const collapsedDrawerWidth = theme.spacing(9);

  return (
      <Box sx={{ display: 'flex' }}>
          
          <NavDashboard open={open} toggleDrawer={toggleDrawer}/>

            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
                
                marginLeft: isMobile ? 0 : (open ? 0 : `${collapsedDrawerWidth}px`),
                transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.sharp,
                  duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
                }),
              }}
              >
              <Toolbar />
              <Box sx={{ mb: 4 }} className='ou-px-4 ou-py-4'>
                  <Outlet />         
                  <Copyright sx={{ pt: 4 }} />
              </Box>
            </Box>
        </Box> 
  );
}