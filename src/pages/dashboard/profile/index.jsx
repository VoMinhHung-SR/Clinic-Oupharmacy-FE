import { Box, Paper } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Person } from "@mui/icons-material"
import { Outlet, useLocation, } from "react-router"
import { Link } from "react-router-dom"
import clsx from 'clsx';
import { removeSymbol } from "../../../lib/utils/helper"
import UpdateProfile from "../../../modules/pages/ProfileComponents/UpdateProfile"
import { useTranslation } from "react-i18next"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import UserContext from "../../../lib/context/UserContext"
import AvatarProfile from "../../../modules/pages/ProfileComponents/AvatarProfile"
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListIcon from '@mui/icons-material/List';
import WarningIcon from '@mui/icons-material/Warning';
import Tooltip from "@mui/material/Tooltip";

const DashboardProfile = () => {
    const {user} = useContext(UserContext);

    const location = useLocation()
    const {t, tReady} = useTranslation(['profile'])
    const userProfile = [{
        id: 'D-profile',
        pathName: '/dashboard/profile',
        itemTitle: t('profile'),
        itemIcon: <Person/>
    },{
        id: 'D-address-info',
        pathName: '/dashboard/profile/address-info',
        itemTitle: t('addressInfo'),
        itemIcon: <LocationOnIcon/>
    },
    {
        id: 'D-patient-management',
        pathName: '/dashboard/profile/patient-management',
        itemTitle: t('patientManagement'),
        itemIcon: <ListIcon/>
    },
    {
        id: 'D-booking-list',
        pathName: '/dashboard/profile/examinations',
        itemTitle: t('bookingList'),
        itemIcon: <AssignmentIcon/>
    }]

    const [flag, setFlag] = useState(false)
    const handleChangeFlag = () => setFlag(!flag)

    useEffect(()=> {}, [flag])

    const hasValidLocationData = user.locationGeo && 
                                    Object.keys(user.locationGeo).length > 0 &&
                                    user.locationGeo.city &&
                                    user.locationGeo.district &&
                                    user.locationGeo.address

    const itemsNavigate = (itemID, pathName, itemTitle, itemIcon) => {
        if (user && !hasValidLocationData && itemID === 'D-address-info') { 
            return (
                <Link key={itemID} to={pathName}>
                    <Box className={clsx("ou-flex ou-items-center ou-p-3 ou-rounded",
                        {'!ou-bg-[#ed6c02] !ou-text-white': removeSymbol('/', pathName) === removeSymbol('/', location.pathname)})}>
                        {itemIcon}
                        <span className="ou-ml-2">{itemTitle}</span>
                        <Tooltip title={t('profile:addressInfoNotSet')}>  
                            <Box className={clsx("ou-flex ou-items-center ou-ml-auto ou-text-[#ed6c02]",
                                {'!ou-text-white': removeSymbol('/', pathName) === removeSymbol('/', location.pathname)})}>
                                <WarningIcon/>
                            </Box>
                        </Tooltip>
                    </Box>
                </Link>
            )
        }
        return (
            <Link key={itemID} to={pathName}>
                <Box className={clsx("ou-flex ou-items-center ou-p-3 ou-rounded", 
                {'!ou-bg-blue-700 !ou-text-white': removeSymbol('/', pathName) === removeSymbol('/', location.pathname) })}>
                    {itemIcon}
                    <span className="ou-ml-2">{itemTitle}</span>
                </Box>
            </Link>
        )
    }

    return (
        <>
        <Box className="ou-flex ou-flex-col md:ou-flex-row ou-justify-center">
            <Box  className="ou-w-full md:ou-w-[30%] ou-mb-4 md:ou-mb-0" >
                <AvatarProfile/>
                <Box  component={Paper} elevation={4} className="ou-p-5 ou-mt-6 ">
                    {userProfile.map((items) => itemsNavigate(items.id, items.pathName, items.itemTitle, items.itemIcon))}
                </Box>
            </Box>

           <Box className="ou-w-full md:ou-w-[70%] md:ou-ml-3" component={Paper} elevation={4}>
               { removeSymbol('/',location.pathname) === 'dashboardprofile' ? 
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

export default DashboardProfile

