import type { FC } from "react";
import type { Producto } from "../../../interfaces/producto";

import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { usecartStore } from "../../../store/cart";

interface ProductosProps {
  productos: Producto[];
}
const Productos: FC<ProductosProps> = ({ productos }) => {
  const addProduct = usecartStore((state) => state.addProduct);

  return (
    <>
      <div className="grid grid-cols-4 gap-10">
        {productos.map((producto) => (
          <Card
            className="relative mx-auto w-full max-w-sm pt-0 flex flex-col justify-between"
            key={producto.id}
          >
            <div className="absolute inset-0 z-30 aspect-video " />
            <img
              src={producto.imagen!}
              alt="Event cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
              <CardAction>
                <Badge variant="secondary">Featured</Badge>
              </CardAction>
              <CardTitle>{producto.nombre}</CardTitle>
              <CardDescription>{producto.descripcion}</CardDescription>
            </CardHeader>

            <CardContent>
              <p>En Almacen: {producto.stock.cantidad}</p>
              <p className="mt-5">
                Precio:{" "}
                {Intl.NumberFormat("es-MX", {
                  currency: "MXN",
                  style: "currency",
                  minimumFractionDigits: 2,
                }).format(producto.precio)}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full "
                onClick={() => {
                  console.log("Entra aqui", producto);
                  addProduct(producto);
                }}
              >
                Agregar al Carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Productos;
