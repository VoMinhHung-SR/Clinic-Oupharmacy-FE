import { Box, Container, FormControl, IconButton, InputLabel, OutlinedInput, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../../common/components/Loading";
import useBooking from "../hooks/useBooking";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send';

const FormAddEmail = () => {
    const { t, ready } = useTranslation(['booking','common'])

    const {checkEmail, checkPatientExistSchema, isFormEmailOpen} = useBooking()

    if (!ready)
        return <Box sx={{ minHeight: "300px" }}>
            <Box className='ou-p-5'>
                <Loading></Loading>
            </Box>
        </Box>;

    const methods = useForm({
        mode:"onSubmit",
        resolver: yupResolver(checkPatientExistSchema),
        defaultValues:{
            email:""
        }
    })
    return (
        <>
        {
            isFormEmailOpen ? <Box className="ou-w-[60%] ou-max-w-[600px] ou-m-auto" component={Paper} elevation={6}>        
                           <div className="ou-mb-8">
                                <form className="!mb-5 p-4 " onSubmit={methods.handleSubmit(checkEmail)} style={{"margin": "auto",
                                "padding": "20px 20px", "borderRadius": "5px" }}>
                                    <FormControl fullWidth >
                                        <InputLabel htmlFor="email">{t('enterEmail')}</InputLabel>
                                        <OutlinedInput
                                            autoComplete="given-name"
                                            id="email"
                                            name="email"
                                            label={t('enterEmail')}
                                            endAdornment={
                                                <IconButton position="start" type='submit' >
                                                    <SendIcon />
                                                </IconButton>
                                            }
                                            error={methods.formState.errors.email}
                                            {...methods.register("email")}
                                            />
                                        {methods.formState.errors ? (<span className="ou-text-xs ou-text-red-600 ou-mt-1">{methods.formState.errors.email?.message}</span>) : <></>}
                                    </FormControl>
                                </form>                   
                            
                            </div>
                        </Box>
        : <></> }
        </>
    )
}

export default FormAddEmail