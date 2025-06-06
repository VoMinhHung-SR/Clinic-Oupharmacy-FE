import { Avatar, Box, Paper, Tooltip } from "@mui/material"
import { AVATAR_DEFAULT, ERROR_CLOUDINARY } from "../../../../lib/constants"
import { useContext } from "react"
import UserContext from "../../../../lib/context/UserContext"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from "react-i18next";

const AvatarProfile = () => {
    const {user} = useContext(UserContext)
    const {t} = useTranslation()
    return (
        <Box component={Paper} elevation={4} className="ou-p-5">
            <div className="ou-text-center">
                <Box className="ou-relative">
                    <Avatar
                        className="ou-m-auto ou-border-2 ou-border-[#007aff]"
                        alt={user.first_name + user.last_name}
                        src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path}
                        sx={{ width: 128, height: 128 }}
                    />
                    <Tooltip title={t('profile:changeAvatar')} followCursor>  
                        <span>
                            <AddCircleOutlineIcon className="ou-text-[#007aff] !ou-text-4xl hover:ou-cursor-pointer
                            ou-absolute ou-left-[50%] ou-transform ou-translate-x-[-50%] ou-translate-y-[-50%]"/>
                        </span>
                    </Tooltip>
                </Box>

                <p className="ou-mb-3 ou-mt-6">{user.first_name} {user.last_name}</p>
                <p className="ou-text-sm ou-text-gray-400 ou-opacity-80">{user.email}</p>
            </div>
        </Box>
    )
}
export default AvatarProfile