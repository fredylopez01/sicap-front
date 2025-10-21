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

export function showConfirmAlert(
  title: string,
  text: string,
  confimationText: string,
  onConfirm: () => void
) {
  Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#6c757d",
    confirmButtonText: confimationText,
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#007bff",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}
