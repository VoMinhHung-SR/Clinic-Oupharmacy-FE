import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, Tooltip, useMediaQuery, useTheme }  from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

const DiagnosisFilter = ({onSubmit, hasPayment, createdDate, hasPrescription, patientName, doctorName}) => {
    const {t} = useTranslation(['yup-validate', 'prescription', 'common'])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const methods = useForm({
        mode:"onSubmit", 
        defaultValues:{
            createdDate: createdDate ? createdDate : 0,
            hasPrescription: hasPrescription ? hasPrescription : 0,
            hasPayment: hasPayment ? hasPayment : 0,
            patientName: patientName ? patientName : '',
            doctorName: doctorName ? doctorName : '',
        }
    })
    return (
    <>
        <Box className='ou-px-3 ou-mb-3'>
            <form onSubmit={methods.handleSubmit((data) => onSubmit(data))} 
                className={`ou-mt-5 ou-mb-3 ${isTablet ? 'ou-flex ou-flex-col ou-gap-4' : 'ou-flex ou-flex-wrap ou-items-center ou-gap-2'}`}>
            
                {isTablet ? (
                    <>
                        <div className="ou-flex ou-flex-wrap ou-gap-2">
                            <FormControl className="!ou-min-w-[100px] ou-flex-1">
                                <InputLabel id="prescription_filter_diagnosisDate">{t('prescription:diagnosisDate')}</InputLabel>
                                <Select
                                    id="prescription_filter_diagnosis_date_label"      
                                    name="diagnosisDate"
                                    label={t('prescription:diagnosisDate')}
                                    defaultValue={createdDate ? createdDate : 0}
                                    {...methods.register("createdDate")} 
                                >
                                    <MenuItem value={0}>{t('prescription:descending')}</MenuItem>
                                    <MenuItem value={1}>{t('prescription:ascending')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl className="!ou-min-w-[100px] ou-flex-1">
                                <InputLabel id="prescription_filter_email">{t('prescription:prescribing')}</InputLabel>
                                <Select
                                    id="prescription_filter_prescribing_label"      
                                    name="prescribing"
                                    label={t('prescription:prescribing')}
                                    defaultValue={hasPrescription ? hasPrescription : 0}
                                    {...methods.register("hasPrescription")} 
                                >
                                    <MenuItem value={0}>{t('prescription:all')}</MenuItem>
                                    <MenuItem value={1}>{t('prescription:yes')}</MenuItem>
                                    <MenuItem value={-1}>{t('prescription:no')}</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl className="!ou-min-w-[100px] ou-flex-1">
                                <InputLabel id="prescription_filter_email">{t('prescription:payment')}</InputLabel>
                                <Select
                                    id="prescription_filter_has_payment_label"      
                                    name="payment"
                                    label={t('prescription:payment')}
                                    defaultValue={hasPayment ? hasPayment : 0}
                                    {...methods.register("hasPayment")} 
                                >
                                    <MenuItem value={0}>{t('prescription:all')}</MenuItem>
                                    <MenuItem value={1}>{t('prescription:yes')}</MenuItem>
                                    <MenuItem value={-1}>{t('prescription:no')}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className="ou-flex ou-flex-wrap ou-gap-2">
                            <FormControl className="ou-flex-1">
                                <TextField
                                    required={false}
                                    variant="outlined"
                                    label={t('prescription:patientName')}
                                    {...methods.register("patientName")} 
                                />
                            </FormControl>
                            
                            <FormControl className="ou-flex-1">
                                <TextField
                                    required={false}
                                    variant="outlined"
                                    label={t('prescription:doctorName')}
                                    {...methods.register("doctorName")} 
                                />
                            </FormControl>
                        </div>
                        
                        <div className={`ou-flex ou-justify-end ${isTablet ? 'ou-w-full' : ''}`}>
                            <Tooltip title={t('prescription:search')} followCursor>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    type="submit"
                                    className={`!ou-p-3.5 ${isTablet ? 'ou-w-full' : ''}`}
                                >
                                    <SearchIcon fontSize='medium'/>
                                </Button>
                            </Tooltip>
                        </div>
                    </>
                ) : (
                    <>
                        <FormControl className="!ou-min-w-[100px] !ou-mr-3">
                            <InputLabel id="prescription_filter_diagnosisDate">{t('prescription:diagnosisDate')}</InputLabel>
                            <Select
                                id="prescription_filter_diagnosis_date_label"      
                                name="diagnosisDate"
                                label={t('prescription:diagnosisDate')}
                                defaultValue={createdDate ? createdDate : 0}
                                {...methods.register("createdDate")} 
                            >
                                <MenuItem value={0}>{t('prescription:descending')}</MenuItem>
                                <MenuItem value={1}>{t('prescription:ascending')}</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className="!ou-min-w-[100px] !ou-mr-3">
                            <InputLabel id="prescription_filter_email">{t('prescription:prescribing')}</InputLabel>
                            <Select
                                id="prescription_filter_prescribing_label"      
                                name="prescribing"
                                label={t('prescription:prescribing')}
                                defaultValue={hasPrescription ? hasPrescription : 0}
                                {...methods.register("hasPrescription")} 
                            >
                                <MenuItem value={0}>{t('prescription:all')}</MenuItem>
                                <MenuItem value={1}>{t('prescription:yes')}</MenuItem>
                                <MenuItem value={-1}>{t('prescription:no')}</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className="!ou-min-w-[100px] !ou-mr-3">
                            <InputLabel id="prescription_filter_email">{t('prescription:payment')}</InputLabel>
                            <Select
                                id="prescription_filter_has_payment_label"      
                                name="payment"
                                label={t('prescription:payment')}
                                defaultValue={hasPayment ? hasPayment : 0}
                                {...methods.register("hasPayment")} 
                            >
                                <MenuItem value={0}>{t('prescription:all')}</MenuItem>
                                <MenuItem value={1}>{t('prescription:yes')}</MenuItem>
                                <MenuItem value={-1}>{t('prescription:no')}</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className="!ou-mr-3">
                            <TextField
                                required={false}
                                variant="outlined"
                                label={t('prescription:patientName')}
                                {...methods.register("patientName")} 
                            />
                        </FormControl>
                        
                        <FormControl className="!ou-mr-3">
                            <TextField
                                required={false}
                                variant="outlined"
                                label={t('prescription:doctorName')}
                                {...methods.register("doctorName")} 
                            />
                        </FormControl>
                        
                        <div className={`ou-flex ou-justify-end ${isTablet ? 'ou-w-full' : ''}`}>
                            <Tooltip title={t('prescription:search')} followCursor>
                                <Button
                                    variant="outlined"
                                    color="success"
                                    type="submit"
                                    className={`!ou-p-3.5 ${isTablet ? 'ou-w-full' : ''}`}
                                >
                                    <SearchIcon fontSize='medium'/>
                                </Button>
                            </Tooltip>
                        </div>
                    </>
                )}
            </form>
        </Box>
    </>
    )
}

export default DiagnosisFilter