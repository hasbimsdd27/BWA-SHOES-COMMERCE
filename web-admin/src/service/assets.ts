export const UploadAssets = async (payload: FormData) =>
  fetch(`${process.env.REACT_APP_API_URL}/assets`, {
    method: "POST",
    headers: { Authorization: localStorage.getItem("access_token") || "" },
    body: payload,
  });