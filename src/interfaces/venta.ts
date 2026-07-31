import type { CommonFindAllResponse, CommonResponse } from "./common";
import type { Producto } from "./producto";

export type VentaPorProducto = {
  precio: number;
  cantidad: number;
  producto_id: string;
  producto?: Partial<Producto>;
};

export type Venta = {
  id: string;
  total: number;
  productos: Partial<VentaPorProducto>[];
  fecha: string;
};

export interface VentaResponse extends CommonResponse {
  venta: Venta;
}

export interface VentasFindAllResponse extends CommonFindAllResponse {
  ventas: Venta[];
}

export interface VentasEarningsResponse {
  day: number;
  week: number;
  month: number;
}
