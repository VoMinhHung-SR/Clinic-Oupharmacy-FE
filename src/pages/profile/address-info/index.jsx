import { Box, Button, Typography } from "@mui/material"
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo";
import AddressInfo from "../../../modules/pages/ProfileComponents/AddressInfo";
import UserContext from "../../../lib/context/UserContext";
import useUpdateLocation from "../../../modules/pages/ProfileComponents/hooks/useUpdateLocation";

const ProfileAddressInfo = () => {
    const { t } = useTranslation(['register', 'common', 'yup-validate']);
    const {user} = useContext(UserContext);
    const { locationData, onSubmit } = useUpdateLocation()
    const { handleCloseModal, isOpen, handleOpenModal} = useCustomModal();

    const handleSubmit = (data, setError, locationGeo, cityName, districtName) => {
        onSubmit(data, setError, locationGeo, cityName, districtName, handleCloseModal); 
    }

    let locationDataProps = {}

    if(locationData) {
      locationDataProps = {
        city: {
          name: locationData.city_info.name
        },
        district: {
          name: locationData.district_info.name
        },
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng
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
            {locationData ? (
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
            title={t('updateAddressInfo')}
            className="ou-w-[900px] ou-text-center"
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