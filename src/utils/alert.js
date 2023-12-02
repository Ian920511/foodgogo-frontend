import Swal from 'sweetalert2'

export const useAlert = () => {
  const showAlert = ( icon , text = '', showConfirm) => {
    if (showConfirm) {
      return Swal.fire({
        icon,
        text,
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      })
    }

    return Swal.fire({
      icon,
      text
    })
  }

  return { showAlert }
}