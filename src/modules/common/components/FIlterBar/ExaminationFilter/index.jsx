import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, Tooltip }  from '@mui/material';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
const ExaminationFilter = (props) => {
    const {t} = useTranslation(['yup-validate', 'examinations'])
    const methods = useForm({
        mode:"onSubmit", 
        defaultValues:{
            mailStatus: props.mailStatus ? props.mailStatus : 0,
            createdDate: props.createdDate ? props.createdDate : 0,
            kw: props.kw ? props.kw : '',
            hasDiagnosis: props.hasDiagnosis ? props.hasDiagnosis : 0,
        }
    })
    return (
    <>
        <Box className='ou-px-3 ou-mb-3'>
            <form onSubmit={methods.handleSubmit((data) => props.onSubmit(data))} className='ou-flex ou-items-center ou-mt-5 ou-mb-3'>
            
                <FormControl className='!ou-min-w-[100px] !ou-mr-3'>
                    <InputLabel id="exam_filter_createdDate">{t('examinations:createdDate')}</InputLabel>
                        <Select

                            id="exam_filter_created_date_label"      
                            name="createdDate"
                            label={('examinations:createdDate')}
                            defaultValue={props.createdDate ? props.createdDate : 0}
                            {...methods.register("createdDate")} 
                        >
                                <MenuItem value={0}>{t('examinations:descending')}</MenuItem>
                            <MenuItem value={1}>{t('examinations:ascending')}</MenuItem>
                        </Select>
                </FormControl>

                <FormControl className='!ou-min-w-[100px] !ou-mr-3'>
                    <InputLabel id="exam_filter_email">{t('examinations:mailStatus')}</InputLabel>
                        <Select
                            id="exam_filter_email_label"      
                            name="mailStatus"
                            label={('examinations:mailStatus')}
                            defaultValue={props.mailStatus ? props.mailStatus : 0}
                            {...methods.register("mailStatus")} 
                        >
                            <MenuItem value={0}>{t('examinations:all')}</MenuItem>
                            <MenuItem value={1}>{t('examinations:sent')}</MenuItem>
                            <MenuItem value={-1}>{t('examinations:noSent')}</MenuItem>
                        </Select>
                </FormControl>

                <FormControl className='!ou-min-w-[100px] !ou-mr-3'>
                    <InputLabel id="exam_filter_email">{t('examinations:hasDiagnosis')}</InputLabel>
                        <Select
                            id="exam_filter_has_diagnosis_label"      
                            name="hasDiagnosis"
                            label={('examinations:hasDiagnosis')}
                            defaultValue={props.hasDiagnosis ? props.hasDiagnosis : 0}
                            {...methods.register("hasDiagnosis")} 
                        >
                            <MenuItem value={0}>{t('examinations:all')}</MenuItem>
                            <MenuItem value={1}>{t('examinations:yes')}</MenuItem>
                            <MenuItem value={-1}>{t('examinations:no')}</MenuItem>
                        </Select>
                </FormControl>


                <FormControl  className=' !ou-mr-3'>
                    <TextField
                        required={false}
                        variant="outlined"
                        label={t('examinations:filterUserLabel')}
                        {...methods.register("kw")} 
                    />

                </FormControl>
                
                <Tooltip title={t('examinations:search')} followCursor>
                    <Button variant="outlined" 
                        color="success" 
                        type="submit" 
                        className='!ou-p-3.5'
                    >
                        <SearchIcon fontSize='medium'/>
                    </Button>
                </Tooltip>
            </form>
        </Box>
        
    </>

    )

}

export default ExaminationFilter