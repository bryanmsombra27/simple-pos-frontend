import type { FC } from "react";
import type { Producto } from "../../../interfaces/producto";

import { Button } from "#components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#components/ui/card";
import { usecartStore } from "../../../store/cart";
import { BlockChain } from "../../../lib/utils";

interface ProductosProps {
  productos: Producto[];
}
const Productos: FC<ProductosProps> = ({ productos }) => {
  const addProduct = usecartStore((state) => state.addProduct);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {productos.map((producto) => (
          <Card
            className="relative mx-auto w-full max-w-sm pt-0 flex flex-col justify-between"
            key={producto.id}
          >
            <div className="absolute inset-0 z-30  " />
            <img
              src={producto.imagen!}
              alt="Event cover"
              className="relative z-20 w-full object-cover "
            />
            <CardHeader>
              <CardTitle>{producto.nombre}</CardTitle>
              <CardDescription>{producto.descripcion}</CardDescription>
            </CardHeader>

            <CardContent>
              <p>En Almacen: {producto.stock.cantidad}</p>
              <p className="mt-5">
                Precio: {BlockChain.currency(producto.precio)}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full "
                onClick={() => {
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
