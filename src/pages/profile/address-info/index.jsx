import { Box, Button, Typography } from "@mui/material"
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo";
import AddressInfo from "../../../modules/pages/ProfileComponents/AddressInfo";
import UserContext from "../../../lib/context/UserContext";
import useUpdateLocation from "../../../modules/pages/ProfileComponents/hooks/useUpdateLocation";

const ProfileAddressInfo = () => {
    const { t } = useTranslation(['register', 'common', 'yup-validate']);
    const {user} = useContext(UserContext);
    const { onSubmit } = useUpdateLocation()
    const { handleCloseModal, isOpen, handleOpenModal} = useCustomModal();

    const handleSubmit = (data, setError, locationGeo, cityName, districtName) => {
        onSubmit(data, setError, locationGeo, cityName, districtName, handleCloseModal); 
    }

    let locationDataProps = {}

    const hasValidLocationData = user.locationGeo && 
                                Object.keys(user.locationGeo).length > 0 &&
                                user.locationGeo.city &&
                                user.locationGeo.district &&
                                user.locationGeo.address

    if(hasValidLocationData) {
      locationDataProps = {
        city: {
          name: user.locationGeo.city.name
        },
        district: {
          name: user.locationGeo.district.name
        },
        address: user.locationGeo.address,
        lat: user.locationGeo.lat,
        lng: user.locationGeo.lng
      }
    }
    return(
        <Box className=" ou-m-auto ou-rounded">
        <Helmet>
          <title>{t('register:addressInfo')} - OUpharmacy</title>
        </Helmet>
        <Box  className="ou-m-auto ou-px-8 ou-py-4 ">
            <Typography className="ou-text-center ou-text-[#1D4ED8]"
              sx={{fontSize: '2rem'}} >
                {t('addressInfo')}
            </Typography>
            {hasValidLocationData ? (
              <Box className="ou-mt-4">

                <AddressInfo locationData={locationDataProps}/>

                <Box className="ou-flex ou-justify-end ou-my-5"  >
                    <Button className="!ou-min-w-[150px]" variant="contained" 
                    color="success" onClick={handleOpenModal}>
                    {t('common:edit')}
                    </Button>
                </Box>
              </Box>
            ) : (
               <UpdateAddressInfo onSubmit={handleSubmit}/>
            )}
            
        </Box>
            <CustomModal
            title={<span className="ou-text-[#1D4ED8] ou-text-2xl">
              {t('updateAddressInfo')}</span>}
            className="ou-text-center ou-w-full"
            open={isOpen}
            onClose={handleCloseModal}
            content={
                <UpdateAddressInfo onSubmit={handleSubmit}/>
            }
       
        />
      
      </Box>
    )
}

export default ProfileAddressInfo