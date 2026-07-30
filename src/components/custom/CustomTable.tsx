import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  createUrl?: string;
  showActions?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  deleteActionFunction?: (value: any) => void;
  expandedRow?: boolean;
}

export function CustomTable<TData, TValue>({
  columns,
  data,
  createUrl = "",
  showActions = true,
  showEdit = true,
  showDelete = true,
  deleteActionFunction,
  expandedRow = false,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        id: false,
      },
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: expandedRow ? getExpandedRowModel() : undefined,
  });

  return (
    <>
      {createUrl && (
        <div className="flex justify-end my-4 mx-2">
          <Link to={createUrl}>
            <Button>
              <BackpackIcon />
              Agregar Producto
            </Button>
          </Link>
        </div>
      )}

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
                {showActions && <TableHead key="actions">Acciones</TableHead>}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <>
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
                    {showActions && (
                      <TableCell className=" ">
                        <div className="flex gap-4 mx-4">
                          {showEdit && (
                            <Link
                              to="/productos/$productoId/edit"
                              params={{ productoId: row.getValue("id")! }}
                            >
                              <EditIcon /> Editar
                            </Link>
                          )}

                          {deleteActionFunction && showDelete && (
                            <button
                              onClick={() => {
                                // handle.openWithPayload(row.original as Producto);
                                deleteActionFunction(row.original);
                              }}
                              className="flex flex-col justify-center items-center"
                            >
                              <Trash2Icon />
                              <span>Eliminar</span>
                            </button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getAllCells().length}>
                        {" "}
                        // The number of columns you wish to span for the
                        expanded data if it is not a row that shares the same
                        columns as the parent row // Your custom UI goes here
                      </td>
                    </tr>
                  )}
                </>
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
    </>
  );
}
