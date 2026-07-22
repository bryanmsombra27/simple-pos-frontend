import type { CommonFindAllResponse } from "./common";

export type Producto = {
  id: string;
  precio: number;
  nombre: string;
  imagen: string | null;
  descripcion: string | null;
  codigo_barras: string;
  stock: {
    cantidad: number;
  };
};

export interface ProductosFindAllResponse extends CommonFindAllResponse {
  productos: Producto[];
}
export interface ProductoResponse {
  message: string;
  producto: Producto;
}

export interface ProductoForm {
  precio: number;
  nombre: string;
  codigo_barras: string;
  descripcion?: string;
  almacen: number;
}
