import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

interface ToastAlert {
  type: "success" | "error" | "info" | "warning";
  message: string;
  options?: ToastOptions;
}

const useToast = () => {
  const setToastAlert = ({ type, message, options }: ToastAlert) => {
    switch (type) {
      case "success":
        toast.success(`${message}`, options);
        break;
      case "error":
        toast.error(`${message}`, options);
        break;
      case "info":
        toast.info(`${message}`, options);
        break;
      case "warning":
        toast.warning(`${message}`, options);
        break;
      default:
        toast(`${message}`, options);
        break;
    }
  };

  return { setToastAlert };
};
export default useToast;
