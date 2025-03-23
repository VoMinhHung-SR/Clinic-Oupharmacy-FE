import { Box, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../../common/components/Loading";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { useContext, useState } from "react";
import { fetchChangePassword } from "../services";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import { REGEX_STRONG_PASSWORD, TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants";
import UserContext from "../../../../lib/context/UserContext";
import BackdropLoading from "../../../common/components/BackdropLoading";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormChangePassword = ({callBack=()=> {}}) => {
    const { t, ready } = useTranslation(['common', 'yup-validate'])
    const [isLoading, setIsLoading] = useState(false)
    const [newPasswordShow, setNewPasswordShow] = useState(false)
    const [confirmNewPasswordShow, setConfirmNewPasswordShow] = useState(false)

    const {user} = useContext(UserContext)

    const changePasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
        .required(t('yup-validate:yupNewPasswordRequired'))
        .min(8, t('yup-validate:yupNewPasswordMinLength'))
        .matches(REGEX_STRONG_PASSWORD, t('yup-validate:yupNewPasswordRegex')),
        reEnterPassword: Yup.string()
            .required(t('yup-validate:yupConfirmPasswordRequire'))
            .oneOf([Yup.ref('newPassword'), null], t('yup-validate:yupConfirmPasswordMatch')),
    });

    const methods = useForm({
        mode:"onSubmit",
        resolver: yupResolver(changePasswordSchema),
        defaultValues:{
            newPassword: '',
            reEnterPassword: ''
        }
    })

    if (!ready)
        return <Box sx={{ minHeight: "300px" }}>
            <Box className='ou-p-5'>
                <Loading></Loading>
            </Box>
        </Box>;

    const changePassword = async (newPass) => {
        const res = await fetchChangePassword(newPass, user.id)
        if (res.status === 200)
           return createToastMessage({message:t('common:updateSuccess'), type:TOAST_SUCCESS})
    }

    const onSubmit = (data) => {
        try{
            setIsLoading(true)
            let newPass = data.newPassword
            changePassword(newPass)
        } catch (ex) {
            return createToastMessage({message:t('common:updateFailed'), type:TOAST_ERROR})
        } finally {
            setIsLoading(false)
            callBack()
        }
    };

    return (
        <>
            {isLoading && <BackdropLoading/>}
            <h3 className="ou-text-center ou-mb-5">{t('common:changePassword')}</h3>
             <form className="!mb-5 p-4 " onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
                    <FormControl fullWidth className="!ou-mb-3">
                        <InputLabel htmlFor="newPassword">{t('common:newPassword')}</InputLabel>
                        <OutlinedInput
                            id="newPassword"
                            type={newPasswordShow ? 'text' : 'password'}
                            name="newPassword"
                            label={t('common:newPassword')}
                            error={!!methods.formState.errors.newPassword}
                            {...methods.register('newPassword')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setNewPasswordShow(!newPasswordShow)}
                                    edge="end"
                                    >
                                    {newPasswordShow ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                          />
                          {methods.formState.errors.newPassword && (
                            <span className="ou-text-xs ou-text-red-600 ou-mt-1">
                              {methods.formState.errors.newPassword.message}
                            </span>
                          )}
                    </FormControl>

                    <FormControl fullWidth className="!ou-mb-3">
                        <InputLabel htmlFor="reEnterNewPassword">{t('reEnterNewPassword')}</InputLabel>
                        <OutlinedInput
                            id="reEnterNewPassword"
                            name="reEnterNewPassword"
                            type={confirmNewPasswordShow ? 'text' : 'password'}
                            label={t('reEnterNewPassword')}
                            error={!!methods.formState.errors.reEnterPassword}
                            {...methods.register('reEnterPassword')}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setConfirmNewPasswordShow(!confirmNewPasswordShow)}
                                    edge="end"
                                    >
                                    {confirmNewPasswordShow ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                        />
                        
                            {methods.formState.errors.reEnterPassword && (
                                <span className="ou-text-xs ou-text-red-600 ou-mt-1">
                                {methods.formState.errors.reEnterPassword.message}
                                </span>
                            )}
                    </FormControl>
                    
                    <div className="ou-w-full ou-text-right">
                        <Button type="submit" color="success">{t('common:update')}</Button>
                    </div>
                </form>                   
        </>
    )
}

export default FormChangePassword