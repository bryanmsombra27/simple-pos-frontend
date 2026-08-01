import {
  type ColumnDef,
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
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BackpackIcon,
  EditIcon,
  Trash2Icon,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  createUrl?: string;
  showActions?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  deleteActionFunction?: (value: any) => void;
  expandedRows?: (value: any) => void;
  renderExpandedRows?: (value?: any) => any;
}

export function CustomTable<TData, TValue>({
  columns,
  data,
  createUrl = "",
  showActions = true,
  showEdit = true,
  showDelete = true,
  deleteActionFunction,
  expandedRows = undefined,
  renderExpandedRows = undefined,
}: DataTableProps<TData, TValue>) {
  // const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        id: false,
      },
      // expanded,
    },
    // onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel:
      expandedRows && renderExpandedRows ? getExpandedRowModel() : undefined,
    // getExpandedRowModel: getExpandedRowModel(),
    // getSubRows: (row) => [],
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
                {expandedRows && <TableHead></TableHead>}

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
                    {expandedRows && (
                      <TableCell>
                        {row.getIsExpanded() ? (
                          <ArrowUpCircle
                            className="cursor-pointer"
                            onClick={() => row.toggleExpanded(false)}
                          />
                        ) : (
                          <ArrowDownCircle
                            className="cursor-pointer"
                            onClick={() => {
                              row.toggleExpanded(true);
                              expandedRows(row.original);
                            }}
                          />
                        )}
                      </TableCell>
                    )}

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
                        {renderExpandedRows && renderExpandedRows(row.original)}
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
