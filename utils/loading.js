import Swal from "sweetalert2";

export const ShowLoading = (title) => {
  return Swal.fire({
    allowEscapeKey: true,
    html: `<div class="flex justify-center">
            <img src="/gif/loading.gif" alt="" class="w-16">
          </div>`,
    allowOutsideClick: true,
    width: "23rem",
    showConfirmButton: true,
  });
};
export const SwalClose = () => Swal.close();
