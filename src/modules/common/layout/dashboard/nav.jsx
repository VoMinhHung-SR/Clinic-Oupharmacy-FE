import { useTheme } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTranslation } from 'react-i18next';
import { ListItemIcon, ListItemButton, ListItemText, Toolbar,
    MenuItem, Tooltip, Button, Box, List, Menu, Avatar, useMediaQuery, 
    Paper,
    Badge} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import FlagUK from '../../../../../public/flagUK';
import FlagVN from '../../../../../public/flagVN';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { changeLanguage } from "i18next";
import { AVATAR_DEFAULT, ERROR_CLOUDINARY, ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE } from '../../../../lib/constants';
import { isBusinessAdmin, isRoleIn } from '../../../../lib/auth';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useContext, useState } from "react";
import MailIcon from '@mui/icons-material/Mail';
import HomeIcon from '@mui/icons-material/Home';
import KeyIcon from '@mui/icons-material/Key';
import useCustomModal from '../../../../lib/hooks/useCustomModal';
import CustomModal from '../../components/Modal';
import FormChangePassword from '../../../pages/HomeComponents/FormChangePassword';
import useNotification from '../../../../lib/hooks/useNotification';
import NotificationButton from '../../components/button/Notification';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import UserContext from '../../../../lib/context/UserContext';
import useCustomNavigate from '../../../../lib/hooks/useCustomNavigate';
import WarningIcon from '@mui/icons-material/Warning';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PaymentIcon from '@mui/icons-material/Payment';
import CategoryIcon from '@mui/icons-material/Category';
import { isDashboardNavItemActive } from './styleTokens';

const drawerWidth = 240;

const AppBar = muiStyled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return {
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

const StyledDrawer = muiStyled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    color: theme.palette.primary.contrastText,
    background: `linear-gradient(180deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
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

  const page_DASHBOARD_HOME = [
    {
      id: 'dashboard',
      name: t('home'),
      icon: <HomeIcon className='ou-text-white'/>,
      link: '/dashboard'
    },
  ];
  const page_CLINIC_SHARED = [
    {  
      id: 'examinations',
      name: t('examinations'),
      icon: <AssignmentIcon className='ou-text-white'/>,
      link: '/dashboard/examinations'
    },
    {  
      id: 'doctor-schedules',
      name: t('doctor-schedules'),
      icon: <CalendarMonthIcon className='ou-text-white'/>,
      link: '/dashboard/doctor-schedules'
    },      
    {  
      id: 'waiting-room',
      name: t('waiting-room'),
      icon: <GroupsIcon className='ou-text-white'/>,
      link: '/dashboard/waiting-room'
    }
  ];
  const page_ROLE_DOCTOR = [
    {
        id: 'prescribing',
        name: t('prescribing'),
        icon: <MedicalServicesIcon className='ou-text-white'/>,
        link: '/dashboard/prescribing'
    }
  ];
  const page_ROLE_NURSE=  [
    {
        id: 'payments',
        name: t('payments'),
        icon: <PaymentIcon className='ou-text-white'/>,
        link: '/dashboard/prescribing'
    }
  ];
  const page_BUSINESS_ADMIN = [
    {
      id: 'categories',
      name: t('categories'),
      icon: <CategoryIcon className='ou-text-white'/>,
      link: '/dashboard/categories'
    }
  ];
    
  const { user, handleLogout, hasValidUserAddress, defaultAddress } = useContext(UserContext);
  const { navigate } = useCustomNavigate();
  let btn = <>
      <ul className="ou-flex ou-items-center ou-text-[#070707]">
        <Link to="/login">
            <MenuItem style={{ "color": "inherit" }} >
                  <LoginIcon style={{ "marginRight": "5px" }} />{t('login')}
            </MenuItem>
          </Link>
      </ul>
  </>
  let badgeContent = <></>

  const handleNav = (allowedRoles, link) => {
    if (allowedRoles == null) {
      if (isBusinessAdmin(user)) return navigate(link);
      return navigate("/dashboard/forbidden");
    }
    if (isRoleIn(user, allowedRoles)) return navigate(link);
    navigate("/dashboard/forbidden");
  };

  const renderPage = (routingRole, allowedRoles, isOpen) => {
      return routingRole && routingRole.map(item => {
        const active = isDashboardNavItemActive(location.pathname, item, user)
        const button = (
          <ListItemButton
            key={"dashboard"+item.name}
            selected={active}
            onClick={() => handleNav(allowedRoles, item.link)}
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
        )

        return !isOpen ? (
          <Tooltip key={"tooltip-" + item.id} title={item.name} placement="right">
            {button}
          </Tooltip>
        ) : (
          button
        )
      })
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

    badgeContent = !hasValidUserAddress ?
      <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title={t('common:warningMisInformation')}>
              <span>
                <WarningIcon fontSize='small' color='warning'/>  
              </span>
            </Tooltip>
          }>
          <Avatar alt={user.first_name + " " + user.last_name} sx={{ width: 36, height: 36 }}
            src={ user.avatar_path && user.avatar_path != ERROR_CLOUDINARY ? user.avatar_path : AVATAR_DEFAULT}
            className='ou-border-2 ou-border-[#1D4ED8] ou-rounded-full' />
        </Badge>
      : <Avatar alt={user.first_name + " " + user.last_name} sx={{ width: 36, height: 36 }}
        src={ user.avatar_path && user.avatar_path != ERROR_CLOUDINARY ? user.avatar_path : AVATAR_DEFAULT}
        className='ou-border-2 ou-border-[#1D4ED8] ou-rounded-full' />

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
            <Link to="/dashboard/profile">
              <Box component={Paper} elevation={4} className="ou-px-2 ou-py-3 ou-mx-2 ou-mb-3"> 
                <Box className="ou-flex ou-items-center">
                  <Box className="ou-ml-2" >{badgeContent}</Box>
                  <Typography>
                    | {user.first_name + " " + user.last_name}
                  </Typography>
                </Box>
              </Box>
            </Link>
            <Divider className="!ou-m-[0px]" />
              <MenuItem className="!ou-py-2" onClick={() => navigate("/dashboard/profile")}>
                  <AccountCircleIcon fontSize="small" />
                  <Typography marginLeft={2}>
                  {t("common:profile")}
                  </Typography>
              </MenuItem>
            <Divider className="!ou-m-[0px]" />
            <MenuItem className="!ou-py-2" onClick={handleOpenModal}>
                <KeyIcon fontSize="small" />
                  <Typography marginLeft={2}>
                    {t("common:changePassword")}
                  </Typography>
            </MenuItem>
            <Divider className="!ou-m-[0px]"/>
            <MenuItem onClick={handleLogout} className="!ou-text-red-500 !ou-py-2" >
                <Logout fontSize="small" />
                <Typography marginLeft={2}>
                    {t('logout')}
                </Typography>
            </MenuItem>
        </Menu>
        

        {/* Show nav menu */}
        <ul className="ou-flex ou-justify-center ou-items-center">
          <Tooltip followCursor title={t('conversations')}>
            <Box className="ou-mx-2 ou-text-[#333] hover:ou-cursor-pointer" onClick={() => navigate("/dashboard/conversations")}>
                <MailIcon sx={{fontSize:"24px"}} />    
            </Box>
          </Tooltip>
          <Tooltip followCursor title={t('notifications')}>
            <Box className="hover:ou-cursor-pointer ou-text-[#333] ou-mx-2">
            <NotificationButton
              length={notifyListContent && notifyListContent.filter(item => !item.is_commit).length}
              isLoading={isLoading}
              items={notifyListContent}
              updateNotifications={updateNotifications}
            />                  
          </Box>
          </Tooltip>

          <Tooltip followCursor title={t('openSettings')}>
            
            <IconButton onClick={handleClick} size="medium">
                {badgeContent} 
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
                      variant="subtitle1"
                      noWrap
                      color="text.primary"
                      fontWeight={600}
                      sx={{
                          flexGrow: 1,
                          [theme.breakpoints.down('sm')]: {
                              fontSize: '0.95rem',
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
              {renderPage(page_DASHBOARD_HOME, [ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE], open)}
              {isRoleIn(user, [ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN]) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  {renderPage(page_CLINIC_SHARED, [ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN], open)}
                </>
              )}
              {isRoleIn(user, [ROLE_DOCTOR, ROLE_ADMIN]) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  {renderPage(page_ROLE_DOCTOR, [ROLE_DOCTOR, ROLE_ADMIN], open)}
                </>
              )}
              {isRoleIn(user, [ROLE_NURSE, ROLE_ADMIN]) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  {renderPage(page_ROLE_NURSE, [ROLE_NURSE, ROLE_ADMIN], open)}
                </>
              )}
              {isBusinessAdmin(user) && (
                <>
                  <Divider sx={{ my: 1 }} />
                  {renderPage(page_BUSINESS_ADMIN, [ROLE_ADMIN], open)}
                </>
              )}
          </List>

      </StyledDrawer>

      <CustomModal
        open={isOpen}
        onClose={handleCloseModal}
        title={t("common:changePassword")}
        content={<FormChangePassword callBack={handleCloseModal}/>}
      />
    </>
      
  )
}

export default NavDashboard