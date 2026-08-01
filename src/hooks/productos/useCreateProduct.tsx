import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProductAction } from "../../actions/productos/productos";
import type { ProductosFindAllResponse } from "../../interfaces/producto";

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: (formData: FormData) => createProductAction(formData),
    onSuccess: async (value) => {
      toast.success(value.message);

      await queryClient.setQueryData(
        ["productos"],
        (state: ProductosFindAllResponse) => {
          return value.producto
            ? ({
                ...state,
                total_registros: state.total_registros + 1,
                productos: [value.producto, ...state.productos],
              } as ProductosFindAllResponse)
            : state;
        },
      );
    },
    onError: () => {
      toast.error("No fue posible crear el producto");
    },
  });

  return {
    data,
    error,
    isPending,
    mutateAsync,
  };
};
export default useCreateProduct;
