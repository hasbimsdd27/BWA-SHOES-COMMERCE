interface IParamsGetAllCategories {
  name: string;
  page: number;
  limit: number;
}

export const GetAllCategories = (params: IParamsGetAllCategories) => {
  const query = Object.keys(params)
    .map(
      (k) =>
        encodeURIComponent(k) + "=" + encodeURIComponent((params as any)[k])
    )
    .join("&");

  return fetch(`${import.meta.env.VITE_API_URL}/categories?${query}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });
};

export const DeleteCategory = (id: number) => {
  return fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });
};

export const DeleteCategories = (ids: number[]) => {
  return fetch(`${import.meta.env.VITE_API_URL}/category/delete`, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
    body: JSON.stringify({
      ids,
    }),
  });
};

export const EditCategoryName = (name: string, id: number) => {
  return fetch(`${import.meta.env.VITE_API_URL}/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
    body: JSON.stringify({
      name,
    }),
  });
};

export const AddCategoryName = (name: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
    body: JSON.stringify({
      name,
    }),
  });
