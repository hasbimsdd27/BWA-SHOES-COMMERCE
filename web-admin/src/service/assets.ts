export const UploadAssets = async (payload: FormData) =>
  fetch(`${import.meta.env.VITE_API_URL}/assets`, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("access_token") || "" },
    body: payload,
  });

export const DeleteAssets = async (filename: string) =>
  fetch(`${import.meta.env.VITE_API_URL}/assets/${filename}`, {
    method: "DELETE",
    headers: { Authorization: localStorage.getItem("access_token") || "" },
  });
