import { Avatar, Box, Paper } from "@mui/material"
import { AVATAR_DEFAULT, ERROR_CLOUDINARY } from "../../../../lib/constants"
import { useContext } from "react"
import UserContext from "../../../../lib/context/UserContext"

const AvatarProfile = () => {
    const {user} = useContext(UserContext)
    return (
        <Box component={Paper} elevation={4} className="ou-p-5">
            <div className="ou-text-center">
            <Avatar
                className="ou-m-auto"
                alt={user.first_name + user.last_name}
                src={user.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : user.avatar_path}
                sx={{ width: 128, height: 128 }}
            />

                <p className="ou-my-3">{user.first_name} {user.last_name}</p>
                <p className="ou-text-sm ou-text-gray-400 ou-opacity-80">{user.email}</p>
            </div>
        </Box>
    )
}
export default AvatarProfile