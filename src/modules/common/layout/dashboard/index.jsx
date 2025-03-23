
import { Outlet } from 'react-router';
import { Box } from '@mui/material';
import Copyright from './footer';
import NavDashboard from './nav';

export default function DashboardLayout() {

  return (
      <Box sx={{ display: 'flex' }}>
          
          <NavDashboard/>

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

              }}
              >
              <Box sx={{ mt: 8, mb: 4 }} className='ou-px-4 ou-py-4 ou-flex ou-justify-center ou-flex-col'>
                  <Outlet />         
                  <Copyright sx={{ pt: 4 }} />
              </Box>
            </Box>
        </Box> 
  );
}