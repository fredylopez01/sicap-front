import Swal from "sweetalert2";

export function showAlert(
  message: string,
  type: "success" | "error" | "warning" = "error"
) {
  Swal.fire({
    text: message,
    icon: type,
    confirmButtonColor:
      type === "success"
        ? "#10b981"
        : type === "warning"
        ? "#fb8500"
        : "#d90429",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: true,
  });
}
