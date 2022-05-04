import { getCookie } from "../utils/cookieHandler";
import { Store } from "../redux/reducer/rootReducer";
import { SetCartRedux } from "../redux/action/cart";

export const getCartData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
    method: "GET",
    headers: {
      Authorization: getCookie("access_token"),
    },
  });

  const data = await response.json();
  Store.dispatch(SetCartRedux(data) as any);
};
