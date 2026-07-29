import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table";
import { Button } from "#components/ui/button";
import { Link } from "@tanstack/react-router";
import { BackpackIcon, EditIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";
import { Dialog as Dialogo } from "@base-ui/react/dialog";

import type { Producto } from "../../interfaces/producto";
import useDeleteProducto from "../../hooks/productos/useDeleteProducto";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function CustomTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });
  const { mutateAsync } = useDeleteProducto();

  const handle = Dialogo.createHandle<Producto>();

  return (
    <>
      <div className="flex justify-end my-4 mx-2">
        <Link to="/productos/new">
          <Button>
            <BackpackIcon />
            Agregar Producto
          </Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
                <TableHead key="actions">Acciones</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                  <TableCell className=" ">
                    <div className="flex gap-4 mx-4">
                      <Link
                        to="/productos/$productoId/edit"
                        params={{ productoId: row.getValue("id")! }}
                      >
                        <EditIcon /> Editar
                      </Link>
                      <button
                        onClick={() => {
                          handle.openWithPayload(row.original as Producto);
                        }}
                        className="flex flex-col justify-center items-center"
                      >
                        <Trash2Icon />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length ?? 0}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        handle={handle}
        triggerId="delete-producto"
      >
        {({ payload }) => (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                ¿Está seguro de eliminar este producto?{" "}
              </DialogTitle>
              {payload !== undefined && (
                <DialogDescription>
                  El producto{" "}
                  <span className="font-bold italic">
                    {(payload as any).nombre}
                  </span>
                  será eliminado junto con su cantidad de almacenamiento (
                  {(payload as any).stock.cantidad}
                  ). ¿Desea eliminarlo?
                  <div className="flex justify-between mt-5">
                    <Button
                      variant="ghost"
                      onClick={() => handle.close()}
                    >
                      Cancelar
                    </Button>

                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        handle.close();

                        setTimeout(() => {
                          mutateAsync((payload as any).id);
                        }, 500);
                      }}
                    >
                      Si, Eliminalo
                    </Button>
                  </div>
                </DialogDescription>
              )}
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
