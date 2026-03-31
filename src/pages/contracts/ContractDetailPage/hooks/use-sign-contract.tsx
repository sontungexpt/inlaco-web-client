import { useActiveContract } from "@/queries/contract.query";
import { ErrorResponse } from "@/types/api/shared/base.api";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import toast from "react-hot-toast";

export const useSignContract = () => {
  return useActiveContract({
    onSuccess: () => toast.success("Ký kết hợp đồng thành công"),
    onError: (err) => {
      if (err instanceof AxiosError) {
        const response = err.response as AxiosResponse<ErrorResponse>;
        if (
          err.status === HttpStatusCode.BadRequest &&
          response.data.errorCode == "CONTRACT_ERR_002"
        ) {
          toast.error(
            "Hợp đồng chưa đầy đủ thông tin: " +
              response.data.message +
              ". Vui lòng bổ sung hợp đồng.",
          );
        }
        return;
      }
      toast.error("Ký kết thất bại");
    },
  });
};
