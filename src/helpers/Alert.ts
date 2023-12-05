import type { SweetAlertOptions } from "sweetalert2";
import Swal from "sweetalert2";

export const Alert = (options: SweetAlertOptions) => {
    return Swal.fire({
        ...options,
        confirmButtonColor: "#00a550",
        cancelButtonColor: "#EB2626",
        denyButtonColor: "#0dcaf0",
        customClass: {
            closeButton: "btn btn-info",
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
            denyButton: "btn btn-info",
            popup: "card shadow border-0"
        }
    });
}
