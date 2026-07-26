import type { CommonResponse } from "./common";

export type ProductoVendido = {
  precio: number;
  cantidad: number;
  producto_id: string;
};

export type Venta = {
  id: string;
  total: number;
  productos: Pick<ProductoVendido, "producto_id" | "cantidad">[];
};

export interface VentaResponse extends CommonResponse {
  venta: Venta;
}
