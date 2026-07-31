import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProductAction } from "../../actions/productos/productos";
import type {
  ProductoResponse,
  ProductosFindAllResponse,
} from "../../interfaces/producto";
import { useNavigate } from "@tanstack/react-router";
type MutationBody = {
  producto: FormData;
  id: string;
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: ({ id, producto }: MutationBody) =>
      updateProductAction(id, producto),
    onSuccess: async (value) => {
      toast.success(value.message);
      await queryClient.setQueryData(
        ["producto", value.producto.id],
        (state: ProductoResponse) => {
          return value.producto
            ? ({
                ...state,
                producto: value.producto,
              } as ProductoResponse)
            : state;
        },
      );
      await queryClient.setQueryData(
        ["productos"],
        (state: ProductosFindAllResponse) => {
          return value.producto
            ? ({
                ...state,
                productos: state.productos.map((p) => {
                  if (p.id == value.producto.id) {
                    return value.producto;
                  } else return p;
                }),
              } as ProductosFindAllResponse)
            : state;
        },
      );

      navigate({ to: "/productos" });
    },
    onError: () => {
      toast.error("No fue posible  actualizar la información del producto");
    },
  });

  return {
    data,
    error,
    isPending,
    mutateAsync,
  };
};
export default useUpdateProduct;
