import { Avatar, Box, Button, Paper, Tooltip, Typography } from "@mui/material"
import { AVATAR_DEFAULT, ERROR_CLOUDINARY, TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants"
import { useContext } from "react"
import UserContext from "../../../../lib/context/UserContext"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from "react-i18next";
import CustomModal from "../../../common/components/Modal";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import PersonIcon from '@mui/icons-material/Person';
import { DASHBOARD_PAPER_SX } from "../../../common/layout/dashboard/styleTokens";
const AvatarProfile = () => {
    const {user, setSelectedImage, imageUrl, 
        selectedImage, handleChangeAvatar, isLoading } = useContext(UserContext)
    const {t} = useTranslation(['profile'])
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    return (
        <>
            <Box component={Paper} elevation={1} sx={{ ...DASHBOARD_PAPER_SX, p: 2.5, borderRadius: 2 }}>
                <div className="ou-text-center">
                    <Box className="ou-relative">
                        <Avatar
                            className="ou-m-auto"
                            alt={user.first_name + " " + user.last_name}
                            src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path}
                            sx={{ width: { xs: 96, sm: 128 }, height: { xs: 96, sm: 128 }, border: 2, borderColor: "primary.main" }}
                        />
                        <Tooltip title={t('profile:changeAvatar')} followCursor>  
                            <span onClick={handleOpenModal}>
                                <AddCircleOutlineIcon sx={{ color: "primary.main", fontSize: { xs: 28, sm: 36 } }} className="hover:ou-cursor-pointer
                                ou-absolute ou-left-[50%] ou-transform ou-translate-x-[-50%] ou-translate-y-[-50%]"/>
                            </span>
                        </Tooltip>
                    </Box>

                    <Typography sx={{ mb: 1, mt: 3, fontWeight: 600 }}>{user.first_name} {user.last_name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>{user.email}</Typography>
                </div>
            </Box>
            <CustomModal
                open={isOpen}
                title={t('profile:changeAvatar')}
                onClose={handleCloseModal}
                content={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 3, sm: 2 },
                            mb: 3,
                          }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {t('profile:currentAvatar')}
                                    </Typography>
                                    <Box
                                      component="img"
                                      src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path} 
                                      alt="avatar_user_current" 
                                      sx={{
                                        width: { xs: 160, sm: 200, md: 240 },
                                        height: { xs: 160, sm: 200, md: 240 },
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        mx: "auto",
                                        border: 2,
                                        borderColor: "divider",
                                        display: "block",
                                      }}
                                    />
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {t('profile:selectedAvatar')}
                                    </Typography>
                                    {imageUrl && selectedImage && (
                                        <Box sx={{ my: 1 }} textAlign="center">
                                            <Box
                                              component="img"
                                              src={imageUrl}
                                              alt={selectedImage.name} 
                                              sx={{
                                                width: { xs: 160, sm: 200, md: 240 },
                                                height: { xs: 160, sm: 200, md: 240 },
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                mx: "auto",
                                                border: 2,
                                                borderColor: "divider",
                                                display: "block",
                                              }}
                                            />
                                        </Box>
                                    )}
                                    {(!imageUrl || !selectedImage) && (
                                        <Box
                                          sx={{
                                            my: 1,
                                            mx: "auto",
                                            width: { xs: 160, sm: 200, md: 240 },
                                            height: { xs: 160, sm: 200, md: 240 },
                                            borderRadius: "50%",
                                            border: 2,
                                            borderColor: "divider",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                          }}
                                        >
                                            <PersonIcon sx={{ fontSize: { xs: 72, sm: 96, md: 120 }, color: "grey.500" }}/>
                                        </Box>
                                    )}
                            </Box>
                        </Box>
                            <Box className="ou-mt-4">
                                <input accept="image/*" type="file" id="select-image" style={{ display: 'none' }}
                                    onChange={(e) => {
                                        setSelectedImage(e.target.files[0]);
                                    }}
                                />
                                <label htmlFor="select-image" className="ou-mb-4">
                                    <Button className="!ou-min-w-[150px] ou-w-full !ou-mb-2"  
                                    variant="contained" disabled={isLoading}
                                    color="primary" component="span">
                                        {t('profile:uploadAvatar')}
                                    </Button>
                                </label>

                                <Button className="!ou-min-w-[150px] ou-w-full"  variant="contained" 
                                    color="primary" component="span" 
                                    disabled={isLoading}
                                    onClick={() => 
                                        handleChangeAvatar(
                                            () => {
                                                createToastMessage({message:t('profile:changeAvatarSuccess'), type:TOAST_SUCCESS})
                                                handleCloseModal();
                                                setSelectedImage(null);
                                            }, 
                                            () => createToastMessage({message:t('profile:noImageSelected'), type:TOAST_ERROR}))}>
                                    {t('profile:submit')}
                                </Button>
                            </Box>
                    </Box>
                }
                actions={[
                ]}
            />
        </>
    )
}
export default AvatarProfile