import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Button,
  Tooltip,
} from "@mui/material"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import Loading from "../../../modules/common/components/Loading"
import FormAddPatient from "../../../modules/pages/BookingComponents/FormAddPatient"
import moment from "moment"
import usePatient from "../../../lib/hooks/usePatient"
import EditIcon from "@mui/icons-material/Edit"
import CustomModal from "../../../modules/common/components/Modal"
import useCustomModal from "../../../lib/hooks/useCustomModal"
import { useState } from "react"
import BackdropLoading from "../../../modules/common/components/BackdropLoading"
import AddIcon from "@mui/icons-material/Add"
import PersonIcon from "@mui/icons-material/Person"

const choiceCardSx = (selected) => ({
  width: { xs: "100%", sm: "calc(50% - 8px)" },
  maxWidth: { xs: "100%", sm: 280 },
  minHeight: { xs: 120, sm: 160 },
  px: 2,
  py: { xs: 2, sm: 3 },
  borderRadius: 2,
  border: 2,
  borderColor: selected ? "primary.main" : "divider",
  bgcolor: selected ? "rgba(37, 99, 235, 0.06)" : "background.paper",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 1.5,
  transition: "border-color 0.2s ease, background-color 0.2s ease",
  "&:hover": {
    borderColor: "primary.main",
  },
})

const PatientManagement = () => {
  const { patientList, isLoading } = usePatient()
  const { t, tReady } = useTranslation(["booking", "common", "modal"])
  const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal()
  const [patient, setPatient] = useState(null)
  const [isAddNewPatient, setIsAddNewPatient] = useState(true)
  const [step, setStep] = useState(1)

  if (tReady) {
    return (
      <Box sx={{ minHeight: 240 }}>
        <Helmet>
          <title>Patient Management</title>
        </Helmet>
        <Loading />
      </Box>
    )
  }

  const openModal = (p) => {
    handleOpenModal()
    setPatient(p)
  }

  const renderFirstState = () => {
    if (isLoading) return <BackdropLoading />

    const choices = [
      {
        key: "new",
        selected: isAddNewPatient === true,
        onClick: () => setIsAddNewPatient(true),
        icon: <AddIcon sx={{ fontSize: { xs: 40, sm: 56 }, color: "primary.main" }} />,
        label: t("booking:addingNewPatient"),
      },
    ]

    if (patientList.length !== 0) {
      choices.push({
        key: "existing",
        selected: isAddNewPatient === false,
        onClick: () => setIsAddNewPatient(false),
        icon: <PersonIcon sx={{ fontSize: { xs: 40, sm: 56 }, color: "primary.main" }} />,
        label: t("booking:existingPatient"),
      })
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          py: 2,
        }}
      >
        {choices.map((c) => (
          <Box
            key={c.key}
            component="button"
            type="button"
            onClick={c.onClick}
            sx={choiceCardSx(c.selected)}
          >
            {c.icon}
            <Typography sx={{ fontWeight: 600, textAlign: "center" }}>{c.label}</Typography>
          </Box>
        ))}
      </Box>
    )
  }

  const renderSecondState = () => {
    if (isAddNewPatient) {
      return (
        <>
          <Box sx={{ py: 1 }}>
            <FormAddPatient />
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>{renderButtonStep()}</Box>
        </>
      )
    }

    return (
      <Box>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table aria-label="patients table" sx={{ minWidth: 720 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("fullName")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("phoneNumber")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("email")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("gender")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("dateOfBirth")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("address")}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  {t("common:function")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientList.map((p) => (
                <TableRow key={p.id}>
                  <TableCell
                    align="center"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {p.first_name + " " + p.last_name}
                  </TableCell>
                  <TableCell align="center">{p.phone_number}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {p.email}
                  </TableCell>
                  <TableCell align="center">
                    {p.gender === 0
                      ? t("booking:man")
                      : p.gender === 1
                        ? t("booking:woman")
                        : t("common:secret")}
                  </TableCell>
                  <TableCell align="center">{moment(p.date_of_birth).format("DD/MM/YYYY")}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    title={p.address}
                  >
                    {p.address}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip followCursor title={t("common:edit")}>
                      <Button
                        variant="contained"
                        size="small"
                        className="!ou-min-w-0 !ou-p-1.5"
                        color="primary"
                        onClick={() => openModal(p)}
                      >
                        <EditIcon sx={{ fontSize: 22 }} />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>{renderButtonStep()}</Box>
      </Box>
    )
  }

  const renderButtonStep = () => {
    if (step === 1) {
      return (
        <Button variant="contained" color="primary" onClick={() => setStep(2)} sx={{ minWidth: 120 }}>
          {t("booking:next")}
        </Button>
      )
    }
    if (step === 2) {
      return (
        <Button variant="outlined" color="primary" onClick={() => setStep(1)} sx={{ minWidth: 120 }}>
          {t("booking:previous")}
        </Button>
      )
    }
    return null
  }

  return (
    <>
      <Helmet>
        <title>{t("common:patientManagement")} - OUpharmacy</title>
      </Helmet>

      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 600, mb: 2, textAlign: "center" }}
      >
        {t("common:patientManagement")}
      </Typography>

      <Box sx={{ position: "relative", width: "100%" }}>
        {step === 1 && renderFirstState()}
        {step === 2 && renderSecondState()}
        {step === 1 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>{renderButtonStep()}</Box>
        )}
      </Box>

      {patient && (
        <CustomModal
          className="ou-text-center"
          open={isOpen}
          onClose={handleCloseModal}
          content={
            <Box>
              <FormAddPatient
                patientData={patient}
                onCallbackSuccess={() => {
                  setStep(1)
                  handleCloseModal()
                }}
              />
            </Box>
          }
          actions={[
            <Button key="cancel" onClick={handleCloseModal}>
              {t("modal:cancel")}
            </Button>,
          ]}
        />
      )}
    </>
  )
}

export default PatientManagement
