import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Producto } from "../interfaces/producto";

interface CarritoCompras extends Producto {
  cantidad: number;
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
        set((state) => ({
          productos: state.productos.map((p) => {
            if (p.id == id && p.cantidad > 1) {
              return {
                ...p,
                cantidad: p.cantidad - 1,
              };
            } else return p;
          }),
        }));
      },
      addProduct: (producto) => {
        const carrito = get().productos;

        const productoAgregado = carrito.some((p) => p.id == producto.id);
        if (productoAgregado) {
          set((state) => ({
            productos: state.productos.map((p) => {
              if (p.id == producto.id) {
                return {
                  ...p,
                  cantidad: p.cantidad + 1,
                };
              } else return p;
            }),
          }));
        } else {
          set((state) => ({
            productos: [
              ...state.productos,
              {
                ...producto,
                cantidad: 1,
              },
            ],
          }));
        }
      },
      clearCart: () => {
        set(() => ({
          productos: [],
        }));
      },
      removeProductFromCart: (id) => {
        set((state) => ({
          productos: state.productos.filter((producto) => producto.id != id),
        }));
      },
    }),
    { name: "cart" },
  ),
);
