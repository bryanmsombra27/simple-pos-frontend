import { useQuery } from "@tanstack/react-query";
import { getEarningsAction } from "../../actions/ventas/ventas";

const useGetGanancias = () => {
  const { data, error, isPending } = useQuery({
    queryFn: getEarningsAction,
    queryKey: ["ganancias"],
  });

  return {
    data,
    error,
    isPending,
  };
};
export default useGetGanancias;
