import { toast } from "react-toastify";

const createToastMessage = ({ type, message }) => {
    const toastConfig = {
      autoClose: 1500,
      hideProgressBar: false,
      newestOnTop: true,
      closeOnClick: true,
      rtl: false,
      pauseOnFocusLoss: true,
      draggable: true,
      pauseOnHover: true,
    };
  
    const showToast = () => {
      switch (type) {
        case 'error':
           toast.error(message, toastConfig);
           break;
        case 'warning':
           toast.warning(message, toastConfig);
           break;
        case 'success':
           toast.success(message, toastConfig);
           break;
        default:
           toast(message, toastConfig);
      }
    };
  
    showToast();
  
    return null;
  };
  
  export default createToastMessage;