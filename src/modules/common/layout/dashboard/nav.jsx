import { styled, useTheme } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTranslation } from 'react-i18next';
import { ListItemIcon, ListItemButton, ListItemText, Toolbar,
    MenuItem, Tooltip, Button, Box, List, Menu, Avatar, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import FlagUK from '../../../../../public/flagUK';
import FlagVN from '../../../../../public/flagVN';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { changeLanguage } from "i18next";
import useNav from '../../../pages/HomeComponents/hooks/useNav';
import { ERROR_CLOUDINARY, ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE } from '../../../../lib/constants';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from '@mui/icons-material/Payment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import useCustomModal from '../../../../lib/hooks/useCustomModal';
import CustomModal from '../../components/Modal';
import FormChangePassword from '../../../pages/HomeComponents/FormChangePassword';
import useNotification from '../../../../lib/hooks/useNotification';
import NotificationButton from '../../components/button/Notification';
import PillsIcon from '../../../../lib/icon/PillsIcon';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return {
    backgroundColor: "white",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(!isMobile && open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    ...(isMobile && {
      width: '100%',
      marginLeft: 0,
    }),
  };
});

const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    color: 'white',
    backgroundColor: '#1976d2',
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const NavDashboard = ({ open, toggleDrawer }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState(null);
    const openSettingMenu = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const {isLoading, notifyListContent, updateNotifications} = useNotification();
    const location = useLocation()
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();

    const {t, i18n}= useTranslation(['common', 'modal']);

    const pages = [
        {
          id: 'dashboard',
          name:t('home'),
          icon: <HomeIcon  className='ou-text-white'/>,
          link: '/dashboard'
        },
        {  
          id: 'examinations',
          name:t('examinations'),
          icon: <AssignmentIcon className='ou-text-white'/>,
          link: '/dashboard/examinations'
        },
        {  
          id: 'doctor-schedules',
          name:t('doctor-schedules'),
          icon: <CalendarMonthIcon className='ou-text-white'/>,
          link: '/dashboard/doctor-schedules'
        },      
        {  
          id: 'waiting-room',
          name:t('waiting-room'),
          icon: <CalendarMonthIcon className='ou-text-white'/>,
          link: '/dashboard/waiting-room'
        }
      ];
    const page_ROLE_DOCTOR = [ 
        {  
          id: 'prescribing',
          name:t('prescribing'),
          icon: <MedicalServicesIcon className='ou-text-white'/>,
          link: '/dashboard/prescribing'
        }
    ]
    const pagesMedicineManagement = [
      {  
        id: 'categories',
        name:t('categories'),
        icon: <CategoryIcon className='ou-text-white'/>,
        link: '/dashboard/categories'
      },
      {  
        id: 'medicines',
        name:t('medicines'),
        icon: <PillsIcon className='ou-text-white'/>,
        link: '/dashboard/medicines'
      }
    ] 
    const page_ROLE_NURSE= [
      {  
        id: 'payments',
        name:t('payments'),
        icon: <PaymentIcon className='ou-text-white'/>,
        link: '/dashboard/payments'
      }
    ]
      
    const {user, handleLogout, handleChangingPage} = useNav();
    let btn = <>
        <ul className="ou-flex ou-items-center ou-text-[#070707]">
          <Link to="/login">
              <MenuItem style={{ "color": "inherit" }} >
                    <LoginIcon style={{ "marginRight": "5px" }} />{t('login')}
              </MenuItem>
            </Link>
        </ul>
    </>

    const handleNav = (role, link) => {
      if(role.includes(user.role))
        return handleChangingPage(link)
      handleChangingPage("/dashboard/forbidden")
    }

    const renderPage = (routingRole, role, isOpen, isMobile) => {
        return routingRole && routingRole.map(item => (
            <ListItemButton key={"dashboard"+item.name} onClick={() => handleNav(role, item.link)}
                sx={{ 
                    justifyContent: isOpen ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{ 
                        minWidth: 0,
                        mr: isOpen ? 3 : 'auto',
                        justifyContent: 'center',
                        color: 'inherit',
                    }}
                >
                  {item.icon && item.icon}
                </ListItemIcon>
                {isOpen && <ListItemText primary={`${item.name}`} sx={{ opacity: isOpen ? 1 : 0 }} />} 
            </ListItemButton>

        ))
    }
    const renderHeadingTitle = (path) => {
      if(path=== '/dashboard')
        return 'Dashboard'
      const parts = path.split('/dashboard/')
      if(path.length > 1){
        const wordsAfterDashboard = parts[1].split('/');
        const firstWord = wordsAfterDashboard.find(word => word !== '');
        return firstWord || null
      }
      return null
    }

    if (user){
        btn = <>
            <Menu anchorEl={anchorEl} id="account-menu" open={openSettingMenu} onClose={handleClose} onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 12,
                            width: 15,
                            height: 15,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Link to="/dashboard/profile" className="nav-link" style={{ "padding": "0px" }}>
                    <MenuItem style={{ "color": "#333" }}>
                        <AccountCircleIcon fontSize="small" />
                        <Typography marginLeft={2}>
                        {t("common:profile")}
                        </Typography>
                    </MenuItem>
                </Link>
                <Divider className="!ou-m-[0px]" />
                <MenuItem style={{ "color": "#333" }} className="!ou-py-2" onClick={handleOpenModal}>
                    <KeyIcon fontSize="small" />
                      <Typography marginLeft={2}>
                        {t("common:changePassword")}
                      </Typography>
                </MenuItem>
                <Divider className="!ou-m-[0px]"/>
                <MenuItem onClick={handleLogout} >
                    <Logout fontSize="small" />
                    <Typography marginLeft={2}>
                        {t('logout')}
                    </Typography>
                </MenuItem>
            </Menu>
            

            {/* Show nav menu */}
            <ul className="ou-flex ou-justify-center ou-items-center">

              <Link to="/dashboard/conversations" className="ou-pr-3 ou-text-[#333]">
                <Box>
                  <MailIcon sx={{fontSize:"24px"}} />    
                </Box>
              </Link>

              <Box className="hover:ou-cursor-pointer !ou-text-[#333]">
                <NotificationButton
                  length={notifyListContent && notifyListContent.filter(item => !item.is_commit).length}
                  isLoading={isLoading}
                  items={notifyListContent}
                  updateNotifications={updateNotifications}
                />                  
              </Box>

              <Tooltip followCursor title={t('openSettings')}>
                <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}>
                  <Avatar sx={{ width: 32, height: 32 }} 
                  className="ou-bg-cyan-50"
                  src={(user.avatar_path && user.avatar_path != ERROR_CLOUDINARY) ? user.avatar_path : "https://res.cloudinary.com/dl6artkyb/image/upload/v1666353307/OUPharmacy/logo_oupharmacy_kz2yzd.png"} 
                  alt={user.first_name + " " + user.last_name}/> 
                </IconButton>
              </Tooltip>
              
            </ul>
            
            {/* End nav menu */}
        </>
    }
    return (
      <>
        <AppBar position="fixed" open={open}>
            <Toolbar className="ou-flex ou-justify-between">
                <Box className="ou-flex ou-items-center">
                    <IconButton
                        edge="start"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: 2,
                            display: isMobile ? 'inline-flex' : (open ? 'none' : 'inline-flex'),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        noWrap
                        color='#707070'
                        sx={{ 
                            flexGrow: 1,
                            [theme.breakpoints.down('sm')]: {
                                fontSize: '1rem',
                            },
                        }}
                    >
                        {t(renderHeadingTitle(location.pathname))}
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 0 }} className="ou-flex ou-items-center ou-gap-2">
                    {i18n.language === 'en' ? 
                        <Tooltip followCursor title={t('changeLanguage')}>
                            <Button className="!ou-text-white" onClick={()=> changeLanguage('vi')}>
                                <FlagUK width={30} height={30}/>
                            </Button> 
                        </Tooltip>
                        :
                        <Tooltip followCursor title={t('changeLanguage')}>
                            <Button className="!ou-text-white" onClick={()=> changeLanguage('en')}>
                                <FlagVN width={30} height={30}/>
                            </Button>
                        </Tooltip>
                    }
                    {btn}
                </Box>
            </Toolbar>
        </AppBar>
        <StyledDrawer
            variant={isMobile ? 'temporary' : 'permanent'} 
            open={open} 
            onClose={isMobile ? toggleDrawer : undefined}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              ...(!isMobile && { 
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                  width: drawerWidth,
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
                  }),
                  overflowX: 'hidden',
                  boxSizing: 'border-box',
                  ...(!open && {
                    overflowX: 'hidden',
                    transition: theme.transitions.create('width', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.leavingScreen,
                    }),
                    width: theme.spacing(7),
                    [theme.breakpoints.up('sm')]: {
                      width: theme.spacing(9),
                    },
                  }),
                },
              }),
            }}
        > 
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    ... (isMobile && { display: 'none' })
                }}
            >
                <IconButton color="inherit" onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider sx={{ ...(isMobile && { display: 'none' }) }}/>

            {/* Nav */}
            <List component="nav" className="ou-overflow-y-auto">
                {renderPage(pages, ROLE_NURSE +" "+ ROLE_DOCTOR, open, isMobile)}
                <Divider sx={{ my: 1 }} />

                {renderPage(page_ROLE_DOCTOR, ROLE_DOCTOR, open, isMobile)}

                <Divider sx={{ my: 1 }} />
                {renderPage(page_ROLE_NURSE, ROLE_NURSE, open, isMobile)}

                <Divider sx={{ my: 1 }} />
                {renderPage(pagesMedicineManagement, ROLE_NURSE +" "+ ROLE_DOCTOR+" "+ ROLE_ADMIN, open, isMobile)}
            </List>

        </StyledDrawer>

        <CustomModal
          className="ou-w-[900px]"
          open={isOpen}
          onClose={handleCloseModal}
          content={<FormChangePassword callBack={handleCloseModal}/>}
        />
      </>
        
    )
}

export default NavDashboard