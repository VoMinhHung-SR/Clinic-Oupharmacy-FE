import { AppBar, Avatar, Badge, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Toolbar, Tooltip, Typography } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import { Link } from "react-router-dom"
import { useState } from "react";
import Logo from "../../../../../public/logo";
import useNav from "../../../pages/HomeComponents/hooks/useNav";
import MailIcon from '@mui/icons-material/Mail';
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlagUK from "../../../../../public/flagUK";
import FlagVN from "../../../../../public/flagVN";
import { ERROR_CLOUDINARY, ROLE_DOCTOR, ROLE_NURSE } from "../../../../lib/constants";
import useNotification from "../../../../lib/hooks/useNotification";
import NotificationButton from "../../components/button/Notification";
import CustomModal from "../../components/Modal";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import KeyIcon from '@mui/icons-material/Key';
import FormChangePassword from "../../../pages/HomeComponents/FormChangePassword";
const Nav = () => {
  
  const { t, i18n } = useTranslation(['common', 'modal']);
  // Page nav 
  const pages = [
    {
      id: 'booking',
      name:t('booking'),
      link: '/booking'
    },
    {
      id: 'waiting-room',
      name: t('waitingRoom'),
      link: '/waiting-room'
    }
  ];
  // State trigger menu open
  const {isLoading, notifyListContent, updateNotifications} = useNotification();
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
 
  //  Hooks useNav
  const {user, handleLogout} = useNav();
  let btn = <>
      <ul className="ou-flex ou-text-white ou-items-center">
        <Link to="/login">
            <MenuItem style={{ "color": "inherit" }} >
                  <LoginIcon style={{ "marginRight": "5px" }} />{t('login')}
            </MenuItem>
          </Link>
      </ul>
  </>

  if (user){
    btn = <>
        <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={handleClose}
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
            <Link to="/profile" className="nav-link" style={{ "padding": "0px" }}>
              <Box component={Paper} elevation={4} className="ou-px-2 ou-py-3 ou-mx-2 ou-mb-3"> 
                <Box className="ou-flex ou-items-center">
                  <Avatar alt={user.first_name + " " + user.last_name} src={user.avatar_path} className="!ou-ml-2"/>
                  <Typography>
                    | {user.first_name + " " + user.last_name}
                  </Typography>
                </Box>
              </Box>
            </Link>
            <Divider className="!ou-m-[0px]" />
            <Link to="/profile" className="nav-link" style={{ "padding": "0px" }}>
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
          <Link to="/conversations" className="ou-pr-3">
            <Box>
              <MailIcon color="#f3f3f3" sx={{fontSize:"24px"}} />    
            </Box>
          </Link>
          <Box className="hover:ou-cursor-pointer">
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

  const renderElementNav = (pageID, pageLink, pageName, isMobile = false, keyPage) => {
    // Render for doctor
      if(pageID === 'prescribing'|| pageID === 'prescribing-mb')
        if(user && user.role === ROLE_DOCTOR)
          return(
            <Link to={pageLink} key={keyPage}>
              <Button 
                
                onClick={handleCloseNavMenu}
                className={clsx('',{
                  '!ou-text-black': isMobile,
                  "!ou-text-white": !isMobile})
                }
                sx={{mx: 1, my: 1, display: 'block' }}
                
              >
                {pageName}
              </Button>
              </Link>
          )
        else return 
      if(pageID === 'examinations' || pageID === 'examinations-mb')
        if(user && (user.role === ROLE_DOCTOR || user.role === ROLE_NURSE))
          return(
            <Link to={pageLink} key={keyPage}>
              <Button 
                onClick={handleCloseNavMenu}
                sx={{ mx: 1, my: 1, display: 'block' }}
                className={clsx('',{
                  '!ou-text-black': isMobile,
                  "!ou-text-white": !isMobile})
                }
              >
                {pageName}
              </Button>
              </Link>
          )  
        else return
      // Render Default
      return (
        <Link to={pageLink}  key={keyPage}>
          <Button 
            onClick={handleCloseNavMenu}
            sx={{  mx: 1, my: 1, display: 'block' }}
            className={clsx('',{
              '!ou-text-black': isMobile,
              "!ou-text-white": !isMobile})
            }
          >
            {pageName}
          </Button>
          </Link>
      )
  }
  return (
    <AppBar position="fixed" className="!ou-bg-blue-600" >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Link to="/" className="ou-flex ou-items-center" >
                <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                    <Logo width={50} height={50} className="ou-text-white ou-mr-2" color={'white'}/>
                </Box>
                <Typography variant="h6" noWrap
                    sx={{
                      mr: 2,
                      my: 0,
                      py: 2,
                      display: { xs: 'none', md: 'flex' },
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                >
                    OUPHARMACY
                </Typography>
            </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu id="menu-appbar" anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none'},
              }}
            >
                {pages.map((page) => renderElementNav(page.id+"-mb", page.link, page.name, true, page.id+"-mb"))}
            </Menu>
          </Box>
          <Box  sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <Link to="/" className=" ou-flex ou-justify-center ou-items-center">
            <Avatar alt="OUPharmacy-Logo"  
                sx={{
                    mr: 2,
                    display: { xs: 'flex', md: 'none' },
                    flexGrow: 1,
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
                src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666354767/OUPharmacy/logo_oupharmacy_1x1_zks7t4.png" />
               
            </Link>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => renderElementNav(page.id, page.link, page.name, false, page.id+"-dek"))}
          </Box>
                
          <Box sx={{ flexGrow: 0 }} className="ou-flex">
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
      </Container>

      <CustomModal
          className="ou-w-[900px]"
          open={isOpen}
          onClose={handleCloseModal}
          content={<FormChangePassword callBack={handleCloseModal}/>}
        />
    </AppBar>
  )
}
export default Nav