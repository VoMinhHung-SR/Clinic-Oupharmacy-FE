import { Avatar, Box, Button, Paper, Tooltip } from "@mui/material"
import { AVATAR_DEFAULT, AVATAR_NULL, ERROR_CLOUDINARY, TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants"
import { useContext } from "react"
import UserContext from "../../../../lib/context/UserContext"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from "react-i18next";
import CustomModal from "../../../common/components/Modal";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import PersonIcon from '@mui/icons-material/Person';
const AvatarProfile = () => {
    const {user, setSelectedImage, imageUrl, 
        selectedImage, handleChangeAvatar, isLoading } = useContext(UserContext)
    const {t} = useTranslation(['profile'])
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    return (
        <>
            <Box component={Paper} elevation={4} className="ou-p-5">
                <div className="ou-text-center">
                    <Box className="ou-relative">
                        <Avatar
                            className="ou-m-auto ou-border-2 ou-border-[#007aff]"
                            alt={user.first_name + " " + user.last_name}
                            src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path}
                            sx={{ width: 128, height: 128 }}
                        />
                        <Tooltip title={t('profile:changeAvatar')} followCursor>  
                            <span onClick={handleOpenModal}>
                                <AddCircleOutlineIcon className="ou-text-[#007aff] !ou-text-4xl hover:ou-cursor-pointer
                                ou-absolute ou-left-[50%] ou-transform ou-translate-x-[-50%] ou-translate-y-[-50%]"/>
                            </span>
                        </Tooltip>
                    </Box>

                    <p className="ou-mb-3 ou-mt-6">{user.first_name} {user.last_name}</p>
                    <p className="ou-text-sm ou-text-gray-400 ou-opacity-80">{user.email}</p>
                </div>
            </Box>
            <CustomModal
                className="ou-w-[600px]"
                open={isOpen}
                title={t('profile:changeAvatar')}
                onClose={handleCloseModal}
                content={
                    <div className="ou-flex ou-flex-col">
                        <div className="ou-flex ou-mb-8">
                            <div className="ou-flex ou-w-full">

                                <div className="ou-w-1/2">
                                    <p className="ou-text-sm ou-text-gray-400 
                                        ou-w-full ou-opacity-80 ou-text-center ou-mb-4">
                                        {t('profile:currentAvatar')}
                                    </p>
                                    <img src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path} 
                                        alt="avatar_user_current" 
                                        width={240}
                                        className="ou-rounded-full ou-object-cover ou-mx-auto ou-h-[240px]
                                        ou-border-2 ou-border-gray-500"
                                    />
                                </div>

                                <div className="ou-w-1/2">
                                    <p className="ou-text-sm ou-text-gray-400
                                        ou-w-full ou-opacity-80 ou-text-center ou-mb-4">
                                        {t('profile:selectedAvatar')}
                                    </p>
                                    {imageUrl && selectedImage && (
                                        <Box className="ou-my-4 ou-border-solid" textAlign="center">
                                            <img src={imageUrl} alt={selectedImage.name} 
                                            width={240}
                                            className="ou-rounded-full ou-object-cover ou-mx-auto ou-h-[240px]
                                            ou-border-2 ou-border-gray-500"/>
                                        </Box>
                                    )}
                                    {(!imageUrl || !selectedImage) && (
                                        <Box className="ou-my-4 ou-border-solid" textAlign="center">
                                            <p className="ou-text-sm ou-text-red-500 ou-mx-auto ou-rounded-full
                                                ou-border-2 ou-border-gray-500 ou-flex ou-items-center ou-justify-center
                                                ou-w-[240px] ou-h-[240px] ou-opacity-80 ou-text-center ou-mb-4">
                                                <PersonIcon className="!ou-text-[120px] ou-pb-4 ou-text-gray-500"/>
                                            </p>
                                        </Box>
                                    )}
                                </div>
                            </div>
        
                        </div>
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
                                    color="success" component="span" 
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
                    </div>
                }
                actions={[
                ]}
            />
        </>
    )
}
export default AvatarProfile