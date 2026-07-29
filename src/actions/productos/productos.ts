import { makeApiRequest } from "#lib/data-fetch";
import type { Pagination } from "../../interfaces/common";
import type {
  Producto,
  ProductoResponse,
  ProductosFindAllResponse,
} from "../../interfaces/producto";

export const getProductsAction = async (
  pagination?: Pagination,
): Promise<ProductosFindAllResponse> => {
  const data = await makeApiRequest<ProductosFindAllResponse>({
    url: "producto",
    searchParams: pagination,
  });

  return data;
};

export const getProductAction = async (
  productoId: string,
): Promise<Producto> => {
  const data = await makeApiRequest<Producto>({
    url: `producto/${productoId}`,
  });

  return data;
};

export const createProductAction = async (
  formData: FormData,
): Promise<ProductoResponse> => {
  const data = await makeApiRequest<ProductoResponse>({
    url: "producto",
    body: formData,
    method: "POST",
    contentType: "FormData",
  });

  return data;
};
export const updateProductAction = async (
  id: string,
  producto: FormData,
): Promise<ProductoResponse> => {
  const data = await makeApiRequest<ProductoResponse>({
    url: `producto/${id}`,
    body: producto,
    method: "PATCH",
    contentType: "FormData",
  });

  return data;
};
export const deleteProductAction = async (
  id: string,
): Promise<ProductoResponse> => {
  const data = await makeApiRequest<ProductoResponse>({
    url: `producto/${id}`,
    method: "DELETE",
  });

  return data;
};
