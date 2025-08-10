import { Box, Button, Grid, InputLabel, Paper, TextField, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../Loading"

const DiagnosisCard = ({id, sign, diagnosed, isLoading}) => {
    
    const {t, ready} = useTranslation(['diagnosis'])
    //TODO: add skeletons here
    if(!ready && isLoading)
        return <Box sx={{ height: "300px" }}>
        <Box className='ou-p-5'>
            <Loading/>
        </Box>
    </Box>

    if(!id)
        return   <Box className="ou-text-red-700">{t("errNullDiagnosis")}</Box>

    return <>
         <Box className="ou-mt-5" component={Paper} elevation={4}>
                <form className="ou-pt-4" >
                    <h3 className="ou-text-center ou-text-lg ou-mb-4">
                        {t('prescriptionInformation')}
                    </h3>
                    <Grid container justifyContent="flex">
                        <Grid item xs={12} className="ou-p-4">
                            <InputLabel htmlFor="diagnosed" className="ou-text-xs ou-mb-2">{t('sign')}</InputLabel>
                            <TextField
                                fullWidth
                                autoComplete="given-name"
                                id="sign"
                                name="sign"
                                type="text"
                                value={sign}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} className="ou-p-4">
                            <InputLabel htmlFor="diagnosed" className="ou-text-xs ou-mb-2">{t('diagnosed')}</InputLabel>
                            <TextField
                                fullWidth
                                autoComplete="given-name"
                                id="diagnosed"
                                name="diagnosed"
                                type="text"
                                value={diagnosed}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className="p-3">
                        <Grid item sx={{ margin: "10px auto" }}>
                            <Typography
                                variant="subtitle1"
                                gutterBottom
                                style={{ textDecoration: "inherit" }}
                                color="grey.700"
                    
                            >
                            </Typography>
                        </Grid>
                    </Grid>
                </form>

            </Box>
        </>
    }
export default DiagnosisCard