import { Box, Button, Chip, Typography, Paper } from "@mui/material"
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo";
import UserContext from "../../../lib/context/UserContext";
import useUserAddresses from "../../../modules/pages/ProfileComponents/hooks/useUserAddresses";

const ProfileAddressInfo = () => {
  const { t } = useTranslation(['register', 'common', 'yup-validate']);
  const { user, defaultAddress } = useContext(UserContext);
  const {
    addresses,
    isLoading,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useUserAddresses();
  const { handleCloseModal, isOpen, handleOpenModal} = useCustomModal();
  const [editingAddress, setEditingAddress] = useState(null);

  const handleSubmit = (data, setError, locationGeo, cityName, districtName) => {
    if (editingAddress) {
      handleUpdateAddress(
        editingAddress.id,
        data,
        setError,
        locationGeo,
        cityName,
        districtName,
        () => {
          setEditingAddress(null);
          handleCloseModal();
        }
      );
    } else {
      handleCreateAddress(
        data,
        setError,
        locationGeo,
        cityName,
        districtName,
        handleCloseModal
      );
    }
  };

  const handleOpenCreateModal = () => {
    setEditingAddress(null);
    handleOpenModal(() => {
      setEditingAddress(null);
      handleCloseModal();
    });
  };

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    handleOpenModal();
  };

  const handleDelete = (addrId) => {
    handleDeleteAddress(addrId, () => {
      setEditingAddress(null);
      handleCloseModal();
    });
  };

  const hasAnyAddress = addresses && addresses.length > 0;

  return(
    <Box className=" ou-m-auto ou-rounded">
      <Helmet>
        <title>{t('register:addressInfo')} - OUpharmacy</title>
      </Helmet>
      <Box  className="ou-m-auto ou-px-8 ou-py-4 ">
          <Typography className="ou-text-center ou-text-[#1D4ED8] !ou-text-2xl ou-font-semibold">
              {t('addressInfo')}
          </Typography>
          {isLoading ? (
            <Typography className="ou-text-center ou-mt-4">
              ...
            </Typography>
          ) : hasAnyAddress ? (
            <Box className="ou-mt-4">
              <Box className="ou-flex ou-justify-end ou-mb-4">
                <Button
                  className="!ou-min-w-[150px]"
                  variant="contained"
                  color="primary"
                  onClick={handleOpenCreateModal}
                >
                  {t('addAddress')}
                </Button>
              </Box>
              {addresses.map((addr) => (
                <Paper
                  key={addr.id}
                  className="ou-mb-2 ou-p-3 ou-flex ou-flex-col ou-gap-1.5"
                  elevation={1}
                >
                  <Box className="ou-flex ou-justify-between ou-items-start ou-gap-2 ou-flex-wrap">
                    <Box className="ou-flex-1 ou-min-w-0">
                      <Typography variant="body2" className="ou-font-medium ou-line-clamp-2">
                        {addr.address}
                      </Typography>
                      {(addr.city_info?.name || addr.district_info?.name) && (
                        <Typography variant="caption" color="text.secondary" className="ou-block ou-mt-0.5">
                          {[addr.district_info?.name, addr.city_info?.name].filter(Boolean).join(', ')}
                        </Typography>
                      )}
                    </Box>
                    {addr.is_default && (
                      <Chip
                        label={t('common:default')}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600, flexShrink: 0 }}
                      />
                    )}
                  </Box>
                  <Box className="ou-flex ou-justify-end ou-flex-wrap ou-gap-1.5 ou-mt-1">
                    {!addr.is_default && (
                      <Button size="small" variant="contained" color="success" onClick={() => handleSetDefaultAddress(addr.id, () => {handleCloseModal();
                      })}>
                        {t('setDefaultAddress')}
                      </Button>
                    )}
                    <Button size="small" variant="outlined" onClick={() => handleEditAddress(addr)}>
                      {t('editAddress')}
                    </Button>
                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(addr.id)}>
                      {t('deleteAddress')}
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Box className="ou-mt-4">
              <Typography className="ou-text-center ou-mb-4">
                {t('noAddressFound')}
              </Typography>
              <UpdateAddressInfo onSubmit={handleSubmit}/>
            </Box>
          )}   
      </Box>
      <CustomModal
        title={<span className="ou-text-[#1D4ED8] ou-text-2xl">
          {t('updateAddressInfo')}</span>}
        className="ou-text-center ou-w-full"
        open={isOpen}
        onClose={handleCloseModal}
        content={
            <UpdateAddressInfo onSubmit={handleSubmit} initialAddress={editingAddress}/>
        }/>
    </Box>
  )
}

export default ProfileAddressInfo