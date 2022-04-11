export const GetAllCategories = () =>
  fetch(`${process.env.REACT_APP_API_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-type": "application/json;charset=UTF-8",
      Authorization: localStorage.getItem("access_token") || "",
    },
  });
