import { useQueryClient } from "@tanstack/react-query";
import useGetProductosByIdVenta from "../../../hooks/ventas/useGetProductosByIdVenta";
import type { FC } from "react";
import type { Venta } from "../../../interfaces/venta";
import { Skeleton } from "#components/ui/skeleton";

interface ProductoBySaleProps {
  id: string;
}
const ProductoBySale: FC<ProductoBySaleProps> = ({ id }) => {
  const { error, isPending } = useGetProductosByIdVenta(id);
  const queryClient = useQueryClient();
  const venta = queryClient.getQueryData(["venta", id]) as Venta;

  if (isPending)
    return (
      <div className="grid grid-cols-4 p-10 items-center">
        <Skeleton className="w-40 h-40" />
        <Skeleton className="w-60 h-2" />
        <Skeleton className="w-60 h-2" />
        <Skeleton className="w-60 h-2" />
      </div>
    );

  if (error) return <p>No fue posible cargar los productos</p>;

  return (
    <>
      <h1 className="font-semibold text-xl  m-5 text-center">
        Listado de productos comprados{" "}
      </h1>

      {venta?.productos.map((producto) => (
        <div className="grid grid-cols-4 p-10 items-center">
          <img
            width={150}
            src={producto.producto?.imagen}
            alt={producto.producto?.nombre}
          />
          <span>{producto.producto?.nombre}</span>
          <span>{producto.cantidad}</span>
          <span>{producto.precio}</span>
        </div>
      ))}
    </>
  );
};

export default ProductoBySale;
