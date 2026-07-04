import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.min.css"
import "./sweetAlert2.css"

const ouSwal = Swal.mixin({
  customClass: {
    container: "ou-swal-container",
    popup: "ou-swal-popup",
    title: "ou-swal-title",
    htmlContainer: "ou-swal-text",
    icon: "ou-swal-icon",
    actions: "ou-swal-actions",
    confirmButton: "ou-swal-btn ou-swal-btn--confirm",
    cancelButton: "ou-swal-btn ou-swal-btn--cancel",
  },
  buttonsStyling: false,
  reverseButtons: true,
  focusConfirm: false,
  heightAuto: true,
})

const SuccessfulAlert = ({
  title,
  description = "",
  confirmButtonText = "Okay",
  showCancelButton = false,
  cancelButtonText = "Cancel",
  callbackSuccess = () => {},
  callbackCancel = () => {},
}) => {
  ouSwal
    .fire({
      position: "center",
      icon: "success",
      title,
      text: description || "",
      showConfirmButton: true,
      confirmButtonText,
      showCancelButton,
      cancelButtonText,
      ...(showCancelButton
        ? { customClass: { cancelButton: "ou-swal-btn ou-swal-btn--neutral" } }
        : {}),
    })
    .then((result) => {
      if (result.isConfirmed) callbackSuccess()
      else callbackCancel()
    })
}

export const ErrorAlert = (title, text, confirmButtonText = "Okay") => {
  ouSwal.fire({
    icon: "error",
    title,
    text,
    showConfirmButton: true,
    confirmButtonText,
  })
}

export const ConfirmAlert = (
  title,
  text,
  confirmButtonText = "Okay",
  cancelButtonText,
  callBackYes,
  callBackNo
) => {
  ouSwal
    .fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
    })
    .then((result) => {
      if (result.isConfirmed) callBackYes()
      else callBackNo()
    })
}

export default SuccessfulAlert
