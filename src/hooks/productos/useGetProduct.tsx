import { useQuery } from "@tanstack/react-query";
import { getProductAction } from "../../actions/productos/productos";

const useGetProduct = (id: string) => {
  const { data, error, isPending } = useQuery({
    queryFn: () => getProductAction(id),
    queryKey: ["producto", id],
    enabled: !!id,
  });

  return {
    data,
    error,
    isPending,
  };
};
export default useGetProduct;
