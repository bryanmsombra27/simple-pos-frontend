import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getSalesAction } from "../../actions/ventas/ventas";
import { CustomTable } from "#components/custom/CustomTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Venta } from "../../interfaces/venta";
import { BlockChain } from "../../lib/utils";
import useGetGanancias from "../../hooks/ventas/useGetGanancias";
import { Skeleton } from "#components/ui/skeleton";
import ProductoBySale from "./_components/-ProductoBySale";
import PageError from "../../components/custom/PageError";

const ventasQuery = queryOptions({
  queryKey: ["ventas"],
  queryFn: () => getSalesAction(),
});

const columns: ColumnDef<Omit<Venta, "productos">>[] = [
  {
    accessorKey: "id",
    enableHiding: true,
    // cell: ({ row }) =>
    //   row.getCanExpand() ? (
    //     <button onClick={row.getToggleExpandedHandler()}>
    //       {row.getIsExpanded() ? "Collapse" : "Expand"}
    //     </button>
    //   ) : null,
  },

  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <button onClick={row.getToggleExpandedHandler()}>
          {/* {row.getIsExpanded() ? "Collapse" : "Expand"} */}
          {BlockChain.date(row.original.fecha)}
        </button>
      ) : (
        BlockChain.date(row.original.fecha)
      ),
  },

  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => BlockChain.currency(row.original.total),
  },
];

export const Route = createFileRoute("/ventas/")({
  component: Ventas,
  loader: ({ context }) => context.queryClient.ensureQueryData(ventasQuery),
  errorComponent: PageError,
});

function Ventas() {
  const { data } = useSuspenseQuery(ventasQuery);
  const { data: ganancias, error, isPending } = useGetGanancias();

  const subRows = () => {};
  const renderSubRows = (venta: Venta) => {
    return <ProductoBySale id={venta.id} />;
  };

  return (
    <>
      <div className=" container px-10">
        <h3 className="text-2xl font-bold my-5">Ventas </h3>

        <div className="flex gap-5 mb-10 justify-center items-center">
          {isPending ? (
            <>
              <Skeleton className="w-3xs h-32" />
              <Skeleton className="w-3xs h-32" />
              <Skeleton className="w-3xs h-32" />
            </>
          ) : error ? (
            <p>No fue posible mostrar las ganancias</p>
          ) : (
            <>
              <div className="rounded-2xl p-4 flex flex-col gap-4 shadow-md text-center">
                <span className="font-semibold text-2xl">
                  {BlockChain.currency(ganancias!.day)}
                </span>
                <h4 className="text-lg">Ganancias del día</h4>
              </div>
              <div className="rounded-2xl p-4 flex flex-col gap-4  shadow-md text-center">
                <span className="font-semibold text-2xl">
                  {BlockChain.currency(ganancias!.week)}
                </span>
                <h4>Ganancias de la semana </h4>
              </div>
              <div className="rounded-2xl p-4 flex flex-col gap-4  shadow-md text-center">
                <span className="font-semibold text-2xl">
                  {BlockChain.currency(ganancias!.month)}
                </span>
                <h4>Ganancias del mes</h4>
              </div>
            </>
          )}
        </div>

        <CustomTable
          expandedRows={subRows}
          renderExpandedRows={renderSubRows}
          columns={columns}
          showActions={false}
          data={data.ventas}
        />
      </div>
    </>
  );
}
