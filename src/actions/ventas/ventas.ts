import { makeApiRequest } from "#lib/data-fetch";
import type { ProductoVendido, VentaResponse } from "../../interfaces/venta";

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
