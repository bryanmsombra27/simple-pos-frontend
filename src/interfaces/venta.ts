import type { CommonFindAllResponse, CommonResponse } from "./common";

export type ProductoVendido = {
  precio: number;
  cantidad: number;
  producto_id: string;
};

export type Venta = {
  id: string;
  total: number;
  productos: Pick<ProductoVendido, "producto_id" | "cantidad">[];
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
