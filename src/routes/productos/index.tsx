import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProductsAction } from "../../actions/productos/productos";
import type { ColumnDef } from "@tanstack/react-table";
import type { Producto } from "../../interfaces/producto";
import { CustomTable } from "#components/custom/CustomTable";
import { BlockChain } from "../../lib/utils";
import { Dialog as Dialogo } from "@base-ui/react/dialog";
import DeleteProductModal from "./_components/-DeleteProductModal";
import PageError from "../../components/custom/PageError";

const productosQuery = queryOptions({
  queryKey: ["productos"],
  queryFn: () => getProductsAction(),
});

const columns: ColumnDef<Producto>[] = [
  { accessorKey: "id", header: "Id", enableHiding: true },
  {
    accessorKey: "imagen",
    cell: ({ row }) => {
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
    accessorFn: ({ precio }) => BlockChain.currency(precio),
  },
  {
    accessorKey: "stock.cantidad",
    header: "Cantidad en Almacen",
  },
];

export const Route = createFileRoute("/productos/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productosQuery),
  component: Index,
  errorComponent: PageError,
});

function Index() {
  const handle = Dialogo.createHandle<Producto>();
  const { data } = useSuspenseQuery(productosQuery);

  const handleDialog = (producto: Producto) => {
    handle.openWithPayload(producto);
  };

  return (
    <div className=" container px-10">
      <h3 className="text-2xl font-bold my-5">Productos </h3>

      <CustomTable
        createUrl="/productos/new"
        columns={columns}
        data={data.productos}
        deleteActionFunction={handleDialog}
      />

      <DeleteProductModal handle={handle} />
    </div>
  );
}
