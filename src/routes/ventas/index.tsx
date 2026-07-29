import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getSalesAction } from "../../actions/ventas/ventas";
import { CustomTable } from "#components/custom/CustomTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Venta } from "../../interfaces/venta";

const ventasQuery = queryOptions({
  queryKey: ["ventas"],
  queryFn: () => getSalesAction(),
});

const columns: ColumnDef<Omit<Venta, "productos">>[] = [
  {
    accessorKey: "id",
    enableHiding: true,
  },

  {
    accessorKey: "fecha",
    header: "Fecha",
  },

  {
    accessorKey: "total",
    header: "Total",
  },
];

export const Route = createFileRoute("/ventas/")({
  component: Ventas,
  loader: ({ context }) => context.queryClient.ensureQueryData(ventasQuery),
});

function Ventas() {
  const { data } = useSuspenseQuery(ventasQuery);

  console.log(data);

  return (
    <>
      <div className=" container px-10">
        <h3 className="text-2xl font-bold my-5">Ventas </h3>

        <CustomTable
          columns={columns}
          data={data.ventas}
        />
      </div>
    </>
  );
}
