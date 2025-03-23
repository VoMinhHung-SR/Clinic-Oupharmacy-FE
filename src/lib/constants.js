export const ROLE_ADMIN = "ROLE_ADMIN"
export const ROLE_DOCTOR = "ROLE_DOCTOR"
export const ROLE_NURSE = "ROLE_NURSE"
export const ROLE_USER = "ROLE_USER"

// === REGEX === 
export const REGEX_STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/
export const REGEX_EMAIL =
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_NAME = /^([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ\s]+)$/;
export const REGEX_ADDRESS = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ0-9,-/;|:\s]*$/;
export const REGEX_PHONE_NUMBER =
/^(0|\+?84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/;
export const REGEX_NOTE = /^([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ0-9\s]+)*(""|;|:|~|!|@|#|\$|%|\^|\?|,|\.|&|\s)*([a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệếỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựýỳỵỷỹ0-9\s]+)*$/;
export const REGEX_NUMBER999 = /^([1-9]|[1-9][0-9]|[1-9][0-9][0-9])*$/;
export const REGEX_POS_NUM = /^[1-9]\d*$/

// Personal status constant
export const STATUS_BOOKING_CONFIRMED = 161
export const STATUS_BOOKING_WAS_PRESCRIBED = 162
export const STATUS_BOOKING_DONE = 1610

// firebase constant
export const FIREBASE_APIKEY = import.meta.env.VITE_APIKEY
export const FIREBASE_AUTHDOMAIN = import.meta.env.VITE_AUTHDOMAIN
export const FIREBASE_DATABASEURL = import.meta.env.VITE_DATABASEURL
export const FIREBASE_PROJECTID = import.meta.env.VITE_PROJECTID
export const FIREBASE_STOREAGEBUCKET = import.meta.env.VITE_STOREAGEBUCKET
export const FIREBASE_MESSAGINGSENDERID = import.meta.env.VITE_MESSAGINGSENDERID
export const FIREBASE_APPID = import.meta.env.VITE_APPID
export const FIREBASE_MEASUREMENTID = import.meta.env.VITE_MEASUREMENTID

// Default params constant
export const APP_ENV = import.meta.env.VITE_APP_ENV
export const CURRENT_DATE = new Date();
export const SERVER = import.meta.env.VITE_SERVER
export const MAPGL_TOKEN = import.meta.env.VITE_MAPGL_ACCESSTOKEN
export const GOONGMAP_APITOKEN = import.meta.env.VITE_GOONGMAP_APIKEY
export const GOONGMAP_MAPTOKEN = import.meta.env.VITE_GOONGMAP_MAYKEY
export const MAX_EXAM_PER_DAY = 30

export const BACKEND_BASEURL = 'http://127.0.0.1:8000'
export const PRD_BACKEND_BASEURL = 'https://oupharmacy-vominhhung.up.railway.app'

export const ERROR_CLOUDINARY = 'https://res.cloudinary.com/dl6artkyb/null'
export const AVATAR_DEFAULT = 'https://res.cloudinary.com/dl6artkyb/image/upload/v1666353307/OUPharmacy/logo_oupharmacy_kz2yzd.png'
export const ORIGIN_LAT = 10.816905962180005
export const ORIGIN_LNG = 106.6786961439645
// Toast constant
export const TOAST_SUCCESS = "success"
export const TOAST_ERROR = "error"
export const TOAST_WARNING = "warning"