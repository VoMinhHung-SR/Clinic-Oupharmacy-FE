import Swal from 'sweetalert2'

const SuccessfulAlert = (title, confirmButtonText = 'Okay', callback) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'ou-px-8 ou-py-3 ou-ml-3 !ou-bg-green-700 !ou-text-white !ou-rounded'
        }, buttonsStyling: true
    });

    swalWithBootstrapButtons.fire({
        position: 'center', icon: 'success', title: title, showConfirmButton: true, confirmButtonText: confirmButtonText
    }).then(callback);
};

export const ErrorAlert = (title, text, confirmButtonText = 'Okay') => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'ou-px-8 ou-py-3 !ou-bg-green-700 !ou-text-white !ou-rounded'
        }, buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
        icon: 'error', title: title, text: text, showConfirmButton: true, confirmButtonText: confirmButtonText
    });
};

export const ConfirmAlert = (title, text, confirmButtonText = 'Okay', cancelButtonText, callBackYes, callBackNo) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            popup: '!ou-z-1500',
            confirmButton: 'ou-px-8 ou-py-3 ou-ml-3 !ou-bg-green-700 !ou-text-white !ou-rounded', 
            cancelButton: '!ou-rounded ou-px-8 ou-py-3 ou-p5 !ou-bg-red-700 ou-mr-5 !ou-text-white',
        }, buttonsStyling: true
    });

    swalWithBootstrapButtons.fire({
        title: `<span style="font-size: 1.5em;">${title}</span>`,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        reverseButtons: true
    }).then(function (result){
        if(result.isConfirmed)
            callBackYes();
        else
            callBackNo();
    });
};

export default SuccessfulAlert