import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProductAction } from "../../actions/productos/productos";
import type { ProductosFindAllResponse } from "../../interfaces/producto";

const useDeleteProducto = () => {
  const queryClient = useQueryClient();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteProductAction(id),
    onSuccess: async (value) => {
      toast.success(value.message);

      await queryClient.setQueryData(
        ["productos"],
        (state: ProductosFindAllResponse) => {
          return value.producto
            ? ({
                ...state,
                total_registros: state.total_registros - 1,
                productos: state.productos.filter(
                  (producto) => producto.id !== value.producto.id,
                ),
              } as ProductosFindAllResponse)
            : state;
        },
      );
    },
    onError: () => {
      toast.error("No fue posible crear la categoria");
    },
  });

  return {
    data,
    error,
    isPending,
    mutateAsync,
  };
};
export default useDeleteProducto;
