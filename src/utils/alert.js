import Swal from 'sweetalert2'

export const useAlert = () => {
  const showAlert = ( title, showConfirm, text = '') => {
    if (showConfirm) {
      return Swal.fire({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: '確定',
        cancelButtonText: '取消'
      })
    }

    return Swal.fire({
      title
    })
  }

  return { showAlert }
}