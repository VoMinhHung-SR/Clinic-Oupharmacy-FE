import { AppBar, Avatar, Badge, Box, Button, Container, Divider, IconButton, Menu, MenuItem, Paper, Toolbar, Tooltip, Typography } from "@mui/material"
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import { Link } from "react-router-dom"
import { useContext, useState } from "react";
import Logo from "../../../../../public/logo";
import MailIcon from '@mui/icons-material/Mail';
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

  const { user, handleLogout, hasValidUserAddress, defaultAddress } = useContext(UserContext);
  let badgeContent = <></> 
    
  let btn = <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          component={Link}
          to="/login"
          sx={{
            color: "inherit",
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
            fontWeight: 600,
            px: { xs: 1.25, sm: 1.75 },
            py: 0.75,
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 1,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.55)" },
          }}
        >
          <LoginIcon sx={{ mr: 0.75, fontSize: 18 }} />
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {t("common:logInAndRegister")}
          </Box>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            {t("login")}
          </Box>
        </Button>
      </Box>
  </>

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

  const navLinkSx = (isMobile) => ({
    color: isMobile ? "text.primary" : "inherit",
    px: { xs: 2, md: 1.5 },
    py: { xs: 1.25, md: 1 },
    minWidth: "auto",
    width: isMobile ? "100%" : "auto",
    justifyContent: isMobile ? "flex-start" : "center",
    fontSize: "0.9375rem",
    fontWeight: 500,
    letterSpacing: "0.01em",
    lineHeight: 1.2,
    opacity: isMobile ? 1 : 0.92,
    borderRadius: 1,
    textTransform: "none",
    "&:hover": {
      opacity: 1,
      bgcolor: isMobile ? "action.hover" : "rgba(255,255,255,0.1)",
    },
  })

  const renderElementNav = (pageID, pageLink, pageName, isMobile = false, keyPage) => {
      if(pageID === 'prescribing'|| pageID === 'prescribing-mb')
        if(user && user.role === ROLE_DOCTOR)
          return(
            <Button
              key={keyPage}
              component={Link}
              to={pageLink}
              onClick={handleCloseNavMenu}
              sx={navLinkSx(isMobile)}
            >
              {pageName}
            </Button>
          )
        else return 
      if(pageID === 'examinations' || pageID === 'examinations-mb')
        if(user && (user.role === ROLE_DOCTOR || user.role === ROLE_NURSE))
          return(
            <Button
              key={keyPage}
              component={Link}
              to={pageLink}
              onClick={handleCloseNavMenu}
              sx={navLinkSx(isMobile)}
            >
              {pageName}
            </Button>
          )  
        else return
      return (
        <Button
          key={keyPage}
          component={Link}
          to={pageLink}
          onClick={handleCloseNavMenu}
          sx={navLinkSx(isMobile)}
        >
          {pageName}
        </Button>
      )
  }
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "primary.dark",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, md: 64 },
            gap: { xs: 1, md: 2 },
            justifyContent: "space-between",
          }}
        >
            {/* Zone 1 — Brand */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                color: "inherit",
                flexShrink: 0,
                minWidth: 180,
              }}
            >
              <Logo width={40} height={40} color="white" />
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  fontSize: "1.05rem",
                  lineHeight: 1,
                }}
              >
                OUPHARMACY
              </Typography>
            </Box>

            {/* Mobile: menu + centered logo */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", minWidth: 48 }}>
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

            <Box sx={{ display: { xs: "flex", md: "none" }, flex: 1, justifyContent: "center" }}>
              <Box component={Link} to="/" sx={{ display: "inline-flex", lineHeight: 0 }}>
                <Avatar
                  alt="OUPharmacy-Logo"
                  sx={{ width: 40, height: 40 }}
                  src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666354767/OUPharmacy/logo_oupharmacy_1x1_zks7t4.png"
                />
              </Box>
            </Box>

            {/* Zone 2 — Primary nav (desktop, optically centered) */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
              }}
            >
              {pages.map((page) => renderElementNav(page.id, page.link, page.name, false, page.id+"-dek"))}
            </Box>
                
            {/* Zone 3 — Utilities */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: { xs: 0.25, sm: 0.5, md: 0.75 },
                flexShrink: 0,
                minWidth: { md: 180 },
              }}
            >
              {i18n.language === "en" ? (
                <Tooltip followCursor title={t("changeLanguage")}>
                  <IconButton
                    onClick={() => changeLanguage("vi")}
                    aria-label={t("changeLanguage")}
                    sx={{ color: "inherit", p: 1 }}
                  >
                    <FlagUK width={22} height={22} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip followCursor title={t("changeLanguage")}>
                  <IconButton
                    onClick={() => changeLanguage("en")}
                    aria-label={t("changeLanguage")}
                    sx={{ color: "inherit", p: 1 }}
                  >
                    <FlagVN width={22} height={22} />
                  </IconButton>
                </Tooltip>
              )}

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
              display: { xs: 'block', md: 'none'},
              '& .MuiPaper-root': {
                minWidth: 220,
                mt: 1,
                py: 0.5,
              }
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page.id + "-mb"} sx={{ p: 0 }}>
                {renderElementNav(page.id + "-mb", page.link, page.name, true, page.id + "-mb")}
              </MenuItem>
            ))}
          </Menu>
        </Container>

      <CustomModal
          open={isOpen}
          onClose={handleCloseModal}
          title={t("common:changePassword")}
          content={<FormChangePassword callBack={handleCloseModal}/>}
        />
    </AppBar>
  )
}
export default Nav