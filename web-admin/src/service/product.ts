interface IPayloadProduct {
  name: string;
  price: number;
  description: string;
  tags: string;
  category_id: string;
  galeries: string[];
}

export const AddProductAPI = (payload: IPayloadProduct) =>
  fetch(`${import.meta.env.VITE_API_URL}/product`, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
    body: JSON.stringify(payload),
  });

export const GetAllProductsAPI = (params: {
  limit: number;
  name: string;
  price_from?: number;
  price_to?: number;
  tags?: string;
  categories?: string;
  page: number;
}) => {
  const query = Object.keys(params)
    .map(
      (k) =>
        encodeURIComponent(k) + "=" + encodeURIComponent((params as any)[k])
    )
    .join("&");

  return fetch(`${import.meta.env.VITE_API_URL}/products?${query}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });
};

export const GetDetailProduct = (id: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });

export const UpdateProduct = (payload: IPayloadProduct, id: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
    body: JSON.stringify(payload),
  });

export const DeleteSingleProductAPI = (id: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });
