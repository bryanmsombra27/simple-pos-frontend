import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProductsAction } from "../../actions/productos/productos";
import type { ColumnDef } from "@tanstack/react-table";
import type { Producto } from "../../interfaces/producto";
import { CustomTable } from "#components/custom/CustomTable";

const productosQuery = queryOptions({
  queryKey: ["productos"],
  queryFn: () => getProductsAction(),
});

const columns: ColumnDef<Producto>[] = [
  { accessorKey: "id", header: "Id", enableHiding: true },
  {
    accessorKey: "imagen",
    cell: ({ cell, row }) => {
      return (
        <img
          className="rounded-3xl"
          width={100}
          height={100}
          src={row.original.imagen!}
          alt={`producto ${row.original.nombre}`}
        />
      );
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre del producto",
  },
  {
    header: "Precio del producto",
    accessorFn: ({ precio }) =>
      Intl.NumberFormat("es-MX", {
        currency: "MXN",
        style: "currency",
        minimumFractionDigits: 2,
      }).format(precio),
  },
  {
    accessorKey: "stock.cantidad",
    header: "Cantidad en Almacen",
  },
];

export const Route = createFileRoute("/productos/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productosQuery),
  component: Index,
});

function Index() {
  const { data } = useSuspenseQuery(productosQuery);

  return (
    <div className=" container px-10">
      <h3 className="text-2xl font-bold my-5">Productos </h3>

      <CustomTable
        columns={columns}
        data={data.productos}
      />
    </div>
  );
}
