import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import { Field, FieldLabel } from "#components/ui/field";

import { createFileRoute } from "@tanstack/react-router";
import {
  BarcodeFormat,
  BarcodeScanner,
  type DetectedBarcode,
} from "react-barcode-scanner";
import "react-barcode-scanner/polyfill";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "#components/ui/input-group";
import { useEffect, useRef, useState } from "react";
import Productos from "./_components/-Productos";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProductsAction } from "../../actions/productos/productos";
import { usecartStore } from "../../store/cart";
import { useShallow } from "zustand/react/shallow";

import * as z from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "#components/ui/drawer";
import CarritoProducto from "./_components/-Carrito_Producto";
import useGetProduct from "../../hooks/productos/useGetProduct";
import PageError from "../../components/custom/PageError";

type SearchingParams = {
  page: number;
  search: string;
};

const formats: BarcodeFormat[] = [
  BarcodeFormat.CODABAR,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

const productosQueryOptions = (search: SearchingParams) =>
  queryOptions({
    queryKey: ["mostrador", search],
    queryFn: () => getProductsAction(search),
  });

const searchSchema = z.object({
  page: z.number().optional().default(1),
  search: z.string().optional().default(""),
});

export const Route = createFileRoute("/mostrador/")({
  component: Mostrador,
  loaderDeps: ({ search }) => ({
    page: search.page,
    search: search.search,
  }),
  validateSearch: searchSchema,
  loader: ({ context, deps }) => {
    return context.queryClient.ensureQueryData(productosQueryOptions(deps));
  },
  errorComponent: PageError,
});

function Mostrador() {
  const search = Route.useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useSuspenseQuery(productosQueryOptions(search));
  const navigate = Route.useNavigate();
  const [barcodeScan, setBarcdeScan] = useState<string>("");
  const productos = usecartStore(useShallow((state) => state.productos));
  const addProduct = usecartStore(useShallow((state) => state.addProduct));
  const cantidadProductos = productos.reduce(
    (acc, item) => acc + item.cantidad,
    0,
  );
  const { data: producto } = useGetProduct(barcodeScan);

  const scanner = (barcode: DetectedBarcode[]) => {
    if (barcode.length > 0) {
      setBarcdeScan(barcode[0].rawValue);
    }
  };
  useEffect(() => {
    if (producto && producto.id) {
      addProduct(producto);
    }
    setBarcdeScan("");
  }, [producto]);

  const hangleSearch = () => {
    if (inputRef.current?.value.length! == 0) {
      inputRef.current!.value = "";
      navigate({
        from: Route.fullPath,
        search: (prev) => ({
          ...prev,
          search: inputRef.current?.value ?? "",
        }),
      });
      return;
    }

    if (inputRef.current?.value.length! > 2) {
      navigate({
        from: Route.fullPath,
        search: (prev) => {
          return {
            ...prev,
            search: inputRef.current?.value ?? "",
          };
        },
      });
    }
  };

  return (
    <div className="p-10">
      <div className="flex gap-5 items-center w-full justify-center my-10">
        <div className="h-32 w-28">
          {data && (
            <BarcodeScanner
              onCapture={scanner}
              // hidden={open}
              options={{
                formats,
                delay: 1000,
              }}
            />
          )}
        </div>
        <Field className="max-w-sm">
          <FieldLabel>Búsqueda de Producto</FieldLabel>
          <InputGroup>
            <InputGroupInput
              ref={inputRef}
              onChange={hangleSearch}
              placeholder="Buscar un producto..."
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>

        <div className=" relative">
          <span className="absolute -top-5 left-3 rounded-full bg-amber-500 p-1 text-white ">
            {cantidadProductos}
          </span>
          <Drawer swipeDirection="right">
            <DrawerTrigger>
              <ShoppingCartIcon className="cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Carrito de Compras</DrawerTitle>
                <DrawerDescription>
                  Aquí se muestran los productos que serán adquiridos por el
                  cliente
                </DrawerDescription>
              </DrawerHeader>
              <CarritoProducto />
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {data ? (
        <Productos productos={data.productos} />
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </div>
  );
}
