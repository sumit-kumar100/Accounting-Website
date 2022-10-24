import Swal from 'sweetalert2'

export const deleteAlert = async () => {
    const result = await Swal.fire({
        customClass: "my-sweet-alert",
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    if (result.isConfirmed) {
        return true
    }
    return false
}