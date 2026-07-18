import { Box, Button, Chip, Typography, Paper } from "@mui/material"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import CustomModal from "../../../modules/common/components/Modal"
import useCustomModal from "../../../lib/hooks/useCustomModal"
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo"
import useUserAddresses from "../../../modules/pages/ProfileComponents/hooks/useUserAddresses"
import Loading from "../../../modules/common/components/Loading"

const ProfileAddressInfo = () => {
  const { t } = useTranslation(["register", "common", "yup-validate"])
  const {
    addresses,
    isLoading,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  } = useUserAddresses()
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()
  const [editingAddress, setEditingAddress] = useState(null)

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
          setEditingAddress(null)
          handleCloseModal()
        }
      )
    } else {
      handleCreateAddress(data, setError, locationGeo, cityName, districtName, handleCloseModal)
    }
  }

  const handleOpenCreateModal = () => {
    setEditingAddress(null)
    handleOpenModal(() => {
      setEditingAddress(null)
      handleCloseModal()
    })
  }

  const handleEditAddress = (addr) => {
    setEditingAddress(addr)
    handleOpenModal()
  }

  const handleDelete = (addrId) => {
    handleDeleteAddress(addrId, () => {
      setEditingAddress(null)
      handleCloseModal()
    })
  }

  const hasAnyAddress = addresses && addresses.length > 0

  return (
    <Box>
      <Helmet>
        <title>{t("register:addressInfo")} - OUpharmacy</title>
      </Helmet>

      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 600, mb: 3, textAlign: "center" }}
      >
        {t("addressInfo")}
      </Typography>

      {isLoading ? (
        <Box sx={{ py: 4 }}>
          <Loading />
        </Box>
      ) : hasAnyAddress ? (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenCreateModal}>
              {t("addAddress")}
            </Button>
          </Box>
          {addresses.map((addr) => (
            <Paper
              key={addr.id}
              elevation={0}
              sx={{
                mb: 1.5,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, wordBreak: "break-word" }}>
                    {addr.address}
                  </Typography>
                  {(addr.city_info?.name || addr.district_info?.name) && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                      {[addr.district_info?.name, addr.city_info?.name].filter(Boolean).join(", ")}
                    </Typography>
                  )}
                </Box>
                {addr.is_default && (
                  <Chip label={t("common:default")} size="small" color="primary" sx={{ fontWeight: 600 }} />
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 1 }}>
                {!addr.is_default && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleSetDefaultAddress(addr.id, () => {
                        handleCloseModal()
                      })
                    }
                  >
                    {t("setDefaultAddress")}
                  </Button>
                )}
                <Button size="small" variant="outlined" onClick={() => handleEditAddress(addr)}>
                  {t("editAddress")}
                </Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(addr.id)}>
                  {t("deleteAddress")}
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Box>
          <Typography color="text.secondary" sx={{ textAlign: "center", mb: 3 }}>
            {t("noAddressFound")}
          </Typography>
          <UpdateAddressInfo onSubmit={handleSubmit} />
        </Box>
      )}

      <CustomModal
        title={
          <Typography component="span" sx={{ color: "primary.main", fontSize: "1.25rem", fontWeight: 600 }}>
            {t("updateAddressInfo")}
          </Typography>
        }
        className="ou-text-center ou-w-full"
        open={isOpen}
        onClose={handleCloseModal}
        content={<UpdateAddressInfo onSubmit={handleSubmit} initialAddress={editingAddress} />}
      />
    </Box>
  )
}

export default ProfileAddressInfo
