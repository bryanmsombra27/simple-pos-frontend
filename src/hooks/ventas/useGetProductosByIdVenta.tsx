import { useQuery } from "@tanstack/react-query";
import { getProductsBySaleAction } from "../../actions/ventas/ventas";

const useGetProductosByIdVenta = (id: string) => {
  const { data, error, isPending } = useQuery({
    queryFn: () => getProductsBySaleAction(id),
    queryKey: ["venta", id],
    enabled: !!id,
  });

  return {
    data,
    error,
    isPending,
  };
};
export default useGetProductosByIdVenta;
