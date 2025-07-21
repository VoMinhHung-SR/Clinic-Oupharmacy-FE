import { Box, Button, Typography } from "@mui/material"
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo";
import AddressInfo from "../../../modules/pages/ProfileComponents/AddressInfo";
import UserContext from "../../../lib/context/UserContext";

const ProfileAddressInfo = () => {
    const { t } = useTranslation(['register', 'common', 'yup-validate']);
    const {user} = useContext(UserContext);

    const { handleCloseModal, isOpen, handleOpenModal} = useCustomModal();
    const [flag, setFlag] = useState(false)
    const handleChangeFlag = () => setFlag(!flag)
    useEffect(()=> {},[flag])
    
    return(
        <Box className=" ou-m-auto ou-rounded">
        <Helmet>
          <title>{t('register:addressInfo')} - OUpharmacy</title>
        </Helmet>
        <Box  className="ou-m-auto ou-px-8 ou-py-4 ">
            <Typography gutterBottom 
              sx={{ color: 'primary.main', fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: 'center' }}>
                {t('addressInfo')}
            </Typography>
            <AddressInfo locationData={user.locationGeo}/>

            <Box sx={{ textAlign: 'right' }}>
                <Button className="!ou-min-w-[150px]" variant="contained" 
                color="success" onClick={handleOpenModal}>
                  {t('common:edit')}
                </Button>
              </Box>
        </Box>
            <CustomModal
            title={t('updateAddressInfo')}
            className="ou-w-[900px] ou-text-center"
            open={isOpen}
            onClose={handleCloseModal}
            content={
                <UpdateAddressInfo 
                  callBackSuccess={() => {
                      handleChangeFlag();
                      handleCloseModal();
                  }
                }/>
            }
       
        />
      
      </Box>
    )
}

export default ProfileAddressInfo