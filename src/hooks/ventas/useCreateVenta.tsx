import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSaleAction } from "../../actions/ventas/ventas";
import type { ProductoVendido } from "../../interfaces/venta";
import type { ProductosFindAllResponse } from "../../interfaces/producto";
import { getRouteApi } from "@tanstack/react-router";

interface BodyMutation {
  productoIds: string[];
  productos: ProductoVendido[];
}

const routeApi = getRouteApi("/mostrador/");

const useCreateVenta = () => {
  const queryClient = useQueryClient();
  const routeSearch = routeApi.useSearch();

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: ({ productoIds, productos }: BodyMutation) =>
      createSaleAction(productoIds, productos),
    onSuccess: async (value) => {
      toast.success(value.message);

      await queryClient.setQueryData(
        ["mostrador", routeSearch],
        (state: ProductosFindAllResponse) => {
          return value.venta
            ? ({
                ...state,
                productos: state.productos.map((p) => {
                  const productoEncontrado = value.venta.productos.find(
                    (pf) => pf.producto_id == p.id,
                  );

                  if (productoEncontrado) {
                    return {
                      ...p,
                      stock: {
                        cantidad:
                          p.stock.cantidad - productoEncontrado.cantidad,
                      },
                    };
                  } else return p;
                }),
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
export default useCreateVenta;
