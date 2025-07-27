import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import {REGEX_NUMBER999, REGEX_ADDRESS, REGEX_NAME, REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_NOTE, REGEX_POS_NUM, REGEX_STRONG_PASSWORD} from "../lib/constants"


const SchemaModels = () => {
    const {t} = useTranslation(['yup-validate', 'modal', 'prescription-detail'])

    const medicineSubmitUpdateSchema = Yup.object({
        medicineSubmit: Yup.array().of(
            Yup.object().shape({
                uses: Yup.string().trim()
                    .required(t('yupUsesRequired'))
                    .max(100, t('yupUsesMaxLength'))
                    .matches(REGEX_ADDRESS, t('yupUsesInvalid')),
                quantity: Yup.string(t('yupQuantityNumber')).trim()
                    .max(3, t('yupQuantityMax'))
                    .required(t('yupQuantityRequired'))
                    .matches(REGEX_NUMBER999, t('yupQuantityInvalid')),
            })
        )
    });

    const addingPatientSchema = Yup.object().shape({
        firstName: Yup.string().trim()
            .required(t('yupFirstNameRequired'))
            .max(150, t('yupFirstNameMaxLength'))
            .matches(REGEX_NAME, t('yupFirstNameInvalid')),

        lastName: Yup.string().trim()
            .required(t('yupLastNameRequired'))
            .max(150, t('yupLastNameMaxLength'))
            .matches(REGEX_NAME, t('yupLastNameInvalid')),

        email: Yup.string().trim()
            .required(t('yupEmailRequired'))
            .max(254, t('yupEmailMaxLength'))
            .matches(REGEX_EMAIL, t('yupEmailInvalid')),

        phoneNumber: Yup.string().trim()
            .required(t('yupPhoneNumberRequired'))
            .matches(REGEX_PHONE_NUMBER, t('yupPhoneNumberInvalid')),
            
        address: Yup.string().trim()
            .required(t('yupAddressRequired'))
            .matches(REGEX_ADDRESS, t('yupAddressInvalid')),

        dateOfBirth: Yup.string()
            .required(t('yupDOBRequired')),

        gender: Yup.string()
        .required(t('yupGenderRequired')),
           
    });

    const medicineUnitSchema = Yup.object().shape({
        name: Yup.string().trim()
            .required(t('yupMedicineNameRequired'))
            .max(254, t('yupMedicineNameMaxLength', {max: 254})),

        effect: Yup.string().trim()
            .required(t('yupMedicineEffectRequired'))
            .max(254, t('yupMedicineEffectMaxLength', {max: 254})),
            
        contraindications: Yup.string().trim()
            .required(t('yupMedicineContraindicationsRequired'))
            .max(254, t('yupMedicineContraindicationsMaxLength', {max: 254})),

        price: Yup.string().trim()
            .required(t('yupPriceRequired')),
            
        inStock: Yup.string().trim()
            .required(t('yupQuantityRequired'))
            .matches(REGEX_POS_NUM, t('yupQuantityInvalid')),

        packaging: Yup.string().trim()
            .required(t('yupMedicinePackagingRequired'))
            .matches(REGEX_NOTE, t('yupMedicinePackagingInvalid')),
           
    });

    const timeSlotSchema = Yup.object().shape({
            description: Yup.string().trim()
                .required(t('yupDescriptionRequired'))
                .max(254, t('yupDescriptionMaxLength'))
                .matches(REGEX_NOTE, t('yupDescriptionInvalid')),
            
            selectedTime: Yup.object().shape({
                scheduleID: Yup.string().required(t('yupCreatedTimeRequired')),
                start: Yup.string().required(t('yupCreatedTimeRequired')),
                end: Yup.string().required(t('yupCreatedTimeRequired'))
            }),
    
            selectedDate: Yup.string()
                .required(t('yupCreatedDateRequired'))
               
    });

    const registerSchema = Yup.object().shape({
        firstName: Yup.string().trim()
            .required(t('yupFirstNameRequired'))
            .max(254, t('yupFirstNameMaxLength'))
            .matches(REGEX_NAME, t('yupFirstNameInvalid')),
        lastName: Yup.string().trim()
            .required((t('yupLastNameRequired')))
            .max(254,  t('yupLastNameMaxLength'))
            .matches(REGEX_NAME, t('yupLastNameInvalid')),
        email: Yup.string().trim()
            .required(t('yupEmailRequired'))
            .max(254, t('yupEmailMaxLength'))
            .matches(REGEX_EMAIL, t('yupEmailInvalid')),
        dob:  Yup.string().trim(),
        password: Yup.string().trim()
            .required(t('yupPasswordRequired'))
            .matches(REGEX_STRONG_PASSWORD, t('yupNewPasswordRegex'))
            .max(128, t('yupPasswordMaxLength')),
        confirmPassword: Yup.string().trim()
            .required(t('yupConfirmPasswordRequire'))
            .oneOf([Yup.ref("password")], t('yupConfirmPasswordMatch')),
        phoneNumber: Yup.string().trim()
            .required(t('yupPhoneNumberRequired'))
            .matches(REGEX_PHONE_NUMBER, t('yupPhoneNumberInvalid')),
        location: Yup.object().shape({
            address: Yup.string().required(t('yupAddressRequired')),
            city: Yup
                .number().moreThan(0, t('yupCityNumber'))
                .required(t('yupCityRequired')),
            district: Yup
            .number().moreThan(0, t('yupDistrictNumber'))
            .required(t('yupDistrictRequired')),
        })
        
    });

    const contactSchema = Yup.object().shape({

        name: Yup.string().trim()
            .required(t('yupNameRequired'))
            .max(254, t('yupNameMaxLength'))
            .matches(REGEX_NAME, t('yupNameInvalid')),
            
        email: Yup.string().trim()
            .required(t('yupEmailRequired'))
            .max(254, t('yupEmailMaxLength'))
            .matches(REGEX_EMAIL, t('yupEmailInvalid')),
        phone: Yup.string().trim(),
        subject: Yup.string().trim(),
        message: Yup.string().trim()
            .required(t('yupMessageRequired'))
            .max(254, t('yupMessageMaxLength'))
            .matches(REGEX_NOTE, t('yupMessageInvalid')),
    });

    const medicineLineItemSchema = Yup.object().shape({
        uses: Yup.string().trim()
            .required(t('yupUsesRequired'))
            .max(100, t('yupUsesMaxLength'))
            .matches(REGEX_ADDRESS,t('yupUsesInvalid')),
        quantity: Yup.string(t('yupQuantityNumber')).trim()
            .max(3, t('yupQuantityMax'))
            .required(t('yupQuantityRequired'))
            .matches(REGEX_NUMBER999,t('yupQuantityInvalid')),
    });

    return {
        medicineSubmitUpdateSchema, timeSlotSchema,
        addingPatientSchema, medicineUnitSchema, 
        registerSchema, contactSchema, medicineLineItemSchema
    }
}

export default SchemaModels