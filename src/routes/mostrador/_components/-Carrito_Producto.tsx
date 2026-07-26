import type { FC } from "react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "#components/ui/attachment";
import { Minus, Plus, XIcon } from "lucide-react";
import { usecartStore } from "../../../store/cart";
import { useShallow } from "zustand/react/shallow";
import { Button } from "#components/ui/button";
import type { ProductoVendido } from "../../../interfaces/venta";
import useCreateVenta from "../../../hooks/ventas/useCreateVenta";

interface CarritoProductoProps {}
const CarritoProducto: FC<CarritoProductoProps> = ({}) => {
  const { mutateAsync, isPending } = useCreateVenta();
  const productos = usecartStore(useShallow((state) => state.productos));
  const addProduct = usecartStore(useShallow((state) => state.addProduct));
  const clearCart = usecartStore(useShallow((state) => state.clearCart));
  const removeProduct = usecartStore(
    useShallow((state) => state.removeProduct),
  );
  const removeFromCart = usecartStore(
    useShallow((state) => state.removeProductFromCart),
  );
  const total = productos.reduce(
    (acc, item) => acc + item.cantidad * item.precio,
    0,
  );
  const crearOrden = async () => {
    const productosOrden: ProductoVendido[] = [];
    const productoIds: string[] = [];
    for (const producto of productos) {
      productoIds.push(producto.id);
      productosOrden.push({
        cantidad: producto.cantidad,
        precio: producto.precio,
        producto_id: producto.id,
      });
    }
    await mutateAsync({ productoIds, productos: productosOrden });
    clearCart();
  };

  return (
    <>
      <div className="flex flex-col justify-between h-full pb-10">
        <div className="flex flex-col gap-5 mt-5">
          {productos.map((producto) => (
            <Attachment
              key={producto.id}
              className="w-90 mx-auto"
            >
              <AttachmentMedia variant="image">
                <img
                  className=""
                  src={producto.imagen!}
                  alt={producto.nombre}
                />
              </AttachmentMedia>

              <AttachmentContent>
                <AttachmentTitle>{producto.nombre}</AttachmentTitle>
                {/* <AttachmentDescription>keso</AttachmentDescription> */}
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  onClick={() => removeProduct(producto.id)}
                  disabled={producto.cantidad == 1}
                  aria-label={`Reducir un ${producto.nombre} del carrito`}
                >
                  <Minus />
                </AttachmentAction>
                <AttachmentAction
                  aria-label={`cantidad de ${producto.nombre} del carrito`}
                >
                  {producto.cantidad}
                </AttachmentAction>
                <AttachmentAction
                  onClick={() => addProduct(producto)}
                  disabled={producto.cantidad == producto.stock.cantidad}
                  aria-label={`Agregar un ${producto.nombre} al carrito`}
                >
                  <Plus />
                </AttachmentAction>
                <AttachmentAction
                  className="ml-5"
                  onClick={() => removeFromCart(producto.id)}
                  aria-label={`Eliminar ${producto.nombre} del carrito`}
                >
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </div>

        <div className="flex flex-col w-90 mx-auto gap-5">
          <div className="flex justify-between mx-5">
            <span>Total a pagar:</span>
            <span>{total}</span>
          </div>

          <Button
            className=""
            disabled={productos.length == 0 || isPending}
            onClick={crearOrden}
          >
            Realizar Venta
          </Button>
        </div>
      </div>
    </>
  );
};

export default CarritoProducto;
