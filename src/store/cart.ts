import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "../interfaces/producto";

interface CarritoCompras {
  producto_id: string;
  cantidad: number;
  precio: number;
}

interface InitialState {
  productos: CarritoCompras[];
}

interface Actions {
  addProduct: (producto: Producto) => void;
  removeProduct: (id: string) => void;
  removeProductFromCart: (id: string) => void;
  clearCart: () => void;
}

type State = InitialState & Actions;

export const usecartStore = create<State>()(
  persist(
    (set, get) => ({
      productos: [],
      removeProduct: (id) => {
        const carrito = get().productos;

        set({
          productos: carrito.map((p) => {
            if (p.producto_id == id && p.cantidad > 1) {
              return {
                ...p,
                cantidad: p.cantidad - 1,
              };
            } else return p;
          }),
        });
      },
      addProduct: (producto) => {
        const carrito = get().productos;

        const productoAgregado = carrito.some(
          (p) => p.producto_id == producto.id,
        );
        if (productoAgregado) {
          set({
            productos: carrito.map((p) => {
              if (p.producto_id == producto.id) {
                return {
                  ...p,
                  cantidad: p.cantidad + 1,
                };
              } else return p;
            }),
          });
        } else {
          set({
            productos: [
              ...carrito,
              {
                producto_id: producto.id,
                cantidad: 1,
                precio: producto.precio,
              },
            ],
          });
        }
      },
      clearCart: () => {
        set({
          productos: [],
        });
      },
      removeProductFromCart: (id) => {
        const carrito = get().productos;

        set({
          productos: carrito.filter((producto) => producto.producto_id != id),
        });
      },
    }),
    { name: "cart" },
  ),
);
