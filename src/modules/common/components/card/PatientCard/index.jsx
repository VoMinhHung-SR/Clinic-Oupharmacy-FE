import { Box, Grid, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../Loading"
import PersonIcon from '@mui/icons-material/Person';
import useCustomModal from "../../../../../lib/hooks/useCustomModal.js";
import CustomModal from "../../Modal.jsx";
import moment from "moment";
import { calculateAge } from "../../../../../lib/utils/helper.js";

const PatientCard = ({patientData, callBackOnClickCard = () => {}, isSelected}) => {
    const {t, tReady} = useTranslation(['booking','common'])
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    if(tReady)
        return(<Box className="!ou-mt-2">
            <Loading/>
        </Box>
    )

    const handleOnClick = () =>{
        callBackOnClickCard(patientData)
    }

    return (
    <>
        <Box
            key={"patient"+patientData.id}
            role="button"
            tabIndex={0}
            onClick={() => handleOnClick()}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleOnClick()
                }
            }}
            className="ou-w-full ou-h-full ou-flex ou-flex-col ou-justify-between ou-cursor-pointer ou-text-center"
            sx={{
                minHeight: { xs: 188, sm: 200 },
                px: { xs: 2, sm: 2.5 },
                py: { xs: 2, sm: 2.5 },
                boxSizing: "border-box",
                borderRadius: 2,
                border: "1.5px solid",
                borderColor: isSelected ? "#1D4ED8" : "#93c5fd",
                color: isSelected ? "#1D4ED8" : "#2563eb",
                bgcolor: isSelected ? "#eff6ff" : "#fff",
                opacity: isSelected ? 1 : 0.92,
                transition: "border-color 0.15s, background-color 0.15s, box-shadow 0.15s, opacity 0.15s",
                boxShadow: isSelected
                    ? "0 4px 14px rgba(29, 78, 216, 0.12)"
                    : "none",
                "&:hover": {
                    opacity: 1,
                    borderColor: "#1D4ED8",
                    boxShadow: "0 4px 12px rgba(29, 78, 216, 0.1)",
                },
            }}
        >
            <div className="ou-flex ou-flex-col ou-justify-center ou-items-center ou-flex-1">
                <PersonIcon
                    sx={{
                        fontSize: { xs: 48, sm: 56, md: 64 },
                        marginBottom: 1,
                        opacity: 0.85,
                    }}
                />
                <Box
                    sx={{
                        fontSize: { xs: "0.95rem", sm: "1.05rem" },
                        fontWeight: 700,
                        lineHeight: 1.3,
                        color: "inherit",
                    }}
                >
                    {patientData.first_name + " " + patientData.last_name}
                </Box>
                <Box
                    sx={{
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        marginTop: 0.5,
                        opacity: 0.75,
                    }}
                >
                    ({calculateAge(patientData.date_of_birth) + " " + t("booking:yearsOld")})
                </Box>
                <Box
                    sx={{
                        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                        wordBreak: "break-word",
                        marginTop: 1,
                        opacity: 0.7,
                        maxWidth: "100%",
                    }}
                >
                    {patientData.email}
                </Box>
            </div>

            <span
                role="link"
                tabIndex={0}
                className="hover:ou-text-blue-900 hover:ou-font-bold ou-underline ou-mt-3 ou-text-sm"
                onClick={(e) => {
                    e.stopPropagation()
                    handleOpenModal()
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        handleOpenModal()
                    }
                }}
            >
                {t("booking:seeDetail")}
            </span>
        </Box>

        <CustomModal
            open={isOpen}
            onClose={handleCloseModal}
            title={t("booking:patientInfo")}
            maxWidth="sm"
            content={<PatientInfoModel patientData={patientData}/>}
            actions={null}
        />
    </>
    )
}

export default PatientCard


const fieldSx = { "& .MuiInputBase-input": { py: 1.25 } }

const PatientInfoModel = ({patientData}) =>{
    const {t} = useTranslation(['booking','common'])
    const genderLabel =
        patientData.gender === 0 ? t('man')
        : patientData.gender === 1 ? t('woman')
        : t('secret')

    return (
        <Box sx={{ pt: 0.5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('firstName')}
                        defaultValue={patientData.first_name}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('lastName')}
                        defaultValue={patientData.last_name}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={7}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('email')}
                        defaultValue={patientData.email}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('phoneNumber')}
                        defaultValue={patientData.phone_number || ""}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('address')}
                        defaultValue={patientData.address || ""}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('dateOfBirth')}
                        defaultValue={moment(patientData.date_of_birth).format('YYYY-MM-DD')}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        size="small"
                        label={t('gender')}
                        defaultValue={genderLabel}
                        InputProps={{ readOnly: true }}
                        sx={fieldSx}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
