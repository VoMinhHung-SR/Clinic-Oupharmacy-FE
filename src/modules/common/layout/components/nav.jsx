import { AppBar, Avatar, Badge, Box, Button, Container, Divider, IconButton, Menu, MenuItem, Paper, Toolbar, Tooltip, Typography } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import { Link } from "react-router-dom"
import { useContext, useState } from "react";
import Logo from "../../../../../public/logo";
import MailIcon from '@mui/icons-material/Mail';
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "i18next";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FlagUK from "../../../../../public/flagUK";
import FlagVN from "../../../../../public/flagVN";
import { AVATAR_DEFAULT, ERROR_CLOUDINARY, ROLE_DOCTOR, ROLE_NURSE } from "../../../../lib/constants";
import useNotification from "../../../../lib/hooks/useNotification";
import NotificationButton from "../../components/button/Notification";
import CustomModal from "../../components/Modal";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import KeyIcon from '@mui/icons-material/Key';
import FormChangePassword from "../../../pages/HomeComponents/FormChangePassword";
import UserContext from "../../../../lib/context/UserContext";
import WarningIcon from '@mui/icons-material/Warning';
import useCustomNavigate from "../../../../lib/hooks/useCustomNavigate";
const Nav = () => {
  const { t, i18n } = useTranslation(['common', 'modal']);

  const pages = [
    {
        id: 'booking',
        name: t('booking'),
        link: '/booking'
    },
    {
        id: 'waiting-room',
        name: t('waitingRoom'),
        link: '/waiting-room'
    },
    {
        id: 'about-us',
        name: t('aboutUs'),
        link: '/about-us'
    }, 
    {
        id: 'contact',
        name: t('contact'),
        link: '/contact'
    }
  ];

  const {isLoading, notifyListContent, updateNotifications} = useNotification();
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const {navigate} = useCustomNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const {user, handleLogout} = useContext(UserContext);
  const hasValidLocationData = user && user.locationGeo && 
                                Object.keys(user.locationGeo).length > 0 &&
                                user.locationGeo.city &&
                                user.locationGeo.district &&
                                user.locationGeo.address
  let badgeContent = <></> 
    
  let btn = <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/login">
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 }
              }}
            >
              <LoginIcon sx={{ mr: 0.5, fontSize: { xs: '16px', sm: '20px' } }} />
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t('common:logInAndRegister')}
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                {t('login')}
              </Box>
            </Button>
          </Link>
      </Box>
  </>

  if (user){
    badgeContent = !hasValidLocationData ?
      <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title={t('common:warningMisInformation')}>
              <span>
                <WarningIcon fontSize='small' color='warning'/>  
              </span>
            </Tooltip>
          }>
          <Avatar alt={user.first_name + " " + user.last_name} 
            src={ user.avatar_path && user.avatar_path != ERROR_CLOUDINARY ? user.avatar_path : AVATAR_DEFAULT}
            sx={{ width: 36, height: 36 }}
            className='ou-border-2 ou-border-[#1D4ED8] ou-rounded-full' />
        </Badge>
      : <Avatar alt={user.first_name + " " + user.last_name} 
        src={ user.avatar_path && user.avatar_path != ERROR_CLOUDINARY ? user.avatar_path : AVATAR_DEFAULT}
        sx={{ width: 36, height: 36 }}
        className='ou-border-2 ou-border-[#1D4ED8] ou-rounded-full' />
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
          <Link to="/profile">
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
            
            <MenuItem style={{ "color": "#333" }} className="!ou-py-3 "
            onClick={() => navigate("/profile")}>
                <AccountCircleIcon fontSize="small" />
                <Typography marginLeft={2}>
                  {t("common:profile")}
                </Typography>
            </MenuItem>
            <Divider className="!ou-m-[0px]" />
            <MenuItem style={{ "color": "#333" }} className="!ou-py-3" onClick={handleOpenModal}>
                   <KeyIcon fontSize="small" />
                    <Typography marginLeft={2}>
                    {t("common:changePassword")}
                    </Typography>
            </MenuItem>
            <Divider className="!ou-m-[0px]" />
            <MenuItem onClick={handleLogout} className="!ou-py-3 !ou-text-red-500">
                <Logout fontSize="small" />
                <Typography marginLeft={2}>
                    {t('logout')}
                </Typography>
            </MenuItem>
            <Divider className="!ou-m-[0px]" />
        </Menu>
        
        {/* Show nav menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
            <Tooltip followCursor title={t('conversations')}>
              <Box className="hover:ou-cursor-pointer" onClick={() => navigate('/conversations')}> 
                <IconButton sx={{ color: '#fff', p: { xs: 0.5, sm: 1 } }}>
                  <MailIcon sx={{ fontSize: { xs: "20px", sm: "24px" } }} />    
                </IconButton>
              </Box>
            </Tooltip>

          <Tooltip followCursor title={t('notifications')}>
            <Box className="hover:ou-cursor-pointer"> 
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
              <Box sx={{ border: '2px solid #fff', borderRadius: '50%' }} >{badgeContent} </Box> 
            </IconButton>
          </Tooltip>
        </Box>
        {/* End nav menu */}
    </>
  }

  const renderElementNav = (pageID, pageLink, pageName, isMobile = false, keyPage) => {
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
    <AppBar position="fixed" sx={{
      background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
      color: '#fff'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: '56px', sm: '64px' } }}>
            {/* Logo and Brand - Desktop */}
            <Link to="/" className="ou-flex ou-items-center" >
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, mr: 1 }}>
                    <Logo width={50} height={50} className="ou-text-white ou-mr-2" color={'white'}/>
                </Box>
                <Typography variant="h6" noWrap
                    sx={{
                      mr: 2,
                      my: 0,
                      py: 2,
                      display: { xs: 'none', lg: 'flex' },
                      fontWeight: 700,
                      letterSpacing: '.3rem',
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: { lg: '1.25rem', xl: '1.5rem' }
                    }}
                >
                    OUPHARMACY
                </Typography>
            </Link>

            {/* Mobile Menu Button */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexGrow: 0 }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ p: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Mobile Logo */}
            <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
              <Link to="/" className="ou-flex ou-justify-center ou-items-center">
                <Avatar 
                  alt="OUPharmacy-Logo"  
                  sx={{
                    width: { xs: 40, sm: 45 },
                    height: { xs: 40, sm: 45 },
                    display: { xs: 'flex', lg: 'none' }
                  }}
                  src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666354767/OUPharmacy/logo_oupharmacy_1x1_zks7t4.png" 
                />
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', lg: 'flex' },
              justifyContent: 'flex-start',
              gap: 1,
              ml: 2
            }}>
              {pages.map((page) => renderElementNav(page.id, page.link, page.name, false, page.id+"-dek"))}
            </Box>
                
            {/* Right Side Actions */}
            <Box sx={{ 
              flexGrow: 0, 
              display: 'flex', 
              alignItems: 'center',
              gap: { xs: 0.5, sm: 1, md: 1.5 }
            }}>
              {/* Language Toggle */}
              <Box>
                {i18n.language === 'en' ? 
                  <Tooltip followCursor title={t('changeLanguage')}>
                    <Button 
                      className="!ou-text-white" 
                      onClick={()=> changeLanguage('vi')}
                      sx={{ minWidth: 'auto', p: { xs: 1, sm: 1.5 } }}
                    >
                      <FlagUK width={24} height={24}/>
                    </Button> 
                  </Tooltip>
                  :
                  <Tooltip followCursor title={t('changeLanguage')}>
                    <Button 
                      className="!ou-text-white" 
                      onClick={()=> changeLanguage('en')}
                      sx={{ minWidth: 'auto', p: { xs: 1, sm: 1.5 } }}
                    >
                      <FlagVN width={24} height={24}/>
                    </Button>
                  </Tooltip>
                }
              </Box>

              {/* User Actions */}
              {btn}
            </Box>
          </Toolbar>

          {/* Mobile Menu */}
          <Menu 
            id="menu-appbar" 
            anchorEl={anchorElNav}
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
              display: { xs: 'block', lg: 'none'},
              '& .MuiPaper-root': {
                minWidth: '200px',
                mt: 1
              }
            }}
          >
            {pages.map((page) => renderElementNav(page.id+"-mb", page.link, page.name, true, page.id+"-mb"))}
          </Menu>
        </Container>

      <CustomModal
          open={isOpen}
          onClose={handleCloseModal}
          content={<FormChangePassword callBack={handleCloseModal}/>}
        />
    </AppBar>
  )
}
export default Nav