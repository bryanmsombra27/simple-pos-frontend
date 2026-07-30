import { makeApiRequest } from "#lib/data-fetch";
import type { Pagination } from "../../interfaces/common";
import type {
  ProductoVendido,
  VentaResponse,
  VentasEarningsResponse,
  VentasFindAllResponse,
} from "../../interfaces/venta";

export const createSaleAction = async (
  productoIds: string[],
  productos: ProductoVendido[],
): Promise<VentaResponse> => {
  const data = await makeApiRequest<VentaResponse>({
    url: "ordenes",
    method: "POST",
    body: {
      productos,
      productoIds,
    },
  });

  return data;
};

export const getSalesAction = async (
  pagination?: Pagination,
): Promise<VentasFindAllResponse> => {
  const data = await makeApiRequest<VentasFindAllResponse>({
    url: "ordenes",
    searchParams: pagination,
  });

  return data;
};

export const getEarningsAction = async (): Promise<VentasEarningsResponse> => {
  const data = await makeApiRequest<VentasEarningsResponse>({
    url: "ordenes/earnings",
  });

  return data;
};
