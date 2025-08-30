import { Avatar, Box, Paper, Tooltip } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Image, ListAlt, Person } from "@mui/icons-material"
import { Outlet, useLocation, } from "react-router"
import { Link } from "react-router-dom"
import clsx from 'clsx';
import { removeSymbol } from "../../lib/utils/helper"
import UpdateProfile from "../../modules/pages/ProfileComponents/UpdateProfile"
import { useTranslation } from "react-i18next"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UserContext from "../../lib/context/UserContext"
import AvatarProfile from "../../modules/pages/ProfileComponents/AvatarProfile"
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListIcon from '@mui/icons-material/List';
import WarningIcon from '@mui/icons-material/Warning';

const Profile = () => {
    const {user} = useContext(UserContext);

    const location = useLocation()
    const {t, tReady} = useTranslation(['profile'])
    const userProfile = [{
        id: 'profile',
        pathName: '/profile',
        itemTitle: t('profile'),
        itemIcon: <Person/>
    },{
        id: 'address-info',
        pathName: '/profile/address-info',
        itemTitle: t('addressInfo'),
        itemIcon: <LocationOnIcon/>
    },
    {
        id: 'patient-management',
        pathName: '/profile/patient-management',
        itemTitle: t('patientManagement'),
        itemIcon: <ListIcon/>
    },
    {
        id: 'booking-list',
        pathName: '/profile/examinations',
        itemTitle: t('bookingList'),
        itemIcon: <AssignmentIcon/>
    }]
    const [flag, setFlag] = useState(false)
    const handleChangeFlag = () => setFlag(!flag)

    useEffect(()=> {}, [flag])

    const itemsNavigate = (itemID, pathName, itemTitle, itemIcon) => {

        return (
            <Link key={itemID} to={pathName} >
                <Box className={clsx("ou-flex ou-items-center ou-p-3", 
                {'!ou-bg-[#ed6c02]' : user && !user.locationGeo && itemID === 'address-info'},
                { 'ou-bg-blue-700 ou-rounded ou-text-white'
                : removeSymbol('/', pathName) === removeSymbol('/', location.pathname) })}>
                    {itemIcon}
                    <span className="ou-ml-2">{itemTitle}</span>
                    {itemID === 'address-info' && user && !user.locationGeo && (
                        <Tooltip title={t('profile:addressInfoNotSet')}>  
                            <Box className="ou-flex ou-items-center ou-ml-auto">
                                <WarningIcon/>
                            </Box>
                        </Tooltip>
                    )}
                </Box>
                
            </Link>
        )
    }


    return (
        <>
        <Box className="ou-flex ou-flex-col md:ou-flex-row ou-justify-center">
            <Box className="ou-w-full md:ou-w-[30%] ou-mb-4 md:ou-mb-0">
                <AvatarProfile/>
                <Box component={Paper} elevation={4} className="ou-p-5 ou-mt-6">
                    {userProfile.map((items) => itemsNavigate(items.id, items.pathName, items.itemTitle, items.itemIcon))}
                </Box>
            </Box>

           <Box className="ou-w-full md:ou-w-[70%] md:ou-ml-3" component={Paper} elevation={4}>
               { removeSymbol('/',location.pathname) === 'profile' ? 
                   <Box>
                        <Box>
                            <UpdateProfile userID={user.id} dob={user.date_of_birth} gender={parseInt(user.gender)} email={user.email}
                            firstName={user.first_name} lastName={user.last_name} phoneNumber={user.phone_number} handleOnSuccess={handleChangeFlag}/>
                        </Box>
                    </Box>
                : <Outlet/>
                }
           </Box>
        </Box>
         
        </>
    )
}

export default Profile

